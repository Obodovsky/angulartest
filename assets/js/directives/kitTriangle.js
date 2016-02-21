module.exports = ['d3Factory', function (d3Factory) {
    // DDO - DiTriangleive Definition Object
    return {
        scope: true,
        restrict: 'A',
        priority: 1,
        link: function ($scope, $element, $attrs) {
            // $scope унаследована от $rootScope
            // $element - обертка в jqLite
            // $attrs - массив атрибутов для DOM-элемента, на котором висит директива
            d3Factory.then(function (d3) {
                $scope.shape.moniker = 'core.triangle';

                /**
                 *
                 * @param {Object} d3
                 * @param {Object} holder
                 * @param {Number} pixelsPerMm
                 * @param {Number} holeRadius - диаметр отверстий в детали
                 * @param {Number} sHoleCount - количество вериткальных и горизонтальных отверствий
                 */
                function drawTriangle(d3, holder, pixelsPerMm, holeRadius, sHoleCount) {
                    // Условимся, что длина и высота детали зависят от количества отверстий в
                    // отношении 1:10 (если 5 горизонтальных отверстий, длина = 50мм)
                    function drawTriangleWithHoles(holeRadius, sHoleCount) {
                        var width        = 10 * sHoleCount * pixelsPerMm;
                        var height       = 10 * sHoleCount * pixelsPerMm;
                        var borderRadius = 2 * holeRadius;
                        var stepH = width / sHoleCount;
                        var stepV = height / sHoleCount;
                        // path
                        var pathString = '';

                        // Параметры команды a:
                        // rx,ry - радиусы скругления дуги по осям
                        // x-axis-rotation - угол вращения в градусах относительно текущей СК
                        // large-arc-flag - флаг большой дуги (если 1, то дуга будет > 180 deg)
                        // sweepflag - направление рисования (если 1, дуга рисуется по часовой стрелке)
                        // x,y - точка назначения

                        pathString += 'M' + borderRadius * Math.sqrt(2)/4   + ',' + (borderRadius + borderRadius * Math.sqrt(2)/2)  +
                            'a' + borderRadius   + ',' + borderRadius   + ' 0 0 1 ' + -borderRadius * Math.sqrt(2)/4  + ',' + -borderRadius * Math.sqrt(2)/2 +
                            //'v' + -(height - 2 * borderRadius) +
                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + -borderRadius +
                            'h' + (width - 2 * borderRadius) +
                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + borderRadius +
                            'v' + (height - 2 * borderRadius) +
                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius + ',' + borderRadius +
                            'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius * Math.sqrt(2)/2 + ',' + -borderRadius * Math.sqrt(2)/4 +
                            'z';

                        for (var j = 0; j < sHoleCount; j++) {
                            var i = j;
                            for (i; i < sHoleCount; i++) {
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
                        .attr('d', drawTriangleWithHoles(
                            holeRadius * pixelsPerMm,
                            sHoleCount,
                            sHoleCount));
                }

                drawTriangle(d3, $scope.shape.svg.d3Object, $scope.editor.features.pixelsPerMm, 2.5, 4);
            });
        }
    }
}];
