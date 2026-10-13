var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { PathOption } from '@syncfusion/ej2-svg-base';
import { degreeToLocation, getElement, linear, stringToNumber, indexFinder } from '../../common/utils/helper';
import { PieBase } from '../renderer/pie-base';
import { Animation, animationMode, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * The `PieSeries` module is used to render the `Pie` series.
 */
var PieSeries = /** @class */ (function (_super) {
    __extends(PieSeries, _super);
    function PieSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * To get path option, degree, symbolLocation from the point.
     *
     * @private
     * @param {AccPoints} point - The point data.
     * @param {AccumulationSeries} series - The series of the chart.
     * @param {AccumulationChart} chart - The accumulation chart control.
     * @param {PathOption} option - The rendering options for the point.
     * @param {Element} seriesGroup - The group element to contain the series elements.
     * @param {boolean} redraw - Specifies whether to redraw the series.
     * @param {string} previousRadius - Specifies the previous radius of the pie when animating the individual series point.
     * @param {Object[]} previousCenter - Specifies the previous center of the pie when animating the individual series point.
     * @param {boolean} pointAnimation - Specifies whether the point based animation is enabled.
     * @returns {void}
     */
    PieSeries.prototype.renderPoint = function (point, series, chart, option, seriesGroup, redraw, previousRadius, previousCenter, pointAnimation) {
        var sum = series.sumOfPoints;
        var seriesPoints = this.accumulation.visibleSeries[series.index].points;
        var borderRadius = series.borderRadius;
        point.startAngle = this.startAngle;
        var yValue = point.visible ? point.y : 0;
        var degree = (sum) ? ((Math.abs(yValue) / sum) * (this.totalAngle)) : null;
        var start = Math.PI / 180 * ((90 - (360 - this.startAngle)) - 90);
        this.radius = this.isRadiusMapped ? stringToNumber(point.sliceRadius, this.seriesRadius) : this.radius;
        option.d = this.getPathOption(point, degree, this.startAngle % 360, borderRadius, seriesPoints);
        point.midAngle = (this.startAngle - (degree / 2)) % 360;
        point.endAngle = this.startAngle % 360;
        point.symbolLocation = degreeToLocation(point.midAngle, (this.radius + this.innerRadius) / 2, this.center);
        if (!redraw) {
            var element = chart.renderer.drawPath(option);
            element.setAttribute('role', series.accessibility.accessibilityRole ? series.accessibility.accessibilityRole : 'img');
            element.setAttribute('tabindex', (point.index === 0 && series.accessibility.focusable) ? String(series.accessibility.tabIndex) : '-1');
            element.style.outline = 'none';
            element.setAttribute('stroke-linejoin', 'round');
            element.setAttribute('aria-label', series.accessibility.accessibilityDescription ? series.accessibility.accessibilityDescription : (point.x + ': ' + point.y + '%. ' + series.name));
            seriesGroup.appendChild(element);
            point.degree = degree;
            point.start = start;
        }
        else {
            var element = chart.renderer.drawPath(option);
            if (!point.isExplode && pointAnimation) {
                element.setAttribute('transform', 'translate(0, 0)');
            }
            element.setAttribute('role', series.accessibility.accessibilityRole ? series.accessibility.accessibilityRole : 'img');
            element.setAttribute('tabindex', (point.index === 0 && series.accessibility.focusable) ? String(series.accessibility.tabIndex) : '-1');
            element.style.outline = 'none';
            element.setAttribute('stroke-linejoin', 'round');
            element.setAttribute('aria-label', series.accessibility.accessibilityDescription ? series.accessibility.accessibilityDescription : (point.x + ': ' + point.y + '%. ' + series.name));
            if (point.degree === undefined) {
                point.degree = degree;
                point.start = start;
            }
            seriesGroup.appendChild(element);
            this.refresh(point, degree, start, chart, option, borderRadius, seriesPoints, previousRadius, previousCenter, pointAnimation, series);
        }
    };
    PieSeries.prototype.findSeries = function (e, borderRadius) {
        var target = e.target;
        var id = indexFinder(target.id, true);
        var seriesIndex = id.series;
        if (isNaN(seriesIndex) || !this.accumulation.visibleSeries[seriesIndex]) {
            var borderElement = document.querySelector('[id$="_PointHover_Border"]');
            if (borderElement) {
                this.removeBorder(borderElement, 1000);
            }
            return;
        }
        var currentSeries = this.accumulation.visibleSeries[seriesIndex];
        var borderGap = 3;
        var width = 2;
        var currentRadius = !isNullOrUndefined(currentSeries._calculatedRadius) ?
            currentSeries._calculatedRadius : this.radius;
        var currentInnerRadius = !isNullOrUndefined(currentSeries._calculatedInnerRadius) ?
            currentSeries._calculatedInnerRadius : this.innerRadius;
        var radius = currentInnerRadius === 0 ? currentRadius + borderGap : currentInnerRadius - borderGap;
        var innerRadius = currentInnerRadius === 0 ? radius + width : radius - width;
        this.toggleInnerPoint(e, radius, innerRadius, borderRadius, seriesIndex);
    };
    PieSeries.prototype.toggleInnerPoint = function (event, radius, innerRadius, borderRadius, hoverSeriesIndex) {
        var target = event.target;
        var id = indexFinder(target.id, true);
        var accumulationId = target.id.substring(0, target.id.indexOf('Series') - 1);
        var seriesIndex = !isNaN(hoverSeriesIndex) ? hoverSeriesIndex : id.series;
        var pointIndex = id.point;
        var borderElement = document.getElementById(this.accumulation.element.id + "_Series_" + seriesIndex + "_PointHover_Border");
        if (isNaN(seriesIndex) || isNaN(pointIndex) || !this.accumulation.visibleSeries[seriesIndex]) {
            if (borderElement) {
                this.removeBorder(borderElement, 1000);
            }
            return;
        }
        var currentSeries = this.accumulation.visibleSeries[seriesIndex];
        var seriesPoints = currentSeries.points;
        var srcElem = getElement(accumulationId + "_Series_" + seriesIndex + "_Point_" + pointIndex);
        if (!srcElem) {
            if (borderElement) {
                this.removeBorder(borderElement, 1000);
            }
            return;
        }
        var point = currentSeries.points[pointIndex];
        var opacity = (this.accumulation.tooltip.enable ? 0.5 : 1);
        var innerPie = this.getPathArc(this.accumulation.pieSeriesModule.center, point.startAngle % 360, (point.startAngle + point.degree) % 360, radius, innerRadius, borderRadius, true, seriesPoints);
        if (borderElement &&
            accumulationId === this.accumulation.element.id &&
            (borderElement.getAttribute('d') !== innerPie || point.isExplode)) {
            if (borderElement.parentNode) {
                borderElement.parentNode.removeChild(borderElement);
            }
            borderElement = null;
        }
        var seriesGroup = getElement(accumulationId + "_Series_" + seriesIndex);
        if (!borderElement && seriesGroup && ((!point.isExplode) || (point.isExplode && event.type !== 'click'))) {
            var path = new PathOption(this.accumulation.element.id + "_Series_" + seriesIndex + "_PointHover_Border", point.color, 1, point.color, opacity, '', innerPie);
            var createBorderEle = this.accumulation.renderer.drawPath(path);
            createBorderEle.removeAttribute('transform');
            if (this.accumulation.selectionMode !== 'None' && target.hasAttribute('class')) {
                this.accumulation.accumulationSelectionModule.addSvgClass(createBorderEle, target.getAttribute('class'));
            }
            seriesGroup.appendChild(createBorderEle);
            if (point.isExplode) {
                var borderExplode = srcElem.getAttribute('transform');
                if (borderExplode) {
                    createBorderEle.setAttribute('transform', borderExplode);
                }
            }
        }
    };
    PieSeries.prototype.removeBorder = function (borderElement, duration) {
        if (borderElement) {
            setTimeout(function () {
                if (borderElement.parentNode) {
                    borderElement.parentNode.removeChild(borderElement);
                }
            }, duration);
        }
    };
    PieSeries.prototype.refresh = function (point, degree, start, chart, option, borderRadius, seriesPoints, previousRadius, previouCenter, pointAnimation, series) {
        var _this = this;
        var seriesElement = getElement(option.id);
        var duration = chart.duration ? chart.duration : 300;
        // Use series._calculatedRadius to get the per-series stored radius value, preventing interference from other series
        var capturedRadius = series && !isNullOrUndefined(series._calculatedRadius) ? series._calculatedRadius : this.radius;
        var capturedInnerRadius = series && !isNullOrUndefined(series._calculatedInnerRadius) ? series._calculatedInnerRadius
            : this.innerRadius;
        var capturedCenter = this.center;
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            delay: 0,
            progress: function (args) {
                var curentDegree = linear(args.timeStamp, point.degree, (degree - point.degree), args.duration);
                var currentStartAngle = linear(args.timeStamp, point.start, start - point.start, args.duration);
                currentStartAngle = ((currentStartAngle / (Math.PI / 180)) + 360) % 360;
                if (previousRadius && previouCenter) {
                    var currentRadius = linear(args.timeStamp, previousRadius, (capturedRadius - previousRadius), args.duration);
                    var previouCenterx = linear(args.timeStamp, previouCenter.x, (capturedCenter.x - previouCenter.x), args.duration);
                    var previouCentery = linear(args.timeStamp, previouCenter.y, (capturedCenter.y - previouCenter.y), args.duration);
                    seriesElement.setAttribute('d', _this.getPathOption(point, curentDegree, currentStartAngle, borderRadius, seriesPoints, currentRadius, previouCenterx, previouCentery));
                }
                else {
                    seriesElement.setAttribute('d', _this.getPathOption(point, curentDegree, currentStartAngle, borderRadius, seriesPoints, null, null, null, capturedRadius, capturedInnerRadius));
                }
                if (point.isExplode) {
                    chart.accBaseModule.explodePoints(point.index, chart, true, pointAnimation);
                }
                seriesElement.style.visibility = 'visible';
            },
            end: function () {
                seriesElement.style.visibility = point.visible ? 'visible' : 'hidden';
                seriesElement.setAttribute('d', option.d);
                point.degree = degree;
                point.start = start;
            }
        });
    };
    /**
     * To get path option from the point.
     *
     * @param {AccPoints} point - The point data.
     * @param {number} degree - The angle of the point.
     * @param {number} startAngle - The start angle of the slice.
     * @param {number} borderRadius - The border radius of the arc.
     * @param {AccPoints[]} seriesPoints - The points of the series.
     * @param {number} previouRadius - The previous radius of the pie.
     * @param {number} previousCenterX - The previous center x of the pie.
     * @param {number} previousCenterY - The previous center y of the pie.
     * @param {number} capturedRadius -  The radius of the series.
     * @param {number} capturedInnerRadius -  The innerRadius of the series.
     * @returns {string} - Returns the path option.
     */
    PieSeries.prototype.getPathOption = function (point, degree, startAngle, borderRadius, seriesPoints, previouRadius, previousCenterX, previousCenterY, capturedRadius, capturedInnerRadius) {
        if (!degree) {
            return '';
        }
        var path = this.getPathArc(previousCenterX ? { x: previousCenterX, y: previousCenterY } : this.center, startAngle % 360, (startAngle + degree) % 360, this.isRadiusMapped ?
            stringToNumber(point.sliceRadius, this.size / 2) :
            previouRadius ? previouRadius : !isNullOrUndefined(capturedRadius)
                ? capturedRadius : this.radius, !isNullOrUndefined(capturedInnerRadius) ? capturedInnerRadius :
            this.innerRadius, borderRadius, false, seriesPoints);
        this.startAngle += degree;
        return path;
    };
    /**
     * To animate the pie series.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {AnimationModel} option - The animation options.
     * @param {AccumulationSeries} series - The pie series.
     * @param {Element} slice - The slice element to animate.
     * @param {number} borderRadius - The border radius of the arc.
     * @param {AccPoints[]} seriesPoints - The points of the series.
     * @returns {void}
     */
    PieSeries.prototype.animateSeries = function (accumulation, option, series, slice, borderRadius, seriesPoints) {
        var groupId = accumulation.element.id + 'SeriesGroup' + series.index;
        if (((series.animation.enable && animationMode !== 'Disable') || animationMode === 'Enable') && accumulation.animateSeries) {
            var clippath = accumulation.renderer.createClipPath({ id: groupId + '_clipPath' });
            var path = new PathOption(groupId + '_slice', 'transparent', 1, 'transparent', 1, '', '');
            var clipslice = accumulation.renderer.drawPath(path);
            clippath.appendChild(clipslice);
            accumulation.svgObject.appendChild(clippath);
            // I263828 pie chart animation issue fixed for safari browser
            slice.style.cssText = 'clip-path:url(#' + clippath.id + '); -webkit-clip-path:url(#' + clippath.id + ');';
            this.doAnimation(clipslice, series, slice, borderRadius, seriesPoints);
        }
    };
    /**
     * To get the module name of the Pie series.
     *
     * @returns {string} - Returns the module name.
     */
    PieSeries.prototype.getModuleName = function () {
        return 'PieSeries';
    };
    /**
     * To destroy the pie series.
     *
     * @returns {void}
     * @private
     */
    PieSeries.prototype.destroy = function () {
        /**
         * Destroy method calling here.
         */
    };
    return PieSeries;
}(PieBase));
export { PieSeries };
