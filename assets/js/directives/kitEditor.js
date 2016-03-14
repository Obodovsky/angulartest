module.exports = ['d3Factory',
  '$window',
  '$q',
  '$timeout',
  '$compile',
  function (d3Factory, $window, $q, $timeout, $compile) {
    // DDO - Directive Definition Object
    return {
      scope: true,
      restrict: 'A',
      link: function ($scope, $element, $attrs) {
        // $scope унаследована от $rootScope
        // $element - обертка в jqLite
        // $attrs - массив атрибутов для DOM-элемента, на котором висит директива
        d3Factory.then(function (d3) {
          $scope.editor = {
            testValue: 'c',
            behavior: {
              dragging: false,
              html5: {}
            },
            grid: {
              sizeXmm: 5,
              sizeYmm: 5
            },
            position: {
              x: 0,
              y: 0
            },
            pageProperties: {
              widthMm: 297,
              heightMm: 210
            },
            svg: {},
            features: {}
          };

          $scope.editor.svg.rootNode = d3.select($element[0]).append('svg')
            .attr('id', 'svg-editor');

          var conversionRect = $scope.editor.svg.rootNode.append('rect')
            .attr('width', '1mm')
            .attr('height', '1mm');

          $scope.editor.features.pixelsPerMm = conversionRect.node().getBBox().width;

          //console.log($scope.editor.features.pixelsPerMm);

          conversionRect.remove();

          var g = $scope.editor.svg.rootNode.append('g')
            .attr('transform', 'translate(0,0)');

          $scope.editor.svg.underlay = g.append('rect')
            .attr('class', 'underlay')
            .attr('width', '100%')
            .attr('height', '100%');

          $scope.editor.svg.container = g.append('g')
            .attr('class', 'svg-container');

          var gGridX = $scope.editor.svg.container.append('g')
            .attr('class', 'x axis');

          var gGridY = $scope.editor.svg.container.append('g')
            .attr('class', 'y axis');

          var borderFrame = $scope.editor.svg.container.append('rect')
            .attr('class', 'svg-border')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 0)
            .attr('height', 0);

          var DURATION = 800;

          var pageWidth  = $scope.editor.pageProperties.widthMm *
            $scope.editor.features.pixelsPerMm;
          var pageHeight = $scope.editor.pageProperties.heightMm *
            $scope.editor.features.pixelsPerMm;

          borderFrame
            .transition()
            .duration(DURATION)
            .attr('width', pageWidth)
            .attr('height', pageHeight);

          var linesX = gGridX.selectAll('line').data(d3.range(0, pageHeight,
            $scope.editor.features.pixelsPerMm * $scope.editor.grid.sizeXmm
          ));

          linesX.enter().append('line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', function (d) {
              return d;
            })
            .transition()
            .duration(DURATION)
            .attr('x2', pageWidth)
            .attr('y2', function (d) {
              return d;
            });

          var linesY = gGridY.selectAll('line').data(d3.range(0, pageWidth,
            $scope.editor.features.pixelsPerMm * $scope.editor.grid.sizeXmm
          ));

          linesY.enter().append('line')
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('x1', function (d) {
              return d;
            })
            .transition()
            .duration(DURATION)
            .attr('y2', pageHeight)
            .attr('x2', function (d) {
              return d;
            });

          $scope.editor.behavior.d3 = {
            zoom: d3.behavior.zoom()
              .scale(1)
              .scaleExtent([.2, 10])
              .on('zoom', function () {
                var t = d3.event.translate;

                $scope.editor.svg.container
                  .attr('transform', 'translate(' + t + ')scale(' +
                    d3.event.scale + ')');

                t = t.toString().split(','); // "1, 2" -> [1, 2]
                $scope.editor.position.x = t[0];
                $scope.editor.position.y = t[1];
              })
          };

            g.call($scope.editor.behavior.d3.zoom);
            $scope.editor.behavior.d3.zoom.event(
              $scope.editor.svg.container);

          /**
           * Перемещение рабочей области в указанную точку.
           * @param {Object} pt - Точка назначения
           * @param {Number} pt.x - X-координата
           * @param {Number} pt.y - Y-координата
           * @returns {Promise}
           */
          $scope.translateTo = function (pt) {
            // resolve - разрешить обещание
            // reject - отклонить
            return $q(function (resolve, reject) {
              d3.transition('translateTo')
                .duration(DURATION)
                .tween('translateTo', function () {
                  // step - функция от t
                  // step(0)[0] -> $scope.editor.position.x
                  // step(0)[1] -> $scope.editor.position.y
                  // step(1)[0] -> pt.x
                  // step(1)[1] -> pt.y
                  var step = d3.interpolate(
                    [$scope.editor.position.x, $scope.editor.position.y],
                    [pt.x, pt.y]
                  );

                  function translateToInternal(x, y) {
                    $scope.editor.behavior.d3.zoom.translate([x, y]);
                    $scope.editor.behavior.d3.zoom.event(
                      $scope.editor.svg.container);
                    $scope.editor.position.x = x;
                    $scope.editor.position.y = y;
                  }

                  // У возвращаемой функции должен быть один параметр - нормализованный интервал T
                  // t -> [0;1]
                  return function (t) {
                    translateToInternal(step(t)[0], step(t)[1]);
                  }
                }).each('end', function () {
                resolve('Translated to (' + pt.x + ';' + pt.y + ') successfully');
              });
            });
          };

          $scope.center = function ($event) {
            var scale        = $scope.editor.behavior.d3.zoom.scale();
            var editorWidth  = $scope.editor.features.pixelsPerMm *
              $scope.editor.pageProperties.widthMm * scale;
            var editorHeight = $scope.editor.features.pixelsPerMm *
              $scope.editor.pageProperties.heightMm * scale;
            var center       = {
              x: ($window.innerWidth - editorWidth) / 2,
              y: ($window.innerHeight - editorHeight) / 2
            };

            return $scope.translateTo(center);
          };

          //$scope.center().then(function (result) {
          //  console.log(result);
          //});

          $scope.editor.behavior.html5.dragoverHandler = function() {
            d3.event.preventDefault();
          };

          $scope.editor.features.isIE =
            (typeof $window.document.createElement('span').dragDrop === 'function');

          $scope.editor.behavior.html5.dropHandler = function() {
            var event = d3.event;

            event.preventDefault();
            event.stopPropagation();

            var dt = event.dataTransfer;
            var moniker = dt.getData($scope.editor.features.isIE
              ? 'text'
              : 'text/plain');

            if (moniker) {
              var namespace = moniker.split('.'); // ['core', 'rect', '1']

              function coordinateTransform(screenPoint, svgObject) {
                var CTM = svgObject.getScreenCTM();
                return screenPoint.matrixTransform(CTM.inverse());
              }

              var point = $scope.editor.svg.rootNode.node().createSVGPoint();

              // point будет иметь экранные координаты в системе viewport
              point.x = event.pageX;
              point.y = event.pageY;

              // point будет иметь клиентские координаты в системе user
              point = coordinateTransform(point, $scope.editor.svg.container.node());

              $compile(angular.element($scope.editor.svg.container.append('g')
                // user
                .attr('transform', 'translate(' + point.x + ',' + point.y + ')')
                .attr('data-kit-custom-shape', '')
                .attr('data-id', namespace[namespace.length - 1])
                .attr('data-kit-'+ namespace[namespace.length - 2], '').node()))($scope);
            }

          };

          $scope.editor.svg.underlay.on('dragover',
            $scope.editor.behavior.html5.dragoverHandler);
          $scope.editor.svg.container.on('dragover',
            $scope.editor.behavior.html5.dragoverHandler);
          $scope.editor.svg.underlay.on('drop',
            $scope.editor.behavior.html5.dropHandler);
          $scope.editor.svg.container.on('drop',
            $scope.editor.behavior.html5.dropHandler);


       //   $scope.editor.testValue = 'd';

          $timeout(function(){
            $scope.editor.testValue = 'd';
            $scope.$apply();
          }, 2000);

        });
      }
    }
  }];
