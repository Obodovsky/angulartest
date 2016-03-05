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
        $scope.shape.moniker = 'core.gear';

        /**
         *
         * @param d3
         * @param holder
         * @param pixelsPerMm
         * @param teeth
         * @param radiusInner
         * @param radiusOuter
         * @param toothHeight
         * @param innerAnnulus - внутреннее кольцо
         * @param innerAnnulus.innerRaduis - внутренний радиус внутреннего кольца
         * @param innerAnnulus.outerRaduis - внешний радиус внутреннего кольца
         * @param outerAnnulus - внешнее кольцо
         * @param outerAnnulus.innerRaduis - внутренний радиус внешнего кольца
         * @param outerAnnulus.outerRaduis - внешний радиус внешнего кольца
         */
        function drawGearWheel(d3, holder, pixelsPerMm, teeth,
                               radiusInner, radiusOuter, toothHeight, innerAnnulus, outerAnnulus) {

          function drawGear(teeth, radiusInner, radiusOuter, toothHeight) {
            var rOuter     = Math.abs(radiusOuter);
            var rInner     = Math.abs(radiusInner);
            var rTooth     = rOuter + toothHeight;
            var step       = Math.PI / teeth;
            var i          = -1;
            var a0         = -Math.PI / 2;
            var s          = step / 3;
            var pathString = ["M", rOuter * Math.cos(a0), rOuter * Math.sin(a0)];

            // Параметры команды a:
            // rx,ry - радиусы скругления дуги по осям
            // x-axis-rotation - угол вращения в градусах относительно текущей СК
            // large-arc-flag - флаг большой дуги (если 1, то дуга будет > 180 deg)
            // sweepflag - направление рисования (если 1, дуга рисуется по часовой стрелке)
            // x,y - точка назначения
            while (++i < teeth) {
              pathString.push('A', rOuter, ',', rOuter, ' 0 0 1 ',
                rOuter * Math.cos(a0 += step), ',', rOuter * Math.sin(a0),
                'L', rTooth * Math.cos(a0 += s), ',', rTooth * Math.sin(a0),
                'A', rTooth, ',', rTooth, ' 0 0 1 ',
                rTooth * Math.cos(a0 += s), ',', rTooth * Math.sin(a0),
                'L', rOuter * Math.cos(a0 += s), ',', rOuter * Math.sin(a0)
              );
            }

            pathString.push(
              'M0', -rInner,
              'A', rInner, ',', rInner, ' 0 0 0 0,', rInner,
              'A', rInner, ',', rInner, ' 0 0 0 0,', -rInner,
              'Z'
            );

            return pathString.join('');
          }

          var _outerAnnulus = d3.svg.arc()
            .innerRadius(outerAnnulus.innerRaduis * pixelsPerMm)
            .outerRadius(outerAnnulus.outerRaduis * pixelsPerMm)
            .startAngle(0)
            .endAngle(Math.PI * 2);

          var _innerAnnulus = d3.svg.arc()
            .innerRadius(innerAnnulus.innerRaduis * pixelsPerMm)
            .outerRadius(innerAnnulus.outerRaduis * pixelsPerMm)
            .startAngle(0)
            .endAngle(Math.PI * 2);

          holder.append('path')
           .attr('class', 'gear-outer-circle')
           .attr('d', _outerAnnulus);

          holder.append('path')
            .attr('class', 'gear-inner-circle')
            .attr('d', _innerAnnulus);

          return holder.append('path')
            .attr('class', 'gear')
            .attr('d', drawGear(teeth,
              radiusInner * pixelsPerMm,
              radiusOuter * pixelsPerMm,
              toothHeight * pixelsPerMm));
        }

        //debugger;

        $scope.shape.svg.gear = drawGearWheel(d3,
          $scope.shape.svg.d3Object,
          $scope.editor.features.pixelsPerMm, 8, 5, 9, 2, {
            innerRaduis: 2.5,
            outerRaduis: 5
          },
          {
            innerRaduis: 2.5,
            outerRaduis: 8
          });

    //    var speed = 0.05;
        var speed = 0.8;

      //  var start = Date.now();
        var start = 0;
       // var i = 0;

        // requestAnimationFrame - аналог setInterval
        // 60 FPS - 1000/60 = 16.67 ms, jank
        //d3.timer(function() {
        //   $scope.shape.svg.gear.attr('transform',
        //    'rotate(' + (Date.now() - start) * speed + ')');
        //});

        d3.timer(function() {
          $scope.shape.svg.gear.attr('transform',
            'rotate(' + (start++) * speed + ')');
        });
      });
    }
  }
}];
