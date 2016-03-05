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

                //function place

                drawTriangle(d3, $scope.shape.svg.d3Object, $scope.editor.features.pixelsPerMm, 2.5, 4);
            });
        }
    }
}];
