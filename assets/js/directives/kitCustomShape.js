module.exports = ['d3Factory', function (d3Factory) {
  // DDO - Directive Definition Object
  return {
    scope: true,
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      // $scope унаследована от $rootScope
      // $element - обертка в jqLite
      // $attrs - массив атрибутов для DOM-элемента, на котором висит директива
      d3Factory.then(function (d3) {
        // Drag
        $scope.shape = {
          dragBehavior: {
            dragOrigin: {
              x: 0,
              y: 0
            }
          },
          svg: {
            rootNode: $element[0],
            d3Object: d3.select($element[0])
          }
        };

        $scope.shape.svg.d3Object.append('rect')
          .attr('width', 10 * $scope.editor.features.pixelsPerMm)
          .attr('height', 10 * $scope.editor.features.pixelsPerMm);

        $scope.setDragOrigin = function(x, y) {
          $scope.shape.dragBehavior.dragOrigin.x = x;
          $scope.shape.dragBehavior.dragOrigin.y = y;
        };

        $scope.moveTo = function(x, y) {
          $scope.setDragOrigin(x, y);

          $scope.shape.svg.d3Object.attr('transform',
            'translate(' + x + ',' + y + ')');
        };

        var dragInitiated = false;

        $scope.shape.dragBehavior.dragObject = d3.behavior.drag()
          .origin(function () {
            return $scope.shape.dragBehavior.dragOrigin;
          })
          .on('dragstart', function () {
            var e = d3.event.sourceEvent;

            e.stopPropagation();

            if (e.which === 1 || e instanceof TouchEvent) {
              dragInitiated = true;
              $scope.editor.behavior.dragging = true;
            }
          })
          .on('drag', function () {
            var coords = {
              x: d3.event.x,
              y: d3.event.y
            };
            if (dragInitiated) {
              $scope.moveTo(coords.x, coords.y);
            }
          })
          .on('dragend', function () {
            dragInitiated = false;
            $scope.editor.behavior.dragging = false;
          });

        $scope.shape.svg.d3Object.call($scope.shape.dragBehavior.dragObject);

      })
    }
  }
}];
