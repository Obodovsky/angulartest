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

                //function place

                drawScrew(d3, $scope.editor.features.pixelsPerMm, 2, 4);
            });
        }
    }
}];
