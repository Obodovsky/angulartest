angular.module('kitApp.directives', [])
  .directive('kitCustomShape', require('../directives/kitCustomShape'))
  .directive('kitRect', require('../directives/kitRect'))
  .directive('kitTShape', require('../directives/kitTShape'))
  .directive('kitEditor', require('../directives/kitEditor'));
