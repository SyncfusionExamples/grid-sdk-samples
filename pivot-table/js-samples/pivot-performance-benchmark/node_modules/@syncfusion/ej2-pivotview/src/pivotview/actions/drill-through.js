import { contentReady } from '../../common/base/constant';
import * as events from '../../common/base/constant';
import { DrillThroughDialog } from '../../common/popups/drillthrough-dialog';
import { closest, EventHandler, isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { PivotUtil } from '../../base/util';
/**
 * `DrillThrough` module.
 */
var DrillThrough = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {PivotView} parent - Instance of pivot table.
     * @hidden
     */
    function DrillThrough(parent) {
        this.parent = parent;
        this.drillThroughDialog = new DrillThroughDialog(this.parent);
        this.addInternalEvents();
    }
    /**
     * It returns the Module name.
     *
     * @returns {string} - string.
     * @hidden
     */
    DrillThrough.prototype.getModuleName = function () {
        return 'drillThrough';
    };
    DrillThrough.prototype.addInternalEvents = function () {
        if (this.parent) {
            this.parent.on(contentReady, this.wireEvents, this);
        }
    };
    DrillThrough.prototype.wireEvents = function () {
        this.unWireEvents();
        if (this.parent && this.parent.element) {
            EventHandler.add(this.parent.element, 'dblclick', this.mouseClickHandler, this);
        }
    };
    DrillThrough.prototype.unWireEvents = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.parent && this.parent.element && !this.parent.isDestroyed) {
            EventHandler.remove(this.parent.element, 'dblclick', this.mouseClickHandler);
        }
    };
    DrillThrough.prototype.mouseClickHandler = function (e) {
        if (!this.parent) {
            return;
        }
        var target = e.target;
        var ele = null;
        if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-headercelldiv') ||
            target.classList.contains('e-stackedheadertext') || target.classList.contains('e-headertext')) {
            ele = closest(target.parentElement, 'th');
        }
        else if (target.classList.contains('e-cellvalue')) {
            ele = target.parentElement;
        }
        else if (target.classList.contains('e-headercell') || target.classList.contains('e-rowcell')) {
            ele = target;
        }
        if (ele) {
            if (this.parent.pivotValues.length > 0 && this.parent.dataSourceSettings.values.length > 0 &&
                (this.parent.allowDrillThrough || this.parent.editSettings.allowEditing) && ele.classList.contains('e-valuescontent')) {
                var colIndex = parseInt(ele.getAttribute('aria-colindex'), 10) - 1;
                var rowIndex = Number(ele.getAttribute('index'));
                if (!isNullOrUndefined(this.parent.pivotValues[rowIndex]) &&
                    !isNullOrUndefined(this.parent.pivotValues[rowIndex][colIndex])) {
                    this.executeDrillThrough(this.parent.pivotValues[rowIndex][colIndex], rowIndex, colIndex, ele);
                }
            }
        }
    };
    /** @hidden */
    DrillThrough.prototype.executeDrillThrough = function (pivotValue, rowIndex, colIndex, element) {
        this.parent.drillThroughElement = element;
        this.parent.drillThroughValue = pivotValue;
        var engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        if (PivotUtil.invokeActionMethod(this.parent, events.actionBegin, events.openDrillThrough)) {
            return;
        }
        var valueCaption = '';
        var aggType = '';
        var rawData = [];
        if (!isNullOrUndefined(pivotValue.rowHeaders) && !isNullOrUndefined(pivotValue.columnHeaders)) {
            if (this.parent.dataType === 'olap') {
                var tupleInfo = void 0;
                if (this.parent.dataSourceSettings.valueAxis === 'row') {
                    tupleInfo = engine.tupRowInfo[pivotValue.rowOrdinal];
                }
                else {
                    tupleInfo = engine.tupColumnInfo[pivotValue.colOrdinal];
                }
                var measureName = tupleInfo ?
                    engine.getUniqueName(tupleInfo.measureName) : pivotValue.actualText;
                if (engine.fieldList[measureName] && engine.fieldList[measureName].isCalculatedField) {
                    this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('drillError'));
                    this.parent.actionObj.actionName = '';
                    this.parent.actionObj.actionInfo = undefined;
                    return;
                }
                valueCaption = engine.fieldList[measureName || pivotValue.actualText].caption;
                aggType = engine.fieldList[measureName || pivotValue.actualText].aggregateType;
                try {
                    this.parent.olapEngineModule.getDrillThroughData(pivotValue, this.parent.maxRowsInDrillThrough);
                    rawData = JSON.parse(engine.gridJSON);
                }
                catch (exception) {
                    if (this.parent.olapEngineModule.errorInfo) {
                        this.parent.actionFailureMethod(this.parent.olapEngineModule.errorInfo);
                    }
                    this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('error'), this.parent.olapEngineModule.errorInfo ?
                        this.parent.olapEngineModule.errorInfo : engine.gridJSON);
                    this.parent.olapEngineModule.errorInfo = undefined;
                    this.parent.actionObj.actionName = '';
                    this.parent.actionObj.actionInfo = undefined;
                    return;
                }
            }
            else {
                valueCaption = engine.fieldList[pivotValue.actualText.toString()] ?
                    engine.fieldList[pivotValue.actualText.toString()].caption : pivotValue.actualText.toString();
                aggType = engine.fieldList[pivotValue.actualText] ? engine.fieldList[pivotValue.actualText].aggregateType : '';
                if (this.parent.dataSourceSettings.mode === 'Server') {
                    this.parent.getEngine('fetchRawData', null, null, null, null, null, null, { rowIndex: rowIndex, columnIndex: colIndex });
                }
                else {
                    if (this.parent.allowDataCompression) {
                        var indexArray = Object.keys(pivotValue.indexObject);
                        this.drillThroughDialog.indexString = [];
                        for (var _i = 0, indexArray_1 = indexArray; _i < indexArray_1.length; _i++) {
                            var cIndex = indexArray_1[_i];
                            for (var _a = 0, _b = this.parent.engineModule.groupRawIndex[Number(cIndex)]; _a < _b.length; _a++) {
                                var aIndex = _b[_a];
                                rawData.push(this.parent.engineModule.actualData[aIndex]);
                                this.drillThroughDialog.indexString.push(aIndex.toString());
                            }
                        }
                    }
                    else {
                        var indexArray = Object.keys(pivotValue.indexObject);
                        for (var _c = 0, indexArray_2 = indexArray; _c < indexArray_2.length; _c++) {
                            var index = indexArray_2[_c];
                            rawData.push(this.parent.engineModule.data[Number(index)]);
                        }
                    }
                }
            }
            if (this.parent.dataSourceSettings.mode !== 'Server') {
                this.triggerDialog(valueCaption, aggType, rawData, pivotValue, element);
            }
        }
    };
    DrillThrough.prototype.frameData = function (eventArgs) {
        var keyPos = 0;
        var dataPos = 0;
        var data = [];
        while (dataPos < eventArgs.rawData.length) {
            var framedHeader = {};
            while (keyPos < eventArgs.gridColumns.length) {
                framedHeader[eventArgs.gridColumns[keyPos].field] = this.parent.dataSourceSettings.mode === 'Server' ?
                    eventArgs.rawData[dataPos][this.parent.engineModule.fields.indexOf(eventArgs.gridColumns[keyPos]
                        .field) !== -1 ? this.parent.engineModule.fields.indexOf(eventArgs.gridColumns[keyPos].field) : 0] :
                    eventArgs.rawData[dataPos][this.parent.engineModule.fieldKeys[eventArgs.gridColumns[keyPos]
                        .field]];
                keyPos++;
            }
            data.push(framedHeader);
            dataPos++;
            keyPos = 0;
        }
        eventArgs.rawData = data;
        return eventArgs;
    };
    /** @hidden */
    DrillThrough.prototype.triggerDialog = function (valueCaption, aggType, rawData, pivotValue, element) {
        if (!this.parent) {
            return;
        }
        var valuetText = aggType === 'CalculatedField' ? valueCaption.toString() : aggType !== '' ?
            (this.parent.localeObj.getConstant(aggType) + ' ' + this.parent.localeObj.getConstant('of') + ' ' + valueCaption) :
            valueCaption;
        valuetText = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(valuetText) : valuetText;
        var rowHeaders = this.parent.dataSourceSettings.valueAxis === 'row' ? this.parent.getRowText(Number(element.getAttribute('index')), 0) :
            pivotValue.rowHeaders === '' ? '' : pivotValue.rowHeaders.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).join(' - ');
        var eventArgs = {
            currentTarget: element,
            currentCell: pivotValue,
            rawData: rawData,
            rowHeaders: rowHeaders,
            columnHeaders: pivotValue.columnHeaders === '' ? '' : pivotValue.columnHeaders.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).join(' - '),
            value: valuetText + '(' + pivotValue.formattedText + ')',
            gridColumns: this.drillThroughDialog.frameGridColumns(rawData),
            cancel: false
        };
        if (this.parent.dataSourceSettings.type === 'CSV') {
            eventArgs = this.frameData(eventArgs);
        }
        var drillThrough = this;
        this.parent.trigger(events.drillThrough, eventArgs, function (observedArgs) {
            if (!eventArgs.cancel) {
                drillThrough.drillThroughDialog.showDrillThroughDialog(observedArgs, valuetText);
            }
        });
    };
    /**
     * To destroy the drillthrough module.
     *
     * @returns  {void}
     * @hidden
     */
    DrillThrough.prototype.destroy = function () {
        this.unWireEvents();
        if (this.drillThroughDialog) {
            this.drillThroughDialog.destroy();
            this.drillThroughDialog = null;
        }
    };
    return DrillThrough;
}());
export { DrillThrough };
