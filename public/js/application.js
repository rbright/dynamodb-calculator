String.prototype.repeat = function (num) {
  return new Array(Math.round(num) + 1).join(this);
};

window.DynamoCalculator = {
  tableSize: 1,
  readCapacity: 1000,
  writeCapacity: 1000,

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

  getCost: function() {
    var costPerHour = 0.0065;
    var hoursPerMonth = 720;

    var storageCost = this.tableSize * 0.25;
    var readCost = this.readCapacity / 50 * costPerHour * hoursPerMonth;
    var writeCost = this.writeCapacity / 10 * costPerHour * hoursPerMonth;

    return (storageCost + readCost + writeCost).toFixed(2);
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
    $(".table-size-value").text(this.tableSize + " GB");
    this.updatePartitionCountComponents();
    this.updateCost();
  },

  updateReadCapacityComponent: function() {
    $(".read-capacity-value").text(this.readCapacity + " IOPS");
    this.updatePartitionCountComponents();
    this.updateCost();
  },

  updateWriteCapacityComponent: function() {
    $(".write-capacity-value").text(this.writeCapacity + " IOPS");
    this.updatePartitionCountComponents();
    this.updateCost();
  },

  updatePartitionCountComponents: function() {
    var partitionCount = this.getPartitionCount();
    var partitionReadCapacity = this.getPartitionReadCapacity();
    var partitionWriteCapacity = this.getPartitionWriteCapacity();

    $(".partition-count").text(partitionCount + " partitions");
    $(".partition-read-capacity").text(partitionReadCapacity + " IOPS");
    $(".partition-write-capacity").text(partitionWriteCapacity + " IOPS");
  },

  updateCost: function() {
    var cost = this.getCost();
    $(".cost").text("$" + cost);
  }
};

(function($) {
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
        });
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
        });
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
        });
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
