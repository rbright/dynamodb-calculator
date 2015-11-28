String.prototype.repeat = function (num) {
  return new Array(Math.round(num) + 1).join(this);
};

window.DynamoCalculator = {
  tableSize: 50,
  readCapacity: 3000,
  writeCapacity: 10000,

  getPartitionCountByTableSize: function() {
    return Math.ceil(this.tableSize / 10);
  },

  getPartitionCountByCapacity: function() {
    return Math.ceil((this.readCapacity / 3000) + (this.writeCapacity / 1000));
  },

  getPartitionCount: function() {
    var partitionCountByTableSize = this.getPartitionCountByTableSize();
    var partitionCountByCapacity = this.getPartitionCountByCapacity();
    return Math.max(partitionCountByTableSize, partitionCountByCapacity);
  },

  getPartitionReadCapacity: function() {
    return Math.round(this.readCapacity / this.getPartitionCount());
  },

  getPartitionWriteCapacity: function() {
    return Math.round(this.writeCapacity / this.getPartitionCount());
  },

  setTableSize: function(tableSize) {
    this.tableSize = tableSize;
  },

  setReadCapacity: function(readCapacity) {
    this.readCapacity = readCapacity;
  },

  setWriteCapacity: function(writeCapacity) {
    this.writeCapacity = writeCapacity;
  },

  updateTableSizeComponent: function() {
    $("#table-size-value").text(this.tableSize + " GB");
    this.updatePartitionCountComponents();
  },

  updateReadCapacityComponent: function() {
    $("#read-capacity-value").text(this.readCapacity + " IOPS");
    this.updatePartitionCountComponents();
  },

  updateWriteCapacityComponent: function() {
    $("#write-capacity-value").text(this.writeCapacity + " IOPS");
    this.updatePartitionCountComponents();
  },

  updatePartitionCountComponents: function() {
    var partitionCount = this.getPartitionCount();
    var partitionReadCapacity = this.getPartitionReadCapacity();
    var partitionWriteCapacity = this.getPartitionWriteCapacity();

    $("#partition-count").text(partitionCount + " partitions");
    $("#partition-read-capacity").text(partitionReadCapacity + " IOPS");
    $("#partition-write-capacity").text(partitionWriteCapacity + " IOPS");
  }
};

(function($) {
  $.fn.addSliderSegments = function() {
    return this.each(function() {
      var $this = $(this),
          option = $this.slider('option'),
          amount = (option.max - option.min) / option.step,
          orientation = option.orientation;

      if (orientation === 'vertical') {
        var output = '';
        for (var i = 1; i <= amount - 1; i++) {
          output += '<div class="ui-slider-segment" style="top:' + 100 / amount * i + '%;"></div>';
        }
        $this.prepend(output);
      } else {
        var segmentGap = 100 / (amount) + '%';
        var segment = '<div class="ui-slider-segment" style="margin-left: ' + segmentGap + ';"></div>';
        $this.prepend(segment.repeat(amount - 1));
      }
    });
  };

  $(function() {
    var setupTableSize = function() {
      var $slider = $("#table-size");
      if ($slider.length > 0) {
        $slider.slider({
          min: 1,
          max: 300,
          value: window.DynamoCalculator.tableSize,
          orientation: "horizontal",
          range: "min",
          slide: function(event, ui) {
            window.DynamoCalculator.setTableSize(ui.value);
            window.DynamoCalculator.updateTableSizeComponent();
          }
        }).addSliderSegments($slider.slider("option").max);
      }
    };

    var setupReadCapacity = function() {
      var $slider = $("#read-capacity");
      if ($slider.length > 0) {
        $slider.slider({
          min: 1,
          max: 40,
          value: Math.round(window.DynamoCalculator.readCapacity / 1000),
          orientation: "horizontal",
          range: "min",
          slide: function(event, ui) {
            window.DynamoCalculator.setReadCapacity(ui.value * 1000);
            window.DynamoCalculator.updateReadCapacityComponent();
          }
        }).addSliderSegments($slider.slider("option").max);
      }
    };

    var setupWriteCapacity = function() {
      var $slider = $("#write-capacity");
      if ($slider.length > 0) {
        $slider.slider({
          min: 1,
          max: 40,
          value: Math.round(window.DynamoCalculator.writeCapacity / 1000),
          orientation: "horizontal",
          range: "min",
          slide: function(event, ui) {
            window.DynamoCalculator.setWriteCapacity(ui.value * 1000);
            window.DynamoCalculator.updateWriteCapacityComponent();
          }
        }).addSliderSegments($slider.slider("option").max);
      }
    };

    setupTableSize();
    setupReadCapacity();
    setupWriteCapacity();

    window.DynamoCalculator.updateTableSizeComponent();
    window.DynamoCalculator.updateReadCapacityComponent();
    window.DynamoCalculator.updateWriteCapacityComponent();
    window.DynamoCalculator.updatePartitionCountComponents();
  });
})(jQuery);
