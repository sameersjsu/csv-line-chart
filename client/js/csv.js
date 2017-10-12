// Controller
csvApp.controller('CsvController', ['$scope', 'CsvService', function ($scope, CsvService) {

  // Placeholder element that holds line chart
  var $seriesChart = $("#seriesChart");
  // Placeholder element that holds grid
  var $seriesGrid = $('#seriesGrid');
  
  // Triggered on file selection
  // Parses CSV file data and sends a JSON object to the server
  $scope.parseCsv = function (event) {
    var files = event.files;
    var fileName = files[0].name;
    var fileType = fileName.split('.').pop().toLowerCase();
    if (fileType !== 'csv') {
      alert('Please select a file of type *.csv.');
      // Clearing file control
      $("#csvFile").replaceWith($("#csvFile").val('').clone(true));
      return;
    }
    var reader = new FileReader();
    reader.onload = function (event) {
      var content = event.target.result;
      content = convertToJson(content);
      CsvService.saveDataPoints(content, cbSaveData);
    };
    reader.readAsText(files[0]);
  };

  // Helper function to convert CSV file
  // text into JSON
  function convertToJson (content) {
    var rows = content.split('\n');
    var output = [];
    for (var i = 0, len = rows.length; i < len; i++) {
      var cells = rows[i].split(',');
      output[i] = {
        'name': cells[0],
        'series': []
      };
      for (var j = 1, len2 = cells.length; j < len2 - 1; j++) {
        var cell = cells[j].split('|');
        output[i].series.push([+cell[0], +cell[1]])
      }
    }
    return output;
  }

  // Callback that will handle rendering of
  // grid data
  function cbSaveData (response) {
    let data = response.data.data;
    var table = $seriesGrid.DataTable({
      data: data,
      searching: false,
      columns: [{
        'title': 'Series name',
        'data': "name"
      }, {
        'title': 'Created',
        'data': 'created'
      }, {
        'title': 'Generate chart',
        'data': 'id',
        'visible': false
      }, {
        'data': null,
        'defaultContent': "<button class='btn-sm btn-primary'>Generate chart</button>"
      }]
    });

    $seriesGrid.find('tbody').on('click', 'button', function () {
      var data = table.row($(this).parents('tr') ).data();
      CsvService.getDataPoints(data.id, renderChart);
    });
  }

  // Callback that will handle rendering of line chart
  function renderChart (response) {
    var data = response.data.data;
    var series = JSON.parse(data.series);
    $.plot($seriesChart, [{
      data: series,
      lines: {
        show: true
      }
    }]);
  }
}]);

/**
 * @namespace CsvService
 */
csvApp.service('CsvService', ['$http', 'AppService', function ($http, AppService) {

  /**
   * @name saveDataPoints
   * @desc Makes API call to save user uploaded
   * series data on the server
   * @param {array} content
   * @callback cb
   */
  var saveDataPoints = function (content, cb) {
    $http({
      method: 'POST',
      url: AppService.getServerUrl('/series'),
      data: content
    }).then(function success (response) {
      cb(response);
    }, function error (response) {
      cb(response);
    });
  };

  /**
   * @name saveDataPoints
   * @desc Makes API call to get series data
   * based on given id
   * @param {string} id
   * @callback cb
   */
  var getDataPoints = function (id, cb) {
    $http({
      method: 'GET',
      url: AppService.getServerUrl('/series'),
      params: {
        id: id
      }
    }).then(function success (response) {
      cb(response);
    }, function error (response) {
      cb(response);
    });
  };

  return {
    saveDataPoints: saveDataPoints,
    getDataPoints: getDataPoints
  };
}]);