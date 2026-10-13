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
import { firstToLowerCase, RectOption, getPoint } from '../../common/utils/helper';
import { NiceInterval } from '../../chart/axis/axis-helper';
import { DataManager, DataUtil } from '@syncfusion/ej2-data';
import { DataPoint } from '../utils/helper';
import { animationMode, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getSeriesColor } from '../../common/model/theme';
import { PathOption, Rect, measureText, Size } from '@syncfusion/ej2-svg-base';
import { Data } from '../../common/model/data';
/**
 * To render Chart series
 */
var RangeSeries = /** @class */ (function (_super) {
    __extends(RangeSeries, _super);
    function RangeSeries(range) {
        var _this = _super.call(this) || this;
        _this.dataSource = range.dataSource;
        _this.xName = range.xName;
        _this.yName = range.yName;
        _this.query = range.query;
        _this.xMin = Infinity;
        _this.xMax = -Infinity;
        _this.yMin = Infinity;
        _this.yMax = -Infinity;
        _this.labels = [];
        _this.indexLabels = {};
        return _this;
    }
    /**
     * To render light weight and data manager process.
     *
     * @param {RangeNavigator} control - RangeNavigator instance.
     * @returns {void}
     */
    RangeSeries.prototype.renderChart = function (control) {
        var _this = this;
        var dataSource;
        var query;
        this.seriesLength = 0;
        control.rangeSlider.points = [];
        var allSeries = control.series;
        if (allSeries.length) {
            allSeries.map(function (series) {
                dataSource = series.dataSource || control.dataSource;
                query = series.query || control.query;
                series.points = [];
                _this.processDataSource(dataSource, query, control, series);
            });
        }
        else {
            this.processDataSource(control.dataSource, control.query, control);
        }
    };
    RangeSeries.prototype.processDataSource = function (dataSource, query, control, series) {
        var _this = this;
        if (!(dataSource instanceof DataManager) && !isNullOrUndefined(dataSource) && isNullOrUndefined(query)) {
            this.dataManagerSuccess({ result: dataSource, count: dataSource.length }, control, series);
            return;
        }
        control.dataModule = new Data(dataSource, query);
        var dataManager = control.dataModule.getData(control.dataModule.generateQuery().requiresCount());
        dataManager.then(function (e) { return _this.dataManagerSuccess(e, control, series); });
    };
    /**
     * data manager process calculated here.
     *
     * @param {Object} e - The data manager result object.
     * @param {Object} e.result - The result of the data manager process.
     * @param {number} e.count - The count of items in the result.
     * @param {RangeNavigator} control - The RangeNavigator control.
     * @param {RangeNavigatorSeries} series - Optional parameter representing the series data.
     * @returns {void}
     */
    RangeSeries.prototype.dataManagerSuccess = function (e, control, series) {
        var viewData = e.count ? e.result : [];
        control.allowServerDataBinding = false;
        this.processJsonData(viewData, control, Object.keys(viewData).length, series);
        this.seriesLength += series ? 1 : this.seriesLength;
        if (!series || this.seriesLength === control.series.length) {
            this.processXAxis(control);
            this.calculateGroupingBounds(control);
            this.processYAxis(control);
            control.renderChart();
        }
    };
    /**
     * Process JSON data from data source.
     *
     * @param {Object[]} viewData - The data array to be processed.
     * @param {RangeNavigator} control - The RangeNavigator control.
     * @param {number} len - The length of the data array.
     * @param {RangeNavigatorSeries} series - The series data for the RangeNavigator control.
     * @returns {void}
     */
    RangeSeries.prototype.processJsonData = function (viewData, control, len, series) {
        var i = 0;
        var point;
        var xName = (series && series.xName) || control.xName;
        var yName = (series && series.yName) || control.yName;
        var controlValueType = control.valueType;
        while (i < len) {
            point = new DataPoint(getValue(xName, viewData[i]), getValue(yName, viewData[i]));
            point.index = i;
            point.yValue = +point.y;
            point.symbolLocations = [];
            point.regions = [];
            if (controlValueType.indexOf('DateTime') > -1) {
                var dateParser = control.intl.getDateParser({ skeleton: 'full', type: 'dateTime' });
                var dateFormatter = control.intl.getDateFormat({ skeleton: 'full', type: 'dateTime' });
                point.x = new Date(DataUtil.parse.parseJson({ val: point.x }).val);
                point.xValue = Date.parse(dateParser(dateFormatter(point.x)));
                if (controlValueType === 'DateTimeCategory') {
                    if (this.indexLabels[point.xValue.toString()] === undefined) {
                        this.indexLabels[point.xValue.toString()] = this.labels.length;
                        this.labels.push(point.xValue.toString());
                    }
                    point.xValue = this.indexLabels[point.xValue.toString()];
                }
            }
            else {
                // Double / Logarithmic
                point.xValue = +point.x;
            }
            // Ignore invalid numeric points for Double / Logarithmic so
            // axis range/label generation does not receive NaN/undefined.
            if (controlValueType === 'Double' || controlValueType === 'Logarithmic') {
                if (isNullOrUndefined(point.xValue) ||
                    isNullOrUndefined(point.yValue) ||
                    isNaN(point.xValue) ||
                    isNaN(point.yValue)) {
                    i++;
                    continue;
                }
                if (controlValueType === 'Logarithmic' && point.xValue <= 0) {
                    i++;
                    continue;
                }
            }
            if (series) {
                series.points.push(point);
            }
            this.xMin = Math.min(this.xMin, point.xValue);
            this.xMax = Math.max(this.xMax, point.xValue);
            if (point.visible) {
                this.yMin = Math.min(this.yMin, point.yValue);
                this.yMax = Math.max(this.yMax, point.yValue);
            }
            control.rangeSlider.points.push(point);
            i++;
        }
    };
    /**
     * Process x axis for range navigator.
     *
     * @private
     * @param {RangeNavigator} control - The RangeNavigator control.
     * @returns {void}
     */
    RangeSeries.prototype.processXAxis = function (control) {
        var axis = {
            minimum: control.minimum,
            maximum: control.maximum,
            interval: control.interval,
            valueType: control.valueType,
            isInversed: control.enableRtl,
            labelFormat: control.labelFormat,
            logBase: control.logBase,
            skeleton: control.skeleton,
            skeletonType: control.skeletonType
        };
        this.xAxis = axis;
        this.xAxis.intervalType = control.intervalType;
        this.xAxis.maximumLabels = 3;
        this.xAxis.skeleton = control.skeleton;
        this.xAxis.intervalDivs = [10, 5, 2, 1];
        this.xAxis.rect = control.bounds;
        this.xAxis.visibleLabels = [];
        this.xAxis.orientation = 'Horizontal';
        this.xAxis.labels = this.labels;
        this.xAxis.indexLabels = this.indexLabels;
        var axisModule = control[firstToLowerCase(control.valueType) + 'Module'];
        axisModule.min = this.xMin;
        axisModule.max = this.xMax;
        axisModule.getActualRange(this.xAxis, control.bounds);
        var axisValueType = this.xAxis.valueType;
        if (axisValueType === 'Double' || axisValueType === 'DateTime' || axisValueType === 'DateTimeCategory') {
            axisModule.updateActualRange(this.xAxis, this.xAxis.actualRange.min, this.xAxis.actualRange.max, this.xAxis.actualRange.interval);
        }
        // add half-point padding on X-axis so first and last columns
        // are fully visible instead of being clipped by the navigator bounds.
        var hasColumnSeries = !control.stockChart && !!control.series && control.series.some(function (s) { return s.type === 'Column'; });
        if (hasColumnSeries && axisValueType !== 'Logarithmic') {
            var minDelta_1 = Infinity;
            control.series.forEach(function (series) {
                if (series.type === 'Column' && series.points && series.points.length > 1) {
                    var sortedPoints = series.points
                        .filter(function (p) { return p.visible !== false; })
                        .slice()
                        .sort(function (a, b) { return a.xValue - b.xValue; });
                    for (var i = 1; i < sortedPoints.length; i++) {
                        var delta = sortedPoints[i].xValue -
                            sortedPoints[i - 1].xValue;
                        if (delta > 0) {
                            minDelta_1 = Math.min(minDelta_1, delta);
                        }
                    }
                }
            });
            var padding = 0;
            if (axisValueType === 'DateTimeCategory') {
                padding = 0.5;
            }
            else if (isFinite(minDelta_1)) {
                padding = minDelta_1 / 2;
            }
            else {
                // fallback for single-point or equal-x cases
                padding = (this.xAxis.actualRange.delta || 1) / 2;
            }
            // apply padding only when min/max are not explicitly set by user
            if (isNullOrUndefined(control.minimum)) {
                this.xAxis.actualRange.min -= padding;
            }
            if (isNullOrUndefined(control.maximum)) {
                this.xAxis.actualRange.max += padding;
            }
        }
        this.xAxis.actualRange.delta = this.xAxis.actualRange.max - this.xAxis.actualRange.min;
        this.xAxis.visibleRange = this.xAxis.actualRange;
        axisModule.calculateVisibleLabels(this.xAxis, control);
        if (this.xAxis.valueType === 'DateTimeCategory' && control.periodSelectorModule) {
            control.periodSelectorModule.isDatetimeCategory = true;
            control.periodSelectorModule.sortedData = this.labels.map(function (label) { return parseInt(label, 10); });
        }
    };
    /**
     * Process yAxis for range navigator.
     *
     * @param {RangeNavigator} control - RangeNavigator instance.
     * @private
     * @returns {void}
     */
    RangeSeries.prototype.processYAxis = function (control) {
        var axis = {
            majorGridLines: { width: 0 }, rangePadding: 'None',
            majorTickLines: { width: 0 }, labelStyle: { size: '0' },
            visible: false, valueType: 'Double', minimum: null, maximum: null,
            interval: null
        };
        this.yAxis = axis;
        this.yAxis.rect = control.bounds;
        this.yAxis.maximumLabels = 3;
        this.yAxis.intervalDivs = [10, 5, 2, 1];
        this.yAxis.orientation = 'Vertical';
        var yMin = this.yMin;
        var yMax = this.yMax;
        if (yMin === yMax) {
            yMax += 1;
            yMin -= 1;
        }
        var hasColumnSeries = !!control.series &&
            control.series.some(function (s) { return s.type === 'Column'; });
        if (hasColumnSeries) {
            var delta = yMax - yMin;
            var padding = delta === 0 ? Math.abs((yMax || 1)) * 0.1 : delta * 0.1;
            if (yMin >= 0) {
                // Positive-only data:
                // add some space below min so the smallest column is visible
                yMin = Math.max(0, yMin - padding);
            }
            else if (yMax <= 0) {
                // Negative-only data:
                // add some space above max and below min
                yMax = Math.min(0, yMax + padding);
                yMin = yMin - padding;
            }
            else {
                // Mixed positive/negative:
                // pad both sides
                yMin = yMin - padding;
                yMax = yMax + padding;
            }
        }
        control.doubleModule.min = yMin;
        control.doubleModule.max = yMax;
        control.doubleModule.getActualRange(this.yAxis, control.bounds);
        control.doubleModule.updateActualRange(this.yAxis, this.yAxis.actualRange.min, this.yAxis.actualRange.max, this.yAxis.actualRange.interval);
        this.yAxis.actualRange.delta = this.yAxis.actualRange.max - this.yAxis.actualRange.min;
        this.yAxis.visibleRange = this.yAxis.actualRange;
    };
    /**
     * Process Light weight control.
     *
     * @param {RangeNavigator} control - RangeNavigator instance.
     * @private
     * @returns {void}
     */
    RangeSeries.prototype.renderSeries = function (control) {
        var _this = this;
        this.chartGroup = control.renderer.createGroup({ id: control.element.id + '_chart' });
        var colors = getSeriesColor(control.theme);
        var allSeries = control.series;
        var visibleColumnSeries = control.stockChart ? [] : allSeries.filter(function (s, idx) {
            var stockSeriesVisible = control.stockChart ? control.stockChart.series[idx].visible : true;
            return s.type === 'Column' && stockSeriesVisible;
        });
        // Precompute side-by-side positions ONCE for all visible
        if (visibleColumnSeries.length > 1) {
            var controlAny = control; // used any since we didn't have the chart properties in range navigator series
            controlAny.enableSideBySidePlacement = true;
            controlAny.visibleSeries = visibleColumnSeries;
            controlAny.columns = controlAny.columns || [{}];
            controlAny.rows = controlAny.rows || [{}];
            visibleColumnSeries.forEach(function (columnSeries) {
                columnSeries.chart = control;
                columnSeries.xAxis = _this.xAxis;
                columnSeries.yAxis = _this.yAxis;
                columnSeries.findSeriesCollection = function () {
                    return visibleColumnSeries;
                };
                columnSeries.position = null;
                columnSeries.rectCount = null;
            });
            var columnModule = controlAny['columnSeriesModule'];
            if (columnModule && columnModule.getSideBySidePositions && visibleColumnSeries[0]) {
                columnModule.getSideBySidePositions(visibleColumnSeries[0]);
            }
        }
        allSeries.map(function (series, index) {
            var isSeriesVisible = control.stockChart ? control.stockChart.series[index].visible : true;
            if (isSeriesVisible) {
                series.xAxis = _this.xAxis;
                series.yAxis = _this.yAxis;
                series.chart = control;
                series.index = index;
                series.xAxis.isInversed = control.enableRtl;
                var stockSeries = control.stockChart && control.stockChart.series && control.stockChart.series[index];
                var hasGradient = (stockSeries && !isNullOrUndefined(stockSeries.linearGradient) &&
                    stockSeries.linearGradient.gradientColorStop.length > 0) ||
                    (stockSeries && !isNullOrUndefined(stockSeries.radialGradient) &&
                        stockSeries.radialGradient.gradientColorStop.length > 0);
                var fillColor = (hasGradient && series.interior.indexOf('gradient')) > 0
                    ? series.interior
                    : (series.fill || colors[index % colors.length]);
                series.interior = fillColor;
                _this.createSeriesElement(control, series, index);
                var seriesAny = series;
                var controlAny = control;
                seriesAny.emptyPointSettings = { mode: 'Zero' };
                seriesAny.drawPoints = series.points;
                seriesAny.category = seriesAny.category || 'Series';
                seriesAny.seriesType = seriesAny.seriesType || 'XY';
                var seriesAxisValueType = series.xAxis.valueType;
                if (seriesAxisValueType === 'DateTimeCategory') {
                    for (var i = 0; i < series.points.length; i++) {
                        series.points[i].xValue =
                            _this.xAxis.labels.indexOf(Date.parse(series.points[i].x.toString()).toString());
                    }
                }
                var originalSeriesType = series.type;
                var rangeNavigatorType = control.stockChart
                    ? (originalSeriesType === 'Area' ? 'Area' : originalSeriesType === 'StepLine' ? 'StepLine' : 'Line')
                    : originalSeriesType;
                var seriesType = rangeNavigatorType;
                // Spline / SplineArea setup
                if (seriesType === 'Spline' || seriesType === 'SplineArea') {
                    var originalYMin = seriesAny.yMin;
                    var originalYMax = seriesAny.yMax;
                    var validPoints = series.points.filter(function (p) { return p.yValue != null; });
                    if (validPoints.length > 0) {
                        var dataYValues = validPoints.map(function (p) { return p.yValue; });
                        var dataMin = Math.min.apply(Math, dataYValues);
                        var dataMax = Math.max.apply(Math, dataYValues);
                        seriesAny.yMin = dataMin;
                        seriesAny.yMax = dataMax;
                        var splineModuleName = firstToLowerCase(seriesType) + 'SeriesModule';
                        var splineModule = controlAny[splineModuleName];
                        if (splineModule && splineModule.findSplinePoint) {
                            splineModule.chart = controlAny;
                            splineModule.findSplinePoint(series);
                        }
                        seriesAny.yMin = originalYMin;
                        seriesAny.yMax = originalYMax;
                    }
                    seriesAny.cardinalSplineTension = 0.5;
                    seriesAny.splineType = 'Natural';
                }
                // Column setup
                if (seriesType === 'Column') {
                    controlAny.visibleSeries = visibleColumnSeries;
                    controlAny.requireInvertedAxis = false;
                    controlAny.enableCanvas = false;
                    controlAny.duration = control.animationDuration;
                    controlAny.redraw = control.redraw;
                    seriesAny.columnSpacing = isNullOrUndefined(seriesAny.columnSpacing) ? 0.1 : seriesAny.columnSpacing;
                    seriesAny.columnWidth = isNullOrUndefined(seriesAny.columnWidth) ? 0.7 : seriesAny.columnWidth;
                    seriesAny.clipRect = series.clipRect;
                    seriesAny.isRectSeries = true;
                    if (visibleColumnSeries.length > 1) {
                        var columnIndex = visibleColumnSeries.indexOf(series);
                        controlAny.enableSideBySidePlacement = true;
                        seriesAny.position = columnIndex;
                        seriesAny.rectCount = visibleColumnSeries.length;
                    }
                    else {
                        // Single series
                        seriesAny.position = 0;
                        seriesAny.rectCount = 0;
                        controlAny.enableSideBySidePlacement = false;
                    }
                    // Ensure point metadata exists
                    for (var cp = 0; cp < series.points.length; cp++) {
                        series.points[cp].index = cp;
                        if (isNullOrUndefined(series.points[cp].visible)) {
                            series.points[cp].visible =
                                !isNullOrUndefined(series.points[cp].yValue) &&
                                    !isNaN(series.points[cp].yValue);
                        }
                        series.points[cp].symbolLocations =
                            series.points[cp].symbolLocations;
                        series.points[cp].regions =
                            series.points[cp].regions;
                    }
                    var validColumnPoints = series.points.filter(function (p) { return p.visible; });
                    var minPixelDelta = Infinity;
                    var prevX = null;
                    for (var px = 0; px < validColumnPoints.length; px++) {
                        var pointX = getPoint(validColumnPoints[px].xValue, 0, _this.xAxis, _this.yAxis, false).x;
                        if (prevX !== null) {
                            var currentDelta = Math.abs(pointX - prevX);
                            if (currentDelta > 0) {
                                minPixelDelta = Math.min(minPixelDelta, currentDelta);
                            }
                        }
                        prevX = pointX;
                    }
                    if (!isFinite(minPixelDelta) || minPixelDelta <= 0) {
                        if (validColumnPoints.length === 1) {
                            minPixelDelta = _this.xAxis.rect.width * 0.15;
                        }
                        else if (validColumnPoints.length > 1) {
                            minPixelDelta = _this.xAxis.rect.width / validColumnPoints.length;
                        }
                        else {
                            minPixelDelta = 10;
                        }
                    }
                    var basePixelWidth = minPixelDelta * seriesAny.columnWidth;
                    // Split available slot among visible column series
                    if (visibleColumnSeries.length > 1) {
                        basePixelWidth = basePixelWidth / visibleColumnSeries.length;
                    }
                    seriesAny.columnWidthInPixel = Math.max(basePixelWidth, 1);
                    if (!seriesAny.border) {
                        seriesAny.border = { width: 0, color: 'transparent' };
                    }
                }
                var seriesModuleName = firstToLowerCase(seriesType) + 'SeriesModule';
                var seriesModule = controlAny[seriesModuleName];
                if (seriesModule) {
                    seriesModule.render(series, _this.xAxis, _this.yAxis, false);
                }
                else {
                    var defaultSeriesModule = controlAny['lineSeriesModule'];
                    defaultSeriesModule.render(series, _this.xAxis, _this.yAxis, false);
                }
                _this.chartGroup.appendChild(series.seriesElement);
                // Animation
                if (((series.animation.enable && animationMode !== 'Disable') || animationMode === 'Enable') &&
                    control.animateSeries) {
                    if (seriesModule) {
                        seriesModule.chart = controlAny;
                        seriesModule.doAnimation(series);
                    }
                }
                series.type = originalSeriesType;
            }
        });
    };
    /**
     * Append series elements in element.
     *
     * @param {RangeNavigator} control - The RangeNavigator control.
     * @returns {void}
     */
    RangeSeries.prototype.appendSeriesElements = function (control) {
        control.svgObject.appendChild(this.chartGroup);
        if (control.series.length) {
            this.drawSeriesBorder(control);
        }
    };
    RangeSeries.prototype.createSeriesElement = function (control, series, index) {
        var elementId = control.element.id;
        series.clipRect = new Rect(this.xAxis.rect.x, this.yAxis.rect.y, this.xAxis.rect.width, this.yAxis.rect.height);
        series.clipRectElement = control.renderer.drawClipPath(new RectOption(elementId + '_RangeSeriesClipRect_' + index, 'transparent', { width: 1, color: 'Gray' }, 1, {
            x: 0, y: 0,
            width: series.clipRect.width,
            height: series.clipRect.height
        }));
        series.seriesElement = control.renderer.createGroup({
            'id': elementId + 'SeriesGroup' + index,
            'transform': 'translate(' + series.clipRect.x + ',' + (series.clipRect.y) + ')',
            'clip-path': 'url(#' + elementId + '_RangeSeriesClipRect_' + index + ')'
        });
        series.seriesElement.appendChild(series.clipRectElement);
    };
    /**
     * Calculate grouping bounds for x axis.
     *
     * @private
     * @param {RangeNavigator} control - The RangeNavigator control.
     * @returns {void}
     */
    RangeSeries.prototype.calculateGroupingBounds = function (control) {
        var padding = control.margin.bottom;
        var labelHeight = measureText('string', control.labelStyle, control.themeStyle.axisLabelFont).height;
        var controlValueType = control.valueType;
        var xMin = controlValueType === 'DateTimeCategory' ? parseInt(this.xAxis.labels[this.xMin], 10) : this.xMin;
        var xMax = controlValueType === 'DateTimeCategory' ? parseInt(this.xAxis.labels[this.xMax], 10) : this.xMax;
        this.calculateDateTimeNiceInterval(this.xAxis, new Size(control.bounds.width, control.bounds.height), xMin, xMax, false);
        if (control.enableGrouping && (controlValueType === 'DateTime' || controlValueType === 'DateTimeCategory') &&
            (this.xAxis.actualIntervalType !== 'Years' || !control.series.length)) {
            control.bounds.height -= (control.labelPosition === 'Outside' || !control.series.length) ? padding + labelHeight : (labelHeight + 2 * padding);
        }
        if (!control.series.length) {
            control.bounds.y += control.bounds.height / 4;
            control.bounds.height = control.bounds.height / 2;
        }
    };
    RangeSeries.prototype.drawSeriesBorder = function (control) {
        var start = control.stockChart ? 'M' : 'L';
        var close = control.stockChart ? '' : 'Z';
        var options = new PathOption(control.element.id + '_SeriesBorder', 'transparent', control.navigatorBorder.width, control.navigatorBorder.color || (control.theme.indexOf('Dark') > -1 ? '#49454F' : '#DDDDDD'), 1, control.navigatorBorder.dashArray, ('M ' + (control.bounds.x) + ' ' + (control.bounds.y) +
            ' L ' + (control.bounds.x + control.bounds.width) + ' ' + control.bounds.y +
            start + (control.bounds.x + control.bounds.width) + ' ' + (control.bounds.y + control.bounds.height) +
            ' L ' + (control.bounds.x) + ' ' + (control.bounds.y + control.bounds.height) + close));
        var htmlObject = control.renderer.drawPath(options);
        control.svgObject.appendChild(htmlObject);
    };
    return RangeSeries;
}(NiceInterval));
export { RangeSeries };
