module.exports = ['d3Factory',
  'kitSystemShapeDrawerFactory',
  '$http', function (d3Factory, drawer, $http) {
    // DDO - Directive Definition Object
    return {
      scope: true,
      restrict: 'A',
      priority: 1,
      link: function ($scope, $element, $attrs) {
        d3Factory.then(function (d3) {
          $scope.shape.moniker = 'core.gear';
          $http.get('/api/data').then(function (response) {
            var list = response.data;
            var data = list[$scope.shape.moniker][$attrs.id];

            $scope.shape.svg.shapeObject = drawer.drawGearWheel.apply(this,
              d3.merge(
                [
                  [d3, $scope.shape.svg.d3Object,
                    $scope.editor.features.pixelsPerMm],
                  data
                ]
              )
            );

            var speed = 0.8;
            var start = 0;

            d3.timer(function () {
              $scope.shape.svg.shapeObject.attr('transform',
                'rotate(' + (start++) * speed + ')');
            });
          });
        });
      }
    }
  }];

