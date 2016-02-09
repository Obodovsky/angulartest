module.exports = ['d3Factory', function(d3Factory) {
  // DDO - Directive Definition Object
  return {
    scope: true,
    restrict: 'A',
    priority: 1,
    link: function($scope, $element, $attrs) {
      d3Factory.then(function(d3) {
        console.log('TShape is working');

        $scope.shape.moniker = 'core.TShape';

        /**
         * Отрисовка Т-образной перевернутой фигуры. Все размеры берем от 0го значения.
         * @param {Number} holeRadius - диаметр отверстий в детали
         * @param {Number} hHoleCount - количество горизонатльных дырокчек
         * @param {Number} vHoleCount - количество вертикальных дырокчек (длинна Т-отрезка)
         * @param {Number} positionOfT - положение Т-образного перекрестья начиная с 1
         */
        function drawTShape(d3, holder, pixelsPerMm, holeRadius, hHoleCount, vHoleCount, positionOfT) {
          // Условимся, что длина и высота детали зависят от количества отверстий в
          // отношении 1:10 (если 5 горизонтальных отверстий, длина = 50мм)
          function drawTShapeWithHoles(holeRadius, hHoleCount, vHoleCount, positionOfT) {
            if (hHoleCount <= 0 || holeRadius <= 0 || hHoleCount <= 0 || vHoleCount <= 0) {
              throw console.error('введите валидные значения аргументов ( > 0)');
            }
            if (hHoleCount < positionOfT || positionOfT <= 0) {
              throw console.error('недопустимые значения: hHoleCount < positionOfT, positionOfT <= 0');
            }
            var leftWidth = 10 * positionOfT * pixelsPerMm;
            var rightWidth = 10 * (hHoleCount - positionOfT) * pixelsPerMm;
            var singleHoleWidth = 10 * pixelsPerMm;
            var widht = 10 * hHoleCount * pixelsPerMm;
            var height = 10 * 1 * pixelsPerMm;
            var heightOfT = 10 * vHoleCount * pixelsPerMm;
            var borderRadius = 2 * holeRadius;
            var stepH = (leftWidth + rightWidth) / hHoleCount;
            var stepV = heightOfT / vHoleCount;
            console.log(widht, leftWidth, rightWidth);
            // path
            var pathString = '';

            // Параметры команды a:
            // rx,ry - радиусы скругления дуги по осям
            // x-axis-rotation - угол вращения в градусах относительно текущей СК
            // large-arc-flag - флаг большой дуги (если 1, то дуга будет > 180 deg)
            // sweepflag - направление рисования (если 1, дуга рисуется по часовой стрелке)
            // x,y - точка назначения

            pathString += 'M' + borderRadius + ',' + (height + heightOfT) +
              'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius + ',' + -borderRadius +
              'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + -borderRadius +
              'h' + (leftWidth - borderRadius) +
              'v' + (-heightOfT + borderRadius) +
              'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' +
              borderRadius + ',' + -borderRadius +
              'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' +
              borderRadius + ',' + borderRadius +
              'v' + (heightOfT - borderRadius) +
              'h' + (rightWidth - borderRadius - singleHoleWidth) +
              // 'h' + (rightWidth + borderRadius - leftWidth) +
              'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' +
              borderRadius + ',' + borderRadius +
              'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' +
              -borderRadius + ',' + borderRadius +
              'z';

            // for (var j = 0; j < vHoleCount; j++) {
            for (var i = 0; i < hHoleCount; i++) {
              pathString += 'M' + (i * stepH + stepH / 2) + ',' +
                ((height + 2 * heightOfT) / 2 - holeRadius) +
                'a' + holeRadius + ',' + holeRadius + ' 0 0 1 0' + ',' + (2 * holeRadius) +
                'a' + holeRadius + ',' + holeRadius + ' 0 0 1 0' + ',' + -(2 * holeRadius) +
                'z';
            }
            // positionOfT
            for (var j = 0; j < vHoleCount; j++) {
              pathString += 'M' + (positionOfT * stepH + stepH / 2) +
                ',' + (j * stepV + stepV / 2 - holeRadius) +
                'a' + holeRadius + ',' + holeRadius + ' 0 0 1 0' + ',' + (2 * holeRadius) +
                'a' + holeRadius + ',' + holeRadius + ' 0 0 1 0' + ',' + -(2 * holeRadius) +
                'z';
            }
            // }

            return pathString;
          }

          holder.append('path')
            .attr('d', drawTShapeWithHoles(
              holeRadius * pixelsPerMm,
              hHoleCount,
              vHoleCount,
              positionOfT));
        }

        drawTShape(d3, $scope.shape.svg.d3Object, $scope.editor.features.pixelsPerMm, 2.5, 5, 2, 2);

      });
    }
  };
}];
