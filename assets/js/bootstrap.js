require('../../vendor/angular/angular'); // 1.4.0
require('./modules/d3');
require('./modules/directives');

angular.module('kitApp', ['d3', 'kitApp.directives'])
  .run(function($rootScope){

  });

  //.value('valueName', 123)
  //
  //.factory('factoryName', ['d3', function(d3){
  //  d3.select('.class')// - BAD
  //}])
  //
  //.service('serviceName', ['valueName', SomeClass]);

//function SomeClass(valueName) {
//  this.value = valueName;
//}



// Module
//   Constant
//   Value
//   Factory
//   Service
//   Provider


// SPA





// modules

// dependencies
// dependency injection
