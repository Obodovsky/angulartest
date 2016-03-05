module.exports = ['d3Factory', function (d3Factory) {
  // DDO - Directive Definition Object
  return {
    scope: true,
    restrict: 'A',
    priority: 1,
    link: function ($scope, $element, $attrs) {
      d3Factory.then(function (d3) {
        $scope.shape.moniker = 'core.tshape';

        //function place

        drawTShape(d3, $scope.shape.svg.d3Object, $scope.editor.features.pixelsPerMm, 2.5, 5, 2, 2);
      });
    }
  };
}];
