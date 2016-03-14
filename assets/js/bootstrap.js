require('../../vendor/angular/angular'); // 1.4.0
require('../../vendor/angular-ui-router/release/angular-ui-router');
require('./modules/d3');
require('./modules/directives');
require('./modules/services');

var app = angular.module('kitApp', ['d3', 'kitApp.directives', 'kitApp.services', 'ui.router'])
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
  }]);

app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode({
    enabled:     true,
    requireBase: false
  })
}]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
  function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider
      .state('index', {
        url:         '/',
        templateUrl: 'partials/index_special'
      })
      .state('test123', {
        url:         '/test123',
        templateUrl: 'partials/test_special'
      });
  }]);


app.run(['$rootScope', function($rootScope) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    console.log(arguments);
  });
}]);
