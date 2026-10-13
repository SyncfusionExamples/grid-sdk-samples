import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { PivotButton } from '../../common/actions/pivot-button';
import { DataManager } from '@syncfusion/ej2-data';
/**
 * Module to render Axis Fields
 */
/** @hidden */
var AxisFieldRenderer = /** @class */ (function () {
    /** Constructor for render module */
    function AxisFieldRenderer(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the pivot button rendering
     *
     * @returns {void}
     * @private
     */
    AxisFieldRenderer.prototype.render = function () {
        if (!this.parent.pivotButtonModule || (this.parent.pivotButtonModule && this.parent.pivotButtonModule.isDestroyed)) {
            new PivotButton(this.parent);
        }
        this.parent.pivotButtonModule.cleanupButtonElements();
        this.createPivotButtons();
    };
    AxisFieldRenderer.prototype.createPivotButtons = function () {
        var rows = this.parent.dataSourceSettings.rows;
        var columns = this.parent.dataSourceSettings.columns;
        var values = this.parent.dataSourceSettings.values;
        var filters = this.parent.dataSourceSettings.filters;
        var fields = [rows, columns, values, filters];
        var parentElement = this.parent.dialogRenderer.parentElement;
        if (parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-filters')) {
            parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-filters').querySelector('.' + cls.AXIS_CONTENT_CLASS).innerHTML = '';
        }
        if (parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-rows')) {
            parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-rows').querySelector('.' + cls.AXIS_CONTENT_CLASS).innerHTML = '';
        }
        if (parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-columns')) {
            parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-columns').querySelector('.' + cls.AXIS_CONTENT_CLASS).innerHTML = '';
        }
        if (parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-values')) {
            parentElement.querySelector('.' + cls.FIELD_LIST_CLASS + '-values').querySelector('.' + cls.AXIS_CONTENT_CLASS).innerHTML = '';
        }
        if ((this.parent.engineModule && this.parent.engineModule.fieldList && Object.keys(this.parent.engineModule.fieldList).length > 0)
            || this.parent.dataType !== 'pivot') {
            if ((this.parent.dataType === 'pivot' && this.parent.dataSourceSettings.dataSource &&
                ((!(this.parent.dataSourceSettings.dataSource instanceof DataManager) &&
                    (this.parent.dataSourceSettings.dataSource.length > 0)) ||
                    (this.parent.dataSourceSettings.dataSource instanceof DataManager && this.parent.engineModule.data &&
                        this.parent.engineModule.data.length > 0))) ||
                (this.parent.dataType === 'olap' && this.parent.dataSourceSettings.url && this.parent.dataSourceSettings.url !== '') ||
                (this.parent.dataSourceSettings.mode === 'Server' && this.parent.dataSourceSettings.url !== '')) {
                var axis = ['rows', 'columns', 'values', 'filters'];
                for (var len = 0, lnt = fields.length; len < lnt; len++) {
                    if (fields[len]) {
                        var args = {
                            field: fields[len],
                            axis: axis[len].toString()
                        };
                        this.parent.notify(events.pivotButtonUpdate, args);
                    }
                }
            }
        }
    };
    /**
     * Destroys the AxisFieldRenderer instance
     *
     * @returns {void}
     * @hidden
     */
    AxisFieldRenderer.prototype.destroy = function () {
        var parentElement = this.parent.dialogRenderer.parentElement;
        if (parentElement) {
            var contentSelectors = [
                '.' + cls.FIELD_LIST_CLASS + '-filters',
                '.' + cls.FIELD_LIST_CLASS + '-rows',
                '.' + cls.FIELD_LIST_CLASS + '-columns',
                '.' + cls.FIELD_LIST_CLASS + '-values'
            ];
            for (var _i = 0, contentSelectors_1 = contentSelectors; _i < contentSelectors_1.length; _i++) {
                var selector = contentSelectors_1[_i];
                var element = parentElement.querySelector(selector);
                if (element && element.querySelector('.' + cls.AXIS_CONTENT_CLASS)) {
                    element.querySelector('.' + cls.AXIS_CONTENT_CLASS).innerHTML = '';
                }
            }
        }
    };
    return AxisFieldRenderer;
}());
export { AxisFieldRenderer };
