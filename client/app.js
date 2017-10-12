// Creating and initializing angular module
var csvApp = angular.module('csvApp', ['ngRoute']);

// Route configuration
csvApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.when('/csv', {
    templateUrl: 'views/csv.html',
    controller: 'CsvController'
  }).when('/', {
    redirectTo: '/csv'
  }).otherwise({
    redirectTo: '/csv'
  });

  // To avoid issue with #! in the url
  $locationProvider.hashPrefix('');
}]);

// Angular constant that holds server url information
csvApp.constant('SERVER_INFO', {
  host: '127.0.0.1',
  port: 3000
});

// App controller
csvApp.controller('AppController', ['$scope', function ($scope) {

  // By default setting the active menu to 'Upload'
  $scope.activeMenu = 'Upload';

  $scope.setActiveMenu = function (menu) {
    $scope.activeMenu = menu;
  };
  
}]);

/**
 * @namespace AppService
 */
csvApp.service('AppService', ['SERVER_INFO', function (SERVER_INFO) {

  /**
   * @name getServerUrl
   * @desc Returns server url based on given
   * api url
   * @param {string} url
   * @returns {string}
   */
  var getServerUrl = function (url) {
    return 'http://' + SERVER_INFO.host + ':' + SERVER_INFO.port + url;
  };

  return {
    getServerUrl: getServerUrl
  };

}]);

