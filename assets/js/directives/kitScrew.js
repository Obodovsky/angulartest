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
                $scope.shape.moniker = 'core.screw';
                /**
                 *
                 * @param d3
                 * @param pixelsPerMm - переводной коэффициент мм в пиксели
                 * @param innerHexSize - толщина внутреннего контура
                 * @param outerHexSize - толщина внешнего контура
                 */
                function drawHexagon(d3, pixelsPerMm, innerHexSize, outerHexSize) {

                    function hexagon(size){
                        var path = ['M0', -size],
                            i = -1;
                        while(++i < 7) {
                            var angle = Math.PI / 3 * i + Math.PI / 2;
                            path.push('L', size * Math.cos(angle), ',', size * Math.sin(angle));
                        }
                        path.push('z');
                        return path.join('');
                    }
                    d3.select($element[0]).append('path')
                        .attr('class', 'screw outer-hex')
                        .attr('d', hexagon(outerHexSize * pixelsPerMm));
                    d3.select($element[0]).append('path')
                        .attr('class', 'screw inner-hex')
                        .attr('d', hexagon(innerHexSize * pixelsPerMm));

                }

                drawHexagon(d3, $scope.editor.features.pixelsPerMm, 2, 4);
            });
        }
    }
}];
