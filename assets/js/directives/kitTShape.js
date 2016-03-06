module.exports = ['d3Factory', 'kitSystemShapeDrawerFactory', function (d3Factory, drawer) {
  // DDO - Directive Definition Object
  return {
    scope: true,
    restrict: 'A',
    priority: 1,
    link: function ($scope, $element, $attrs) {
      d3Factory.then(function (d3) {
        $scope.shape.moniker = 'core.tshape';

        drawer.drawTShape(d3, $scope.shape.svg.d3Object, $scope.editor.features.pixelsPerMm, 2.5, 5, 2, 2);
      });
    }
  };
}];
