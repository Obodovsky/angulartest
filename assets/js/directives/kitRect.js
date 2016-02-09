module.exports = ['d3Factory', function (d3Factory) {
  // DDO - Directive Definition Object
  return {
    scope: true,
    restrict: 'A',
    priority: 1,
    link: function ($scope, $element, $attrs) {
      // $scope унаследована от $rootScope
      // $element - обертка в jqLite
      // $attrs - массив атрибутов для DOM-элемента, на котором висит директива
      d3Factory.then(function (d3) {
        console.log('Rect is working');
        $scope.shape.moniker = 'core.rect';

        function drawRect(d3, holder, pixelsPerMm, holeRadius, hHoleCount, vHoleCount) {
          // Условимся, что длина и высота детали зависят от количества отверстий в
          // отношении 1:10 (если 5 горизонтальных отверстий, длина = 50мм)
          function drawRectWithHoles(holeRadius, hHoleCount, vHoleCount) {
            var width        = 10 * hHoleCount * pixelsPerMm;
            var height       = 10 * vHoleCount * pixelsPerMm;
            var borderRadius = 2 * holeRadius;
            var stepH = width / hHoleCount;
            var stepV = height / vHoleCount;
            // path
            var pathString = '';

            // Параметры команды a:
            // rx,ry - радиусы скругления дуги по осям
            // x-axis-rotation - угол вращения в градусах относительно текущей СК
            // large-arc-flag - флаг большой дуги (если 1, то дуга будет > 180 deg)
            // sweepflag - направление рисования (если 1, дуга рисуется по часовой стрелке)
            // x,y - точка назначения

            pathString += 'M' + borderRadius + ',' + height +
                'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius + ',' + -borderRadius +
                'v' + -(height - 2 * borderRadius) +
                'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + -borderRadius +
                'h' + (width - 2 * borderRadius) +
                'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + borderRadius +
                'v' + (height - 2 * borderRadius) +
                'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius + ',' + borderRadius +
                'z';

            for (var j = 0; j < vHoleCount; j++) {
              for (var i = 0; i < hHoleCount; i++) {
                pathString += 'M' + (i * stepH + stepH / 2) + ',' +
                  (j * stepV + stepV / 2 - holeRadius) +
                  'a' + holeRadius + ',' + holeRadius + ' 0 0 1 0' + ',' + (2 * holeRadius) +
                  'a' + holeRadius + ',' + holeRadius + ' 0 0 1 0' + ',' + -(2 * holeRadius) +
                  'z';
              }
            }

            return pathString;
          }

          holder.append('path')
            .attr('d', drawRectWithHoles(
              holeRadius * pixelsPerMm,
              hHoleCount,
              vHoleCount));
        }

        drawRect(d3, $scope.shape.svg.d3Object, $scope.editor.features.pixelsPerMm, 2.5, 5, 1);
      });
    }
  }
}];
