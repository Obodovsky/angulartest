require('../../vendor/angular/angular'); // 1.4.0
require('./modules/d3');
require('./modules/directives');
require('./modules/services');

angular.module('kitApp', ['d3', 'kitApp.directives', 'kitApp.services']);

//class A extends B {
//  constructor(param1){
//    super(param1);
//  }
//
//  method1(){
//  }
//}
//
//
//function A() {
//  B.call(this, param1);
//}
//A.prototype = Object.create(B.prototype);
//A.prototype.constructor = A;
//
//A.prototype.method1 = function(){
//}
