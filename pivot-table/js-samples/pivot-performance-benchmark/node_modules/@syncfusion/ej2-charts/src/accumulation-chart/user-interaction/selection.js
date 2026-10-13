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
/**
 * AccumulationChart Selection src file
 */
import { Browser, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { indexFinder, getElement } from '../../common/utils/helper';
import { Index } from '../../common/model/base';
import { BaseSelection } from '../../common/user-interaction/selection';
import { selectionComplete } from '../../common/model/constants';
/**
 * The `AccumulationSelection` module handles selection for the accumulation chart.
 *
 * @private
 */
var AccumulationSelection = /** @class */ (function (_super) {
    __extends(AccumulationSelection, _super);
    function AccumulationSelection(accumulation) {
        var _this = _super.call(this, accumulation) || this;
        /**
         * @private
         */
        _this.multiSeriesSelectionState = {};
        /**
         * @private
         */
        _this.multiSeriesHighlightState = {};
        _this.accumulation = accumulation;
        _this.renderer = accumulation.renderer;
        _this.addEventListener();
        return _this;
    }
    /**
     * Binding events for selection module.
     *
     * @returns {void}
     */
    AccumulationSelection.prototype.addEventListener = function () {
        if (this.accumulation.isDestroyed) {
            return;
        }
        //let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.accumulation.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.accumulation.on('click', this.mouseClick, this);
    };
    /**
     * UnBinding events for selection module.
     *
     * @returns {void}
     */
    AccumulationSelection.prototype.removeEventListener = function () {
        if (this.accumulation.isDestroyed) {
            return;
        }
        this.accumulation.off(Browser.touchMoveEvent, this.mouseMove);
        this.accumulation.off('click', this.mouseClick);
    };
    /**
     * To initialize the private variables.
     *
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {void}
     */
    AccumulationSelection.prototype.initPrivateVariables = function (accumulation) {
        this.styleId = accumulation.element.id + '_ej2_chart_selection';
        this.unselected = accumulation.element.id + '_ej2_deselected';
        this.selectedDataIndexes = [];
        this.rectPoints = null;
        this.multiSeriesSelectionState = {};
        this.multiSeriesHighlightState = {};
    };
    /**
     * Invoke selection for rendered chart.
     *
     * @param {AccumulationChart} accumulation - Define the chart to invoke the selection.
     * @returns {void}
     * @private
     */
    AccumulationSelection.prototype.invokeSelection = function (accumulation) {
        this.initPrivateVariables(accumulation);
        this.series = extend({}, accumulation.visibleSeries, null, true);
        this.seriesStyles();
        this.currentMode = accumulation.selectionMode;
        this.selectDataIndex(this.concatIndexes(accumulation.selectedDataIndexes, this.selectedDataIndexes), accumulation);
    };
    /**
     * To get series selection style by series.
     *
     * @param {AccumulationSeriesModel} series - The series for which to get the selection style.
     * @param {number} point - The index of the point within the series.
     * @returns {string} - The selection style for the specified series.
     */
    AccumulationSelection.prototype.generateStyle = function (series, point) {
        return (series.selectionStyle || this.styleId + '_series_' + series.index + '_point_' + point);
    };
    // /**
    //  * To get series selection style while hovering legend.
    //  *
    //  * @param {AccumulationSeriesModel} series - The series for which to get the selection style.
    //  * @param {string} eventType - The event type indicating the legend interaction (e.g., hover).
    //  * @returns {string} - The selection style for the specified series.
    //  */
    // private generateLegendClickStyle(series: AccumulationSeriesModel, eventType: string): string {
    //     if (eventType === 'mousemove') {
    //         this.styleId = this.accumulation.element.id + '_ej2_chart_highlight';
    //     } else if (eventType === 'click') {
    //         this.styleId = this.accumulation.element.id + '_ej2_chart_selection';
    //     }
    //     return (series.selectionStyle || this.styleId + '_series_' + (<AccumulationSeries>series).index);
    // }
    /**
     * To get elements by index, series.
     *
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {AccumulationSeriesModel} series - The series for which to get the elements.
     * @param {Index} index - The index of the element within the series.
     * @returns {Element[]} - The elements corresponding to the specified index and series.
     */
    AccumulationSelection.prototype.findElements = function (accumulation, series, index) {
        return [this.getElementByIndex(index)];
    };
    /**
     * To get series point element by index.
     *
     * @param {Index} index - The index of the element within the series.
     * @returns {Element} - The elements corresponding to the specified index.
     */
    AccumulationSelection.prototype.getElementByIndex = function (index) {
        var elementId = this.control.element.id + '_Series_' + index.series + '_Point_' + index.point;
        return document.getElementById(elementId);
    };
    /**
     * To find the selected element.
     *
     * @param {Element} targetElement - The target element to check for selection.
     * @param {string} eventType - The type of event that triggered the selection.
     * @returns {boolean} - Indicates whether the element is selected.
     * @private
     */
    AccumulationSelection.prototype.isAlreadySelected = function (targetElement, eventType) {
        if (eventType === 'mousemove') {
            this.currentMode = this.accumulation.highlightMode;
            this.highlightDataIndexes = [];
            this.styleId = this.accumulation.element.id + '_ej2_chart_highlight';
        }
        else if (eventType === 'click') {
            this.currentMode = this.accumulation.selectionMode;
            this.styleId = this.accumulation.element.id + '_ej2_chart_selection';
        }
        if (this.accumulation.highlightMode !== 'None' && this.accumulation.selectionMode === 'None') {
            if (eventType === 'click') {
                return false;
            }
        }
        if ((this.accumulation.highlightMode !== 'None' && this.previousSelectedElement && this.previousSelectedElement[0])) {
            var parentNodeId = targetElement.parentNode.id;
            var isValidElement = void 0;
            if (targetElement.parentNode) {
                isValidElement = (parentNodeId.indexOf('SeriesGroup') > 0 ||
                    parentNodeId.indexOf('SymbolGroup') > 0) ? true : false;
            }
            for (var i = 0; i < this.previousSelectedElement.length; i++) {
                if (this.previousSelectedElement[i].hasAttribute('class')) {
                    if (this.previousSelectedElement[i].getAttribute('class').indexOf('highlight') > -1 && (isValidElement || eventType === 'click')) {
                        this.previousSelectedElement[i].removeAttribute('class');
                        this.addOrRemoveIndex(this.highlightDataIndexes, indexFinder(this.previousSelectedElement[i].id));
                    }
                    else if (!isValidElement && this.previousSelectedElement[i].getAttribute('class').indexOf('highlight') > -1) {
                        this.performSelection(indexFinder(this.previousSelectedElement[i].id), this.accumulation, this.previousSelectedElement[i]);
                    }
                }
            }
        }
        return true;
    };
    /**
     * To calculate selected elements on mouse click or touch.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {Event} event - The event object representing the mouse click or touch event.
     * @returns {void}
     */
    AccumulationSelection.prototype.mouseClick = function (accumulation, event) {
        this.calculateSelectedElements(accumulation, event.target, event.type);
    };
    /**
     * To calculate selected elements on mouse click or touch.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {Element} targetEle - The target element that triggered the event.
     * @param {string} eventType - The type of event that triggered the selection.
     * @returns {void}
     */
    AccumulationSelection.prototype.calculateSelectedElements = function (accumulation, targetEle, eventType) {
        if (isNullOrUndefined(targetEle)) {
            return;
        }
        if ((accumulation.highlightMode === 'None' && accumulation.selectionMode === 'None') ||
            targetEle.id.indexOf(accumulation.element.id + '_') === -1) {
            return;
        }
        if (eventType === 'mousemove') {
            if (!isNullOrUndefined(targetEle.parentNode) && targetEle.parentNode.hasAttribute('class') &&
                (targetEle.parentNode.getAttribute('class').indexOf('highlight') > 0 ||
                    targetEle.parentNode.getAttribute('class').indexOf('selection') > 0)) {
                return;
            }
        }
        if (targetEle.getAttribute('id').indexOf('_connector_') > -1) {
            return;
        }
        else {
            this.isAlreadySelected(targetEle, eventType);
            if (this.accumulation.selectionMode === 'Point' && eventType === 'mousemove' && this.accumulation.accumulationLegendModule
                && this.accumulation.accumulationHighlightModule.highlightDataIndexes
                && this.accumulation.accumulationHighlightModule.highlightDataIndexes.length > 0 &&
                targetEle.id.indexOf('_chart_legend_') === -1 && targetEle.id.indexOf('_Series_') === -1) {
                for (var i = 0; i < this.accumulation.accumulationHighlightModule.previousSelectedElement.length; i++) {
                    this.removeStyles(this.accumulation.accumulationHighlightModule.previousSelectedElement, indexFinder(this.accumulation.accumulationHighlightModule.previousSelectedElement[i].id));
                    this.blurEffect(this.accumulation.element.id, this.accumulation.visibleSeries);
                }
            }
            if (targetEle.id.indexOf('_Series_') > -1 || targetEle.id.indexOf('_datalabel_') > -1) {
                this.performSelection(indexFinder(targetEle.id), accumulation, targetEle);
            }
        }
    };
    /**
     * To perform the selection process based on index and element.
     * In multi-series mode, updates selection state for all series with matching mappingKey.
     * Applies selection styling to all matching points when mappingKey mode is enabled.
     *
     * @param {Index} index - The index of the data to select.
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {Element} element - The element representing the selected data.
     * @returns {void}
     */
    AccumulationSelection.prototype.performSelection = function (index, accumulation, element) {
        element = element.id.indexOf('datalabel') > -1 ?
            accumulation.getSeriesElement().childNodes[index.series].childNodes[index.point]
            : element;
        switch (this.currentMode) {
            case 'Point':
                if (!isNaN(index.point)) {
                    // In multi-series mode with mappingKey, select all matching points across series
                    if (accumulation.isMappingKeyMode && accumulation.visibleSeries && accumulation.visibleSeries.length > 1) {
                        // Find and apply selection to all matching points
                        var matchingPoints = this.findMatchingPointsByMappingKey(index, accumulation);
                        for (var _i = 0, matchingPoints_1 = matchingPoints; _i < matchingPoints_1.length; _i++) {
                            var match = matchingPoints_1[_i];
                            var matchElement = this.getElementByIndex(new Index(match.seriesIndex, match.pointIndex));
                            if (matchElement) {
                                var matchDataLabelElement = document.getElementById(accumulation.element.id + '_datalabel_Series_' + match.seriesIndex + '_g_' + match.pointIndex);
                                if (this.series[match.seriesIndex] && this.series[match.seriesIndex].dataLabel.visible &&
                                    matchDataLabelElement) {
                                    matchDataLabelElement.setAttribute('class', matchElement && matchElement.hasAttribute('class') ? matchElement.getAttribute('class') :
                                        matchDataLabelElement.hasAttribute('class') ? matchDataLabelElement.getAttribute('class') : '');
                                    this.selection(accumulation, new Index(match.seriesIndex, match.pointIndex), [matchDataLabelElement]);
                                }
                                this.selection(accumulation, new Index(match.seriesIndex, match.pointIndex), [matchElement]);
                            }
                        }
                    }
                    else {
                        // Single-series or no mappingKey: select only this point
                        var dataLabelElement = document.getElementById(accumulation.element.id + '_datalabel_Series_' + index.series + '_g_' + index.point);
                        if (this.series[0].dataLabel.visible && dataLabelElement) {
                            dataLabelElement.setAttribute('class', element && element.hasAttribute('class') ? element.getAttribute('class') : dataLabelElement.hasAttribute('class') ? dataLabelElement.getAttribute('class') : '');
                            this.selection(accumulation, index, [dataLabelElement]);
                        }
                        this.selection(accumulation, index, [element]);
                    }
                    this.selectionComplete(accumulation, accumulation.series[0]);
                    this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
                }
                break;
        }
    };
    /**
     * Check if two mappingKey values match (handles string and number comparisons).
     *
     * @private
     * @param {any} key1 - First mapping key value.
     * @param {any} key2 - Second mapping key value.
     * @returns {boolean} - True if keys match, false otherwise.
     */
    AccumulationSelection.prototype.isMatchingMappingKey = function (key1, key2) {
        if (isNullOrUndefined(key1) || isNullOrUndefined(key2)) {
            return false;
        }
        return key1.toString() === key2.toString();
    };
    /**
     * Find all points across all series that match the mappingKey value of the given point.
     * Used for multi-series selection where clicking one point selects all matching points.
     *
     * @private
     * @param {Index} index - The index of the reference point.
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {{ seriesIndex: number, pointIndex: number }[]} - Array of matching point coordinates.
     */
    AccumulationSelection.prototype.findMatchingPointsByMappingKey = function (index, accumulation) {
        var matches = [];
        var mappingKey = accumulation.legendSettings.mappingKey;
        var referencePoint = accumulation.visibleSeries[index.series].points[index.point];
        var referenceKeyValue = referencePoint[mappingKey];
        // Search through all series for matching points
        for (var seriesIdx = 0; seriesIdx < accumulation.visibleSeries.length; seriesIdx++) {
            var series = accumulation.visibleSeries[seriesIdx];
            for (var pointIdx = 0; pointIdx < series.points.length; pointIdx++) {
                var point = series.points[pointIdx];
                var pointKeyValue = point[mappingKey];
                if (this.isMatchingMappingKey(referenceKeyValue, pointKeyValue)) {
                    matches.push({ seriesIndex: seriesIdx, pointIndex: pointIdx });
                }
            }
        }
        return matches;
    };
    AccumulationSelection.prototype.legendSelectionForMappedPoints = function (accumulation, matchingPoints, targetEle, eventType) {
        if (eventType === 'mousemove') {
            if (targetEle.id.indexOf('text') > 1) {
                targetEle = getElement(targetEle.id.replace('text', 'shape'));
            }
            if (targetEle &&
                targetEle.hasAttribute('class') &&
                (targetEle.getAttribute('class').indexOf('highlight') > -1 ||
                    targetEle.getAttribute('class').indexOf('selection') > -1)) {
                return;
            }
            this.currentMode = this.accumulation.highlightMode;
        }
        var isPreSelected = this.isAlreadySelected(targetEle, eventType);
        if (!isPreSelected) {
            return;
        }
        var selectedElements = [];
        for (var _i = 0, matchingPoints_2 = matchingPoints; _i < matchingPoints_2.length; _i++) {
            var match = matchingPoints_2[_i];
            var seriesIndex = match.seriesIndex;
            var pointIndex = match.pointIndex;
            // ✅ Always fetch by ID — never rely on childNodes index
            var seriesElement = document.getElementById(accumulation.element.id + '_Series_' + seriesIndex);
            var pointElement = seriesElement
                ? seriesElement.children[pointIndex]
                : null;
            var dataLabelElement = document.getElementById(accumulation.element.id +
                '_datalabel_Series_' +
                seriesIndex +
                '_g_' +
                pointIndex);
            if (this.series[seriesIndex] &&
                this.series[seriesIndex].dataLabel.visible &&
                dataLabelElement) {
                this.selection(accumulation, new Index(seriesIndex, pointIndex), [dataLabelElement]);
            }
            this.selection(accumulation, new Index(seriesIndex, pointIndex), [pointElement]);
            selectedElements.push(pointElement);
        }
        this.previousSelectedElement = selectedElements;
        this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
    };
    /**
     * Method to get the selected data index.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {AccumulationSeries} series - The series to retrieve the selected data from index.
     * @returns {void}
     */
    AccumulationSelection.prototype.selectionComplete = function (accumulation, series) {
        var pointIndex;
        var selectedPointValues = [];
        for (var i = 0; i < this.selectedDataIndexes.length; i++) {
            pointIndex = this.selectedDataIndexes[i].point;
            if (!isNaN(pointIndex)) {
                var dataSource = series.dataSource;
                var xValue = dataSource && dataSource[pointIndex] ?
                    dataSource[pointIndex][series.xName] : null;
                selectedPointValues.push({
                    x: series.dataSource[pointIndex][series.xName], y: series.points[pointIndex].y,
                    seriesIndex: this.selectedDataIndexes[i].series, pointIndex: pointIndex
                });
            }
        }
        var args = {
            name: selectionComplete,
            selectedDataValues: selectedPointValues,
            cancel: false
        };
        accumulation.trigger(selectionComplete, args);
    };
    /**
     * To select the element by index. Adding or removing selection style class name.
     *
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {Index} index - The index of the element to select or deselect.
     * @param {Element[]} selectedElements - The array of selected elements.
     * @returns {void}
     */
    AccumulationSelection.prototype.selection = function (accumulation, index, selectedElements) {
        if (!accumulation.isMultiSelect && this.styleId.indexOf('highlight') === -1 &&
            accumulation.selectionMode !== 'None') {
            this.removeMultiSelectEelments(accumulation, this.selectedDataIndexes, index, accumulation.series);
        }
        var className = selectedElements[0] && (selectedElements[0].getAttribute('class') || '');
        if (selectedElements[0] && className.indexOf(this.getSelectionClass(selectedElements[0].id, index.point)) > -1) {
            this.removeStyles(selectedElements, index);
            if (this.styleId.indexOf('highlight') > 0 && accumulation.highlightMode !== 'None') {
                this.addOrRemoveIndex(this.highlightDataIndexes, index);
            }
            else {
                this.addOrRemoveIndex(this.selectedDataIndexes, index);
            }
            if (accumulation.enableBorderOnMouseMove && selectedElements[0].id.indexOf('datalabel') === -1) {
                var borderElement = document.getElementById(selectedElements[0].id.split('_')[0] + '_Series_' + index.series + '_PointHover_Border');
                if (!isNullOrUndefined(borderElement)) {
                    this.removeSvgClass(borderElement, borderElement.getAttribute('class'));
                }
            }
        }
        else {
            this.previousSelectedElement = accumulation.highlightMode !== 'None' ? selectedElements : [];
            if (selectedElements[0] && className.indexOf('selection') < 0) {
                this.applyStyles(selectedElements, index);
            }
            if (accumulation.enableBorderOnMouseMove && selectedElements[0].id.indexOf('datalabel') === -1) {
                var borderElement = document.getElementById(selectedElements[0].id.split('_')[0] + '_Series_' + index.series + '_PointHover_Border');
                if (!isNullOrUndefined(borderElement)) {
                    this.removeSvgClass(borderElement, borderElement.getAttribute('class'));
                    this.addSvgClass(borderElement, selectedElements[0].getAttribute('class'));
                }
            }
            if (this.styleId.indexOf('highlight') > 0 && accumulation.highlightMode !== 'None') {
                this.addOrRemoveIndex(this.highlightDataIndexes, index, true);
            }
            else {
                this.addOrRemoveIndex(this.selectedDataIndexes, index, true);
            }
        }
    };
    /**
     * To redraw the selection process on accumulation chart refresh.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {void}
     */
    AccumulationSelection.prototype.redrawSelection = function (accumulation) {
        var selectedDataIndexes = extend([], this.selectedDataIndexes, null, true);
        var highlightDataIndexes = extend([], this.highlightDataIndexes, null, true);
        if (this.styleId.indexOf('highlight') > 0 && highlightDataIndexes.length > 0) {
            this.removeSelectedElements(accumulation, this.highlightDataIndexes);
            selectedDataIndexes = highlightDataIndexes;
        }
        else {
            this.removeSelectedElements(accumulation, this.selectedDataIndexes);
        }
        this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
        this.selectDataIndex(selectedDataIndexes, accumulation);
    };
    /**
     * To remove the selected elements style classes by indexes.
     *
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @param {Index[]} indexes - The array of indexes representing elements to remove selection styles.
     * @returns {void}
     */
    AccumulationSelection.prototype.removeSelectedElements = function (accumulation, indexes) {
        for (var _i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
            var index = indexes_1[_i];
            this.removeStyles([this.getElementByIndex(index)], index);
        }
        var points = accumulation.visibleSeries[0].points;
        for (var i = 0; i < points.length; i++) {
            var index = new Index(0, points[i].index);
            this.removeStyles([this.getElementByIndex(index)], index);
            if (accumulation.visibleSeries[0].dataLabel.visible) {
                this.removeStyles([document.getElementById(accumulation.element.id + '_datalabel_Series_0_g_' + points[i].index)], index);
            }
        }
    };
    /**
     * To perform the selection for legend elements.
     * In multi-series mapping mode, highlights all matching points across series.
     *
     * @private
     */
    AccumulationSelection.prototype.legendSelection = function (accumulation, series, pointIndex, targetEle, eventType) {
        if (eventType === 'mousemove') {
            if (targetEle.id.indexOf('text') > 1) {
                targetEle = getElement(targetEle.id.replace('text', 'shape'));
            }
            if (targetEle.hasAttribute('class') &&
                (targetEle.getAttribute('class').indexOf('highlight') > -1 ||
                    targetEle.getAttribute('class').indexOf('selection') > -1)) {
                return;
            }
            this.currentMode = this.accumulation.highlightMode;
        }
        var isPreSelected = this.isAlreadySelected(targetEle, eventType);
        if (isPreSelected) {
            var seriesGroup = document.getElementById(accumulation.element.id + '_Series_' + series);
            var seriesElement = seriesGroup
                ? seriesGroup.children[pointIndex]
                : null;
            var dataLabelElement = document.getElementById(accumulation.element.id +
                '_datalabel_Series_' +
                series +
                '_g_' +
                pointIndex);
            if (this.series[series].dataLabel.visible && dataLabelElement) {
                this.selection(accumulation, new Index(series, pointIndex), [dataLabelElement]);
            }
            if (seriesElement) {
                this.selection(accumulation, new Index(series, pointIndex), [seriesElement]);
            }
            this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
        }
    };
    /**
     * To select the element by selected data indexes.
     *
     * @param {Index[]} indexes - The array of indexes representing elements to select.
     * @param {AccumulationChart} accumulation - The accumulation chart control.
     * @returns {void}
     */
    AccumulationSelection.prototype.selectDataIndex = function (indexes, accumulation) {
        var element;
        for (var _i = 0, indexes_2 = indexes; _i < indexes_2.length; _i++) {
            var index = indexes_2[_i];
            element = this.getElementByIndex(index);
            if (element) {
                this.performSelection(index, accumulation, element);
            }
        }
    };
    /**
     * To remove the selection styles for multi selection process.
     *
     * @param {AccumulationChart} accumulation - The Accumulation Chart control.
     * @param {Index[]} index - The array of indexes representing elements to remove selection styles for multi selection process.
     * @param {Index} currentIndex - The current index to remove from selection.
     * @param {AccumulationSeriesModel[]} seriesCollection - The array of visible series in the accumulation chart.
     * @returns {void}
     */
    AccumulationSelection.prototype.removeMultiSelectEelments = function (accumulation, index, currentIndex, seriesCollection) {
        var series;
        for (var i = 0; i < index.length; i++) {
            series = seriesCollection[index[i].series];
            if (!this.checkEquals(index[i], currentIndex)) {
                this.removeStyles(this.findElements(accumulation, series, index[i]), index[i]);
                if (series.dataLabel.visible) {
                    this.removeStyles([document.getElementById(accumulation.element.id + '_datalabel_Series_0_g_' + index[i].point)], index[i]);
                }
                index.splice(i, 1);
                i--;
            }
        }
    };
    /**
     * To apply the opacity effect for accumulation chart series elements.
     * In multi-series mode, de-highlights non-matching points.
     *
     * @param  {string} pieId - The id of the pie element.
     * @param  {AccumulationSeries[]} visibleSeries - The array of visible series in the accumulation chart.
     * @returns {void}
     */
    AccumulationSelection.prototype.blurEffect = function (pieId, visibleSeries) {
        var visibility = (this.checkVisibility(this.highlightDataIndexes) ||
            this.checkVisibility(this.selectedDataIndexes)); // legend click scenario
        for (var _i = 0, visibleSeries_1 = visibleSeries; _i < visibleSeries_1.length; _i++) {
            var series = visibleSeries_1[_i];
            if (series.visible) {
                this.checkSelectionElements(document.getElementById(pieId + '_SeriesCollection'), this.generateStyle(series), visibility, series.index);
            }
        }
    };
    /**
     * To check selection elements by style class name.
     *
     * @param {Element} element - The element to check selection elements by style class name.
     * @param {string} className - The class name to check.
     * @param {boolean} visibility - Indicates whether the element should be visible.
     * @param {number} seriesIndex - Index of the series.
     * @returns {void}
     */
    AccumulationSelection.prototype.checkSelectionElements = function (element, className, visibility, seriesIndex) {
        var selectionElements = [];
        var id = this.control.element.id;
        var seriesGroup = document.getElementById(id + '_Series_' + seriesIndex);
        if (seriesGroup) {
            for (var i = 0; i < seriesGroup.children.length; i++) {
                selectionElements.push(seriesGroup.children[i]);
            }
        }
        var dataLabelGroup = document.getElementById(id + '_datalabel_Series_' + seriesIndex);
        if (dataLabelGroup) {
            for (var i = 0; i < dataLabelGroup.children.length; i++) {
                selectionElements.push(dataLabelGroup.children[i]);
            }
        }
        var legendShape;
        var elementClass;
        var parentClass;
        //let selectElement: Element = element;
        for (var i = 0; i < selectionElements.length; i++) {
            elementClass = selectionElements[i].getAttribute('class') || '';
            parentClass = selectionElements[i].parentNode.getAttribute('class') || '';
            if (this.accumulation.selectionMode !== 'None' || this.accumulation.highlightMode !== 'None') {
                className = elementClass.indexOf('selection') > 0 ||
                    elementClass.indexOf('highlight') > 0 ? elementClass : className;
                className = (parentClass.indexOf('selection') > 0 ||
                    parentClass.indexOf('highlight') > 0) ? parentClass : className;
            }
            if (elementClass.indexOf(className) === -1 && parentClass.indexOf(className) === -1 && visibility) {
                this.addSvgClass(selectionElements[i], this.unselected);
            }
            else {
                this.removeSvgClass(selectionElements[i], this.unselected);
            }
            if (elementClass.indexOf(className) === -1 &&
                parentClass.indexOf(className) === -1 && visibility) {
                this.addSvgClass(selectionElements[i], this.unselected);
            }
            else {
                // selectElement = children[i as number] as HTMLElement;
                this.removeSvgClass(selectionElements[i], this.unselected);
                this.removeSvgClass(selectionElements[i].parentNode, this.unselected);
            }
            if (this.control.accumulationLegendModule &&
                this.control.legendSettings.visible) {
                // STANDARDIZED: All charts use seriesIndex_pointIndex format for legend IDs
                var legendShapeId = this.control.element.id + '_chart_legend_shape_' + seriesIndex + '_' + i;
                legendShape = document.getElementById(legendShapeId);
                if (legendShape) {
                    var legendCollectionIndex = this.control.accumulationLegendModule.findLegendCollectionIndex(seriesIndex, i);
                    var legendOption = legendCollectionIndex !== -1 ?
                        this.accumulation.accumulationLegendModule.legendCollections[legendCollectionIndex] : null;
                    if (legendOption && legendOption.visible &&
                        elementClass.indexOf(className) === -1 && parentClass.indexOf(className) === -1 && visibility) {
                        this.addSvgClass(legendShape, this.unselected);
                    }
                    else {
                        this.removeSvgClass(legendShape, this.unselected);
                    }
                }
            }
        }
    };
    /**
     * To apply selection style for elements.
     *
     * @param  {Element[]} elements - The array of elements to apply the selection style.
     * @param  {Index} index - The index to apply the selection style.
     * @returns {void}
     */
    AccumulationSelection.prototype.applyStyles = function (elements, index) {
        var accumulationTooltip = this.control.accumulationTooltipModule;
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            var legendShape = void 0;
            if (element) {
                if (this.control.accumulationLegendModule &&
                    this.control.legendSettings.visible) {
                    var legendShapeId = this.control.element.id + '_chart_legend_shape_' + index.series + '_' + index.point;
                    legendShape = document.getElementById(legendShapeId);
                    if (legendShape) {
                        this.removeSvgClass(legendShape, legendShape.getAttribute('class'));
                        this.addSvgClass(legendShape, this.getSelectionClass(legendShape.id, index.point));
                    }
                }
                this.removeSvgClass(element.parentNode, this.unselected);
                this.removeSvgClass(element, this.unselected);
                var opacity = accumulationTooltip && (accumulationTooltip.previousPoints.length > 0 &&
                    accumulationTooltip.previousPoints[0].point.index !== index.point) ?
                    accumulationTooltip.svgTooltip.opacity : this.series[index.series].opacity;
                element.setAttribute('opacity', opacity.toString());
                this.addSvgClass(element, this.getSelectionClass(element.id, index.point));
            }
        }
    };
    /**
     * To get selection style class name by id.
     *
     * @param  {string} id - The id of the element to retrieve the selection style class name.
     * @param  {number} point - The point for the selection.
     * @returns {string} - The selection style class name.
     */
    AccumulationSelection.prototype.getSelectionClass = function (id, point) {
        return this.generateStyle(this.control.series[indexFinder(id).series], point);
    };
    /**
     * To remove selection style for elements.
     *
     * @param  {Element[]} elements - The array of elements from which to remove the selection style.
     * @param  {Index} index - The index to remove from the selection.
     * @returns {void}
     */
    AccumulationSelection.prototype.removeStyles = function (elements, index) {
        var accumulationTooltip = this.control.accumulationTooltipModule;
        var legendShape;
        for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
            var element = elements_2[_i];
            if (element) {
                if (this.control.accumulationLegendModule &&
                    this.control.legendSettings.visible) {
                    // For multi-series, legend shape ID includes series and point indices
                    var legendShapeId = this.control.element.id + '_chart_legend_shape_' + index.series + '_' + index.point;
                    legendShape = document.getElementById(legendShapeId);
                    if (legendShape) {
                        this.removeSvgClass(legendShape, this.getSelectionClass(legendShape.id, index.point));
                    }
                }
                var opacity = accumulationTooltip && accumulationTooltip.previousPoints.length > 0
                    && (accumulationTooltip.previousPoints[0].point.index === index.point) ?
                    accumulationTooltip.svgTooltip.opacity : this.series[index.series].opacity;
                element.setAttribute('opacity', opacity.toString());
                this.removeSvgClass(element, this.getSelectionClass(element.id, index.point));
            }
        }
    };
    /**
     * To apply or remove selected elements index.
     *
     * @param  {Index[]} indexes - The array of indexes representing elements to apply or remove selection.
     * @param  {Index} index - The index to add or remove from the selection.
     * @param  {boolean} add - Indicates whether to add or remove the index.
     * @returns {void}
     */
    AccumulationSelection.prototype.addOrRemoveIndex = function (indexes, index, add) {
        for (var i = 0; i < indexes.length; i++) {
            if (this.checkEquals(indexes[i], index)) {
                indexes.splice(i, 1);
                i--;
            }
        }
        if (add) {
            indexes.push(index);
        }
    };
    /**
     * To check two index, point and series are equal.
     *
     * @param  {Index} first - The first index.
     * @param  {Index} second - The second index.
     * @returns {boolean} - Indicates whether the two indexes are equal.
     */
    AccumulationSelection.prototype.checkEquals = function (first, second) {
        return ((first.point === second.point) && (first.series === second.series));
    };
    AccumulationSelection.prototype.findMatchingPointsForHighlight = function (currentPoint) {
        var matches = [];
        var mappingKey = this.accumulation.legendSettings.mappingKey;
        var keyValue = currentPoint[mappingKey];
        // Iterate through all series to find matching points
        for (var seriesIndex = 0; seriesIndex < this.accumulation.series.length; seriesIndex++) {
            var seriesModel = this.accumulation.series[seriesIndex];
            var series = seriesModel;
            if (!series || !series.points) {
                continue;
            }
            // Search for matching points within this series
            for (var pointIndex = 0; pointIndex < series.points.length; pointIndex++) {
                var point = series.points[pointIndex];
                if (point && point[mappingKey] === keyValue) {
                    matches.push({
                        seriesIndex: seriesIndex,
                        pointIndex: pointIndex
                    });
                }
            }
        }
        return matches;
    };
    /**
     * Highlight all matching points across series based on mappingKey.
     * Clears previous highlights and highlights all matching points, then de-highlights others.
     *
     * @private
     * @param {AccumulationChart} accumulation - The accumulation chart control
     * @param {Element} targetElement - The target element being hovered
     * @returns {void}
     */
    AccumulationSelection.prototype.highlightMatchingPoints = function (accumulation, targetElement) {
        var index = indexFinder(targetElement.id);
        // Validate index
        if (isNullOrUndefined(index.series) || isNaN(index.series) ||
            isNullOrUndefined(index.point) || isNaN(index.point)) {
            return;
        }
        var seriesModel = accumulation.series[index.series];
        var series = seriesModel;
        var point = series.points[index.point];
        if (accumulation.isMappingKeyMode && point) {
            // Multi-series mode: highlight all matching points
            var matchingPoints = this.findMatchingPointsForHighlight(point);
            // Clear previous highlights first
            if (this.previousSelectedElement && this.previousSelectedElement.length > 0) {
                for (var i = 0; i < this.previousSelectedElement.length; i++) {
                    this.removeStyles([this.previousSelectedElement[i]], indexFinder(this.previousSelectedElement[i].id));
                }
            }
            // Apply highlight to all matching points
            this.previousSelectedElement = [];
            this.highlightDataIndexes = [];
            for (var _i = 0, matchingPoints_3 = matchingPoints; _i < matchingPoints_3.length; _i++) {
                var match = matchingPoints_3[_i];
                var pointElement = this.getElementByIndex(new Index(match.seriesIndex, match.pointIndex));
                if (pointElement) {
                    this.applyStyles([pointElement], new Index(match.seriesIndex, match.pointIndex));
                    this.previousSelectedElement.push(pointElement);
                    this.addOrRemoveIndex(this.highlightDataIndexes, new Index(match.seriesIndex, match.pointIndex), true);
                }
                // Apply to data label if visible
                var dataLabelElement = document.getElementById(accumulation.element.id + '_datalabel_Series_' + match.seriesIndex + '_g_' + match.pointIndex);
                if (this.series[match.seriesIndex] && this.series[match.seriesIndex].dataLabel.visible && dataLabelElement) {
                    this.applyStyles([dataLabelElement], new Index(match.seriesIndex, match.pointIndex));
                }
            }
            // De-highlight all non-matching points via blur effect
            this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
        }
    };
    /**
     *The mouse move event.
     *
     * @private
     * @param  {PointerEvent | TouchEvent} event - The mouse move event or touch event.
     * @returns {void}
     */
    AccumulationSelection.prototype.mouseMove = function (event) {
        var accumulation = this.accumulation;
        var targetElement = event.target;
        if (accumulation.highlightMode !== 'None') {
            if (!isNullOrUndefined(targetElement)) {
                if (event.target.id.indexOf('text') > 1) {
                    targetElement = getElement(event.target.id.replace('text', 'shape'));
                }
                if ((targetElement).hasAttribute('class') && (targetElement).getAttribute('class').indexOf('highlight') > -1) {
                    return;
                }
                // Handle multi-series highlighting with mappingKey
                if (targetElement.id.indexOf('_Series_') > -1 && accumulation.isMappingKeyMode) {
                    this.highlightMatchingPoints(accumulation, targetElement);
                    return;
                }
                this.calculateSelectedElements(accumulation, event.target, event.type);
                return;
            }
        }
        if (accumulation.selectionMode === 'None') {
            return;
        }
    };
    // /**
    //  * To check selected points are visibility.
    //  *
    //  * @param  {Indexes[]} selectedDataIndexes - The array of indexes representing selected points.
    //  * @returns {boolean} - Indicates whether the selected points are visible.
    //  */
    // private checkPointVisibility(selectedDataIndexes: Indexes[]): boolean {
    //     let visible: boolean = false;
    //     for (const data of selectedDataIndexes) {
    //         if (pointByIndex(data.point, <AccPoints[]>this.control.visibleSeries[0].points).visible) {
    //             visible = true;
    //             break;
    //         }
    //     }
    //     return visible;
    // }
    /**
     * Get module name.
     *
     * @private
     * @returns {string} - Returns the module name.
     */
    AccumulationSelection.prototype.getModuleName = function () {
        return 'AccumulationSelection';
    };
    /**
     * To destroy the selection.
     *
     * @returns {void}
     * @private
     */
    AccumulationSelection.prototype.destroy = function () {
        // Destroy method performed here
        this.removeEventListener();
    };
    return AccumulationSelection;
}(BaseSelection));
export { AccumulationSelection };
