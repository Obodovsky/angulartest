angular.module('kitApp.directives', [])
  .directive('kitCustomShape', require('../directives/kitCustomShape'))
  .directive('kitRect', require('../directives/kitRect'))
  .directive('kitTriangle', require('../directives/kitTriangle'))
  .directive('kitTShape', require('../directives/kitTShape'))
  .directive('kitGear', require('../directives/kitGear'))
  .directive('kitScrew', require('../directives/kitScrew'))
  .directive('kitEditor', require('../directives/kitEditor'));
