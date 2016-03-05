module.exports = ['d3Factory', function (d3Factory) {
  // DDO - Directive Definition Object
  return {
    scope: true,
    restrict: 'A',
    priority: 0,
    link: function ($scope, $element) {
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
            },
            snapFactor: 2
          },
          svg: {
            rootNode: $element[0],
            d3Object: d3.select($element[0])
          }
        };

        $scope.setDragOrigin = function (x, y) {
          $scope.shape.dragBehavior.dragOrigin.x = x;
          $scope.shape.dragBehavior.dragOrigin.y = y;
        };

        $scope.doSingleRotation = function(){
          if(!$scope.shape.svg.d3Object.node().hasAttribute('data-kit-gear') &&
              !$scope.shape.svg.d3Object.node().hasAttribute('data-kit-screw')){
            var path = $scope.shape.svg.d3Object.selectAll('path');
            var oldRotation = d3.transform(path.attr('transform'));
            var bBox = $scope.shape.svg.d3Object.node().getBBox();
            var centroid =  [bBox.x + bBox.width / 2, bBox.y + bBox.height / 2];

            path.attr('transform', 'rotate(' + (oldRotation.rotate + 90) + ',' + centroid[0] + ',' + centroid[1] + ')');
          }
        };

        $scope.snapToGrid = function (coords, factor) {
          if (typeof factor === 'undefined')
            var snapFactor = $scope.shape.dragBehavior.snapFactor;
          else
            snapFactor = factor;

          var a = $scope.editor.grid.sizeXmm / snapFactor * $scope.editor.features.pixelsPerMm;
          var b = $scope.editor.grid.sizeYmm / snapFactor * $scope.editor.features.pixelsPerMm;

          return {
            x: Math.round(coords.x / a) * a,
            y: Math.round(coords.y / b) * b
          }

        };

        $scope.moveTo = function (x, y, shouldSnap) {
          $scope.setDragOrigin(x, y);

          var coords = {
            x: x,
            y: y
          };

          if (shouldSnap)
            coords = $scope.snapToGrid(coords, $scope.shape.dragBehavior.snapFactor);

          $scope.shape.svg.d3Object.attr('transform',
            'translate(' + coords.x + ',' + coords.y + ')');
        };

        var dragInitiated = false;

        $scope.bringToFront = function(){
          $scope.shape.svg.rootNode.parentNode.appendChild(
              $scope.shape.svg.rootNode);
        };

        $scope.shape.dragBehavior.dragObject = d3.behavior.drag()
          .origin(function () {
            return $scope.shape.dragBehavior.dragOrigin;
          })
          .on('dragstart', function () {
            $scope.bringToFront();
            var e = d3.event.sourceEvent;
            e.stopPropagation();

            if (e.which === 1 || e instanceof TouchEvent) {
              dragInitiated                   = true;
              $scope.editor.behavior.dragging = true;
            }

          })
          .on('drag', function () {
            $scope.shape.svg.d3Object.classed('dragging', true);
            var coords = {
              x: d3.event.x,
              y: d3.event.y
            };
            if (dragInitiated) {
              $scope.moveTo(coords.x, coords.y, true);
            }
          })
          .on('dragend', function () {
            $scope.shape.svg.d3Object.classed('dragging', false);
            dragInitiated                   = false;
            $scope.editor.behavior.dragging = false;

          });

        $scope.shape.svg.d3Object.call($scope.shape.dragBehavior.dragObject);

        var t = d3.transform($scope.shape.svg.d3Object.attr('transform'));

        var tSnapped = $scope.snapToGrid({
          x: t.translate[0],
          y: t.translate[1]
        }, $scope.shape.dragBehavior.snapFactor);

        $scope.setDragOrigin(tSnapped.x, tSnapped.y);

        $scope.shape.svg.d3Object.attr('transform', 'translate(' +
          tSnapped.x + ',' + tSnapped.y + ')');

        var colors = d3.scale.category10().domain(d3.range(10));
        $scope.shape.svg.d3Object.on('mousedown', function(){
          var e = d3.event;

          if(e.button === 0 && e.shiftKey){
            d3.select(this).selectAll('path').style('fill',
              colors(Math.random() * 9))
          } else if(e.altKey && e.button === 0){
            $element.remove();
            $scope.$destroy();
          } else if(e.button === 1){
            $scope.doSingleRotation();
          }
        });

        $scope.shape.svg.d3Object.on('dblclick.zoom', function(){
          d3.event.stopPropagation();
        });
      })
    }
  }
}];
