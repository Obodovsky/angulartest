module.exports = function () {
    return {
        /**
         *
         * @param d3
         * @param holder
         * @param pixelsPerMm
         * @param holeRadius - радиус отверствий
         * @param hHoleCount - количество отверствий по высоте
         * @param vHoleCount - количество отверствий по ширине
         */
        drawRect: function (d3, holder, pixelsPerMm, holeRadius, hHoleCount, vHoleCount) {
            // Условимся, что длина и высота детали зависят от количества отверстий в
            // отношении 1:10 (если 5 горизонтальных отверстий, длина = 50мм)
            function drawRectWithHoles(holeRadius, hHoleCount, vHoleCount) {
                var width = 10 * hHoleCount * pixelsPerMm;
                var height = 10 * vHoleCount * pixelsPerMm;
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
        },
        /**
         *
         * @param {Object} d3
         * @param {Object} holder
         * @param {Number} pixelsPerMm
         * @param {Number} holeRadius - диаметр отверстий в детали
         * @param {Number} sHoleCount - количество вериткальных и горизонтальных отверствий
         */
        drawTriangle: function (d3, holder, pixelsPerMm, holeRadius, sHoleCount) {
            // Условимся, что длина и высота детали зависят от количества отверстий в
            // отношении 1:10 (если 5 горизонтальных отверстий, длина = 50мм)
            function drawTriangleWithHoles(holeRadius, sHoleCount) {
                var width = 10 * sHoleCount * pixelsPerMm;
                var height = 10 * sHoleCount * pixelsPerMm;
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

                pathString += 'M' + borderRadius * Math.sqrt(2) / 4 + ',' + (borderRadius + borderRadius * Math.sqrt(2) / 2) +
                    'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius * Math.sqrt(2) / 4 + ',' + -borderRadius * Math.sqrt(2) / 2 +
                        //'v' + -(height - 2 * borderRadius) +
                    'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + -borderRadius +
                    'h' + (width - 2 * borderRadius) +
                    'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + borderRadius + ',' + borderRadius +
                    'v' + (height - 2 * borderRadius) +
                    'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius + ',' + borderRadius +
                    'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius * Math.sqrt(2) / 2 + ',' + -borderRadius * Math.sqrt(2) / 4 +
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
        },
        /**
         * Отрисовка Т-образной перевернутой фигуры. Все размеры берем от 0го значения.
         * @param {Number} holeRadius - диаметр отверстий в детали
         * @param {Number} hHoleCount - количество горизонатльных дырокчек
         * @param {Number} vHoleCount - количество вертикальных дырокчек (длинна Т-отрезка)
         * @param {Number} positionOfT - положение Т-образного перекрестья начиная с 1
         * @param {Object} d3
         * @param {Object} holder
         * @param {Number} pixelsPerMm
         */
        drawTShape: function (d3, holder, pixelsPerMm, holeRadius, hHoleCount, vHoleCount, positionOfT) {
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
                var height = 10 * pixelsPerMm;
                var heightOfT = 10 * vHoleCount * pixelsPerMm;
                var borderRadius = 2 * holeRadius;
                var stepH = (leftWidth + rightWidth) / hHoleCount;
                var stepV = heightOfT / vHoleCount;

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
                    'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' +
                    borderRadius + ',' + borderRadius +
                    'a' + borderRadius + ',' + borderRadius + ' 0 0 1 ' + -borderRadius + ',' + borderRadius +
                    'z';

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


                return pathString;
            }

            holder.append('path')
                .attr('d', drawTShapeWithHoles(
                    holeRadius * pixelsPerMm,
                    hHoleCount,
                    vHoleCount,
                    positionOfT));
        },
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
        drawGearWheel: function (d3, holder, pixelsPerMm, teeth,
                                 radiusInner, radiusOuter, toothHeight, innerAnnulus, outerAnnulus) {

            function drawGear(teeth, radiusInner, radiusOuter, toothHeight) {
                var rOuter = Math.abs(radiusOuter);
                var rInner = Math.abs(radiusInner);
                var rTooth = rOuter + toothHeight;
                var step = Math.PI / teeth;
                var i = -1;
                var a0 = -Math.PI / 2;
                var s = step / 3;
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
        },
        /**
         *
         * @param d3
         * @param pixelsPerMm - переводной коэффициент мм в пиксели
         * @param innerHexSize - толщина внутреннего контура
         * @param outerHexSize - толщина внешнего контура
         */
        drawScrew: function (d3, pixelsPerMm, innerHexSize, outerHexSize) {

            function hexagon(size) {
                var path = ['M0', -size],
                    i = -1;
                while (++i < 7) {
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

        },
        getDrawingMethod: function (moniker) {
            switch (moniker) {
                case 'core.gear':
                    return this.drawGearWheel;
                    break;
                case 'core.rect':
                    return this.drawRect;
                    break;
                case 'core.triangle':
                    return this.drawTriangle;
                    break;
                case 'core.t-shape':
                    return this.drawTShape;
                    break;
                case 'core.screw':
                    return this.drawScrew;
                    break;
                default:
                    return null;
            }
        }
    }
};
