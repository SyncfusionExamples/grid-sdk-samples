import { Dialog } from '@syncfusion/ej2-popups';
import { isNullOrUndefined as isNaN, createElement, extend, remove, addClass, select, SanitizeHtmlHelper, getInstance } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { ColorPicker, TextBox } from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { CheckBox } from '@syncfusion/ej2-buttons';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { PivotUtil } from '../../base/util';
/**
 * Module to render Conditional Formatting Dialog
 */
/** @hidden */
var ConditionalFormatting = /** @class */ (function () {
    /** Constructor for conditionalformatting module
     *
     * @param {PivotView} parent - Instance of pivot table.
     */
    function ConditionalFormatting(parent) {
        this.parent = parent;
        this.parent.conditionalFormattingModule = this;
        this.parentID = this.parent.element.id;
        this.fontColor = [];
        this.backgroundColor = [];
        this.newFormat = [];
    }
    /**
     * To get module name.
     *
     * @returns {string} - Module name.
     */
    ConditionalFormatting.prototype.getModuleName = function () {
        return 'conditionalFormatting';
    };
    ConditionalFormatting.prototype.createDialog = function () {
        if (select('#' + this.parentID + 'conditionalformatting', document) !== null) {
            remove(select('#' + this.parentID + 'conditionalformatting', document));
        }
        var conditionalFormattingElement = createElement('div', {
            id: this.parentID + 'conditionalformatting',
            className: cls.FORMAT_DIALOG
        });
        this.parent.element.appendChild(conditionalFormattingElement);
        var buttonModel = [
            {
                click: this.addButtonClick.bind(this),
                isFlat: false,
                buttonModel: {
                    cssClass: (this.parent.isAdaptive ? (cls.FORMAT_ROUND_BUTTON + ' ' + cls.FORMAT_CONDITION_BUTTON) :
                        cls.FORMAT_CONDITION_BUTTON) + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    iconCss: cls.ICON + ' ' + cls.ADD_ICON_CLASS,
                    content: this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('condition')
                }
            },
            {
                click: this.applyButtonClick.bind(this),
                isFlat: false,
                buttonModel: {
                    isPrimary: true, cssClass: cls.FORMAT_APPLY_BUTTON + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    content: this.parent.localeObj.getConstant('apply')
                }
            },
            {
                click: this.cancelButtonClick.bind(this),
                isFlat: false,
                buttonModel: {
                    cssClass: cls.FORMAT_CANCEL_BUTTON + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
                    content: this.parent.localeObj.getConstant('cancel')
                }
            }
        ];
        var dialog;
        if (this.parent.isAdaptive) {
            dialog = new Dialog({
                animationSettings: { effect: 'Zoom' }, isModal: true, width: '100%', height: '100%',
                showCloseIcon: false, closeOnEscape: false, enableRtl: this.parent.enableRtl, locale: this.parent.locale,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                position: { X: 'center', Y: 'center' }, allowDragging: true, buttons: buttonModel,
                beforeOpen: this.beforeOpen.bind(this), close: this.removeDialog.bind(this),
                cssClass: this.parent.cssClass, header: this.parent.localeObj.getConstant('conditionalFormatting'),
                target: PivotUtil.getAppendToElement(this.parent.element, this.parent.isAngular)
            });
        }
        else {
            dialog = new Dialog({
                allowDragging: true, position: { X: 'center', Y: 'center' }, buttons: buttonModel,
                beforeOpen: this.beforeOpen.bind(this), close: this.removeDialog.bind(this),
                cssClass: this.parent.cssClass, isModal: true, closeOnEscape: true,
                enableRtl: this.parent.enableRtl, locale: this.parent.locale, enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                showCloseIcon: true, header: this.parent.localeObj.getConstant('conditionalFormatting'), target: this.parent.element
            });
        }
        dialog.isStringTemplate = true;
        dialog.isAngular = this.parent.isModalDialog;
        dialog.appendTo(conditionalFormattingElement);
        // dialog.element.querySelector('.e-dlg-header').innerText = this.parent.localeObj.getConstant('conditionalFormating');
    };
    ConditionalFormatting.prototype.beforeOpen = function () {
        select('#' + this.parentID + 'conditionalformatting', document).querySelector('.' + cls.DIALOG_HEADER)
            .setAttribute('title', this.parent.localeObj.getConstant('conditionalFormatting'));
    };
    ConditionalFormatting.prototype.addButtonClick = function () {
        var _this = this;
        var format = {
            conditions: 'LessThan',
            value1: 0,
            applyGrandTotals: true,
            style: {
                backgroundColor: 'white',
                color: 'black',
                fontFamily: 'Arial',
                fontSize: '12px'
            }
        };
        var conditionalFormating = this;
        this.parent.trigger(events.conditionalFormatting, format, function (observedArgs) {
            conditionalFormating.refreshConditionValues();
            _this.destroyColorPickers();
            conditionalFormating.newFormat.push(observedArgs);
            conditionalFormating.addFormat();
        });
    };
    ConditionalFormatting.prototype.applyButtonClick = function () {
        if (this.refreshConditionValues()) {
            this.parent.setProperties({ dataSourceSettings: { conditionalFormatSettings: this.newFormat } }, true);
            var actionInfo = {
                conditionalFormattingInfo: this.parent.dataSourceSettings.conditionalFormatSettings
            };
            this.parent.actionObj.actionInfo = actionInfo;
            if (this.parent.dataSourceSettings.values.length > 0) {
                this.parent.renderPivotGrid();
            }
            var dialog = getInstance(select('#' + this.parentID + 'conditionalformatting', document), Dialog);
            dialog.close();
        }
    };
    ConditionalFormatting.prototype.cancelButtonClick = function () {
        var dialog = getInstance(select('#' + this.parentID + 'conditionalformatting', document), Dialog);
        dialog.close();
        this.newFormat = [];
    };
    ConditionalFormatting.prototype.refreshConditionValues = function () {
        for (var i = 0; i < this.newFormat.length; i++) {
            if (select('#' + this.parentID + 'conditionvalue1' + i, document).value === '' ||
                select('#' + this.parentID + 'conditionvalue2' + i, document).value === '') {
                if (select('#' + this.parentID + 'conditionvalue1' + i, document).value === '') {
                    select('#' + this.parentID + 'conditionvalue1' + i, document).focus();
                }
                else {
                    select('#' + this.parentID + 'conditionvalue2' + i, document).focus();
                }
                return false;
            }
            this.newFormat[i].value1 =
                Number(select('#' + this.parentID + 'conditionvalue1' + i, document).value);
            this.newFormat[i].value2 =
                Number(select('#' + this.parentID + 'conditionvalue2' + i, document).value);
        }
        return true;
    };
    ConditionalFormatting.prototype.addFormat = function () {
        var format = createElement('div', { id: this.parentID + 'formatDiv', className: cls.FORMAT_NEW });
        for (var i = 0; i < this.newFormat.length; i++) {
            format.appendChild(this.createDialogElements(i));
        }
        if (this.newFormat.length === 0) {
            var outerDiv = this.createDialogElements();
            var element = createElement('p', {
                id: this.parentID + 'emptyFormat',
                className: cls.EMPTY_FORMAT
            });
            element.innerText = this.parent.localeObj.getConstant('emptyFormat');
            outerDiv.appendChild(element);
            format.appendChild(outerDiv);
        }
        var dialog = getInstance(select('#' + this.parentID + 'conditionalformatting', document), Dialog);
        dialog.setProperties({ 'content': format }, false);
        for (var i = 0; i < this.newFormat.length; i++) {
            this.renderDropDowns(i);
            this.renderColorPicker(i);
        }
    };
    ConditionalFormatting.prototype.createDialogElements = function (i) {
        var outerDiv = createElement('div', {
            id: this.parentID + 'outerDiv' + i, className: cls.FORMAT_OUTER
        });
        if (i !== undefined) {
            var format = this.newFormat[i];
            var button = createElement('button', {
                id: this.parentID + 'removeButton' + i, className: cls.FORMAT_DELETE_BUTTON,
                attrs: { type: 'button', 'title': this.parent.localeObj.getConstant('delete') }
            });
            outerDiv.appendChild(button);
            var innerDiv = createElement('div', { id: this.parentID + 'innerDiv' + i, className: cls.FORMAT_INNER });
            var valueTable = createElement('table', {
                id: this.parentID + '_valueTable' + i, className: cls.FORMAT_TABLE, attrs: { 'role': 'table' }
            });
            var valueTableRow = createElement('tr');
            var valueTableElements = createElement('td');
            var valuelabel = createElement('span', {
                id: this.parentID + 'valuelabel' + i, className: cls.FORMAT_VALUE_LABEL
            });
            valuelabel.innerText = this.parent.localeObj.getConstant('value');
            valueTableElements.appendChild(valuelabel);
            valueTableRow.appendChild(valueTableElements);
            valueTable.appendChild(valueTableRow);
            valueTableRow = createElement('tr');
            valueTableElements = createElement('td');
            var measureDropdown = createElement('div', { id: this.parentID + 'measure' + i });
            var measureInput = createElement('input', {
                id: this.parentID + 'measureinput' + i,
                attrs: { 'type': 'text', 'tabindex': '0' }
            });
            measureDropdown.appendChild(measureInput);
            valueTableElements.appendChild(measureDropdown);
            valueTableRow.appendChild(valueTableElements);
            valueTableElements = createElement('td');
            var conditionDropdown = createElement('div', { id: this.parentID + 'condition' + i });
            var conditionInput = createElement('input', {
                id: this.parentID + 'conditioninput' + i,
                attrs: { 'type': 'text', 'tabindex': '0' }
            });
            conditionDropdown.appendChild(conditionInput);
            valueTableElements.appendChild(conditionDropdown);
            valueTableRow.appendChild(valueTableElements);
            valueTableElements = createElement('td', {
                attrs: {
                    style: 'display:table'
                },
                className: cls.FORMAT_INPUT_VALUE
            });
            var formatValueClassName = !(format.conditions === 'Between' || format.conditions === 'NotBetween') ?
                cls.HIDDEN : '';
            var conditionValueParentDiv = createElement('div', {
                attrs: {
                    style: 'display: table-row;'
                }
            });
            var conditionValue1WrapperDiv = createElement('div', {
                id: this.parentID + 'ConditionValue1' + i,
                attrs: {
                    style: 'display: table-cell;'
                }
            });
            var value1 = createElement('input', {
                id: this.parentID + 'conditionvalue1' + i,
                attrs: {
                    'type': 'text',
                    'tabindex': '0',
                    'value': !isNaN(format.value1) ? format.value1.toString() : '0',
                    'placeholder': this.parent.localeObj.getConstant('emptyInput')
                }
            });
            conditionValue1WrapperDiv.appendChild(value1);
            conditionValueParentDiv.appendChild(conditionValue1WrapperDiv);
            var valuespan = createElement('span', {
                id: this.parentID + 'valuespan' + i,
                className: cls.FORMAT_VALUE_SPAN + ' ' + formatValueClassName,
                innerHTML: '&'
            });
            conditionValueParentDiv.appendChild(valuespan);
            var conditionValue2WrapperDiv = createElement('div', {
                id: this.parentID + 'ConditionValue2' + i,
                attrs: {
                    style: 'display: table-cell;'
                }
            });
            var value2 = createElement('input', {
                id: this.parentID + 'conditionvalue2' + i,
                attrs: {
                    'type': 'text',
                    'tabindex': '0',
                    'value': !isNaN(format.value2) ? format.value2.toString() : '0',
                    'placeholder': this.parent.localeObj.getConstant('emptyInput')
                }
            });
            conditionValue2WrapperDiv.appendChild(value2);
            conditionValueParentDiv.appendChild(conditionValue2WrapperDiv);
            valueTableElements.appendChild(conditionValueParentDiv);
            valueTableRow.appendChild(valueTableElements);
            valueTable.appendChild(valueTableRow);
            innerDiv.appendChild(valueTable);
            var grandTotalTable = createElement('table', {
                id: this.parentID + '_grandTotalTable' + i, className: cls.FORMAT_TABLE + ' ' + cls.GRANDTOTAL_CHECKBOX_TABLE, attrs: { 'role': 'table' }
            });
            var grandTotalTableRow = createElement('tr');
            var grandTotalTableElements = createElement('td');
            grandTotalTable.appendChild(grandTotalTableRow);
            var checkBoxInput = createElement('input', {
                id: this.parentID + 'grandtotalcheckbox' + i,
                attrs: {
                    'type': 'checkbox', 'tabindex': '0'
                }
            });
            grandTotalTableElements.appendChild(checkBoxInput);
            grandTotalTableRow.appendChild(grandTotalTableElements);
            grandTotalTable.appendChild(grandTotalTableRow);
            innerDiv.appendChild(grandTotalTable);
            var formatTable = createElement('table', {
                id: this.parentID + '_formatTable' + i, className: cls.FORMAT_TABLE, attrs: { 'role': 'table' }
            });
            var formatTableRow = createElement('tr');
            var formatTableElements = createElement('td');
            var formatlabel = createElement('span', {
                id: this.parentID + 'formatlabel' + i, className: cls.FORMAT_LABEL
            });
            formatlabel.innerText = this.parent.localeObj.getConstant('formatLabel');
            formatTableElements.appendChild(formatlabel);
            formatTableRow.appendChild(formatTableElements);
            formatTable.appendChild(formatTableRow);
            formatTableRow = createElement('tr');
            formatTableElements = createElement('td');
            var fontNameDropdown = createElement('div', { id: this.parentID + 'fontname' + i });
            var fontNameInput = createElement('input', {
                id: this.parentID + 'fontnameinput' + i, attrs: { 'type': 'text', 'tabindex': '0' }
            });
            fontNameDropdown.appendChild(fontNameInput);
            formatTableElements.appendChild(fontNameDropdown);
            formatTableRow.appendChild(formatTableElements);
            formatTableElements = createElement('td');
            var fontSizeDropdown = createElement('div', { id: this.parentID + 'fontsize' + i });
            var fontSizeInput = createElement('input', {
                id: this.parentID + 'fontsizeinput' + i, attrs: { 'type': 'text', 'tabindex': '0' }
            });
            fontSizeDropdown.appendChild(fontSizeInput);
            formatTableElements.appendChild(fontSizeDropdown);
            formatTableRow.appendChild(formatTableElements);
            if (this.parent.isAdaptive) {
                formatTable.appendChild(formatTableRow);
                formatTableRow = createElement('tr');
                formatTable.appendChild(formatTableRow);
                formatTableRow = createElement('tr');
            }
            formatTableElements = createElement('td');
            var colorPicker1 = createElement('input', {
                id: this.parentID + 'fontcolor' + i, attrs: { 'type': 'color', 'tabindex': '0' }, className: cls.FORMAT_FONT_COLOR
            });
            formatTableElements.appendChild(colorPicker1);
            var colorPicker2 = createElement('input', {
                id: this.parentID + 'backgroundcolor' + i, attrs: { 'type': 'color', 'tabindex': '0' }, className: cls.FORMAT_BACK_COLOR
            });
            formatTableElements.appendChild(colorPicker2);
            formatTableRow.appendChild(formatTableElements);
            formatTableElements = createElement('td');
            var valuePreview = createElement('input', {
                id: this.parentID + 'valuepreview' + i, className: cls.INPUT + ' ' + cls.FORMAT_VALUE_PREVIEW,
                attrs: {
                    'tabindex': '-1', 'readonly': 'true', 'value': '123.45'
                }
            });
            formatTableElements.appendChild(valuePreview);
            formatTableRow.appendChild(formatTableElements);
            formatTable.appendChild(formatTableRow);
            innerDiv.appendChild(formatTable);
            outerDiv.appendChild(innerDiv);
        }
        return outerDiv;
    };
    ConditionalFormatting.prototype.renderDropDowns = function (i) {
        var dialog = getInstance(select('#' + this.parentID + 'conditionalformatting', document), Dialog);
        var dialogElement = dialog.element;
        var format = this.newFormat[i];
        var fields = [];
        fields.push({
            index: 0, name: this.parent.localeObj.getConstant('AllValues'),
            field: this.parent.localeObj.getConstant('AllValues')
        });
        for (var i_1 = 0; i_1 < this.parent.dataSourceSettings.values.length; i_1++) {
            var caption = this.parent.dataSourceSettings.values[i_1].caption ||
                this.parent.dataSourceSettings.values[i_1].name;
            caption = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(caption) : caption;
            fields.push({
                index: i_1 + 1,
                name: caption,
                field: this.parent.dataSourceSettings.values[i_1].name
            });
        }
        var value = isNaN(format.measure) ? this.parent.localeObj.getConstant('AllValues') : format.measure;
        var fieldsDropDown = [];
        fieldsDropDown[i] = new DropDownList({
            dataSource: fields, fields: { text: 'name', value: 'field' },
            value: value, width: '100%',
            cssClass: this.parent.cssClass,
            popupHeight: '200px', popupWidth: 'auto', locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            change: this.measureChange.bind(this, i)
        });
        fieldsDropDown[i].isStringTemplate = true;
        fieldsDropDown[i].isAngular = this.parent.isModalDialog;
        fieldsDropDown[i].appendTo(select('#' + this.parentID + 'measureinput' + i, dialogElement));
        var conditions = [
            { value: 'LessThan', name: this.parent.localeObj.getConstant('LessThan') },
            { value: 'LessThanOrEqualTo', name: this.parent.localeObj.getConstant('LessThanOrEqualTo') },
            { value: 'GreaterThan', name: this.parent.localeObj.getConstant('GreaterThan') },
            { value: 'GreaterThanOrEqualTo', name: this.parent.localeObj.getConstant('GreaterThanOrEqualTo') },
            { value: 'Equals', name: this.parent.localeObj.getConstant('Equals') },
            { value: 'NotEquals', name: this.parent.localeObj.getConstant('NotEquals') },
            { value: 'Between', name: this.parent.localeObj.getConstant('Between') },
            { value: 'NotBetween', name: this.parent.localeObj.getConstant('NotBetween') }
        ];
        value = isNaN(format.conditions) ? 'LessThan' : format.conditions;
        var conditionsDropDown = [];
        conditionsDropDown[i] = new DropDownList({
            dataSource: conditions, fields: { value: 'value', text: 'name' },
            value: value, width: '100%',
            cssClass: this.parent.cssClass,
            popupHeight: '200px', popupWidth: 'auto', locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            change: this.conditionChange.bind(this, i)
        });
        conditionsDropDown[i].isStringTemplate = true;
        conditionsDropDown[i].isAngular = this.parent.isModalDialog;
        conditionsDropDown[i].appendTo(select('#' + this.parentID + 'conditioninput' + i, dialogElement));
        var formatValueClassName = !(this.newFormat[i].conditions === 'Between' || this.newFormat[i].conditions === 'NotBetween') ?
            cls.HIDDEN : '';
        var conditionValue1 = new TextBox({
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            cssClass: cls.FORMAT_VALUE1 + ' ' + this.parent.cssClass,
            width: 'auto'
        });
        conditionValue1.isStringTemplate = true;
        conditionValue1.appendTo(select('#' + this.parentID + 'conditionvalue1' + i, dialogElement));
        var conditionValue2 = new TextBox({
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            cssClass: cls.FORMAT_VALUE2 + ' ' + formatValueClassName + ' ' + this.parent.cssClass,
            width: 'auto'
        });
        conditionValue2.isStringTemplate = true;
        conditionValue2.appendTo(select('#' + this.parentID + 'conditionvalue2' + i, dialogElement));
        var grandTotalCheckBox = new CheckBox({
            label: this.parent.localeObj.getConstant('applyToGrandTotal'),
            checked: this.newFormat[i].applyGrandTotals,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            change: this.onCheckChange.bind(this, i),
            cssClass: this.parent.cssClass
        });
        grandTotalCheckBox.isStringTemplate = true;
        grandTotalCheckBox.appendTo(select('#' + this.parentID + 'grandtotalcheckbox' + i, dialogElement));
        var fontNames = [
            { index: 0, name: 'Arial' }, { index: 1, name: 'San Serif' }, { index: 2, name: 'Impact' },
            { index: 3, name: 'Trebuchet MS' }, { index: 4, name: 'Serif' }, { index: 5, name: 'Verdana' },
            { index: 6, name: 'Courier New' }, { index: 7, name: 'Times New Roman' }, { index: 8, name: 'Tahoma' },
            { index: 9, name: 'Gerogia' }
        ];
        value = isNaN(format.style.fontFamily) ? 'Arial' : format.style.fontFamily;
        var fontNameDropDown = [];
        fontNameDropDown[i] = new DropDownList({
            dataSource: fontNames, fields: { text: 'name' },
            value: value, width: '100%',
            cssClass: this.parent.cssClass,
            popupHeight: '200px', popupWidth: 'auto', locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            change: this.fontNameChange.bind(this, i)
        });
        fontNameDropDown[i].isStringTemplate = true;
        fontNameDropDown[i].isAngular = this.parent.isModalDialog;
        fontNameDropDown[i].appendTo(select('#' + this.parentID + 'fontnameinput' + i, dialogElement));
        var fontSize = [
            { index: 0, name: '9px' }, { index: 1, name: '10px' }, { index: 2, name: '11px' }, { index: 3, name: '12px' },
            { index: 4, name: '13px' }, { index: 5, name: '14px' }, { index: 6, name: '15px' }, { index: 6, name: '16px' }
        ];
        value = isNaN(format.style.fontSize) ? '12px' : format.style.fontSize;
        var fontSizeDropDown = [];
        fontSizeDropDown[i] = new DropDownList({
            dataSource: fontSize, fields: { text: 'name' }, popupHeight: '200px', popupWidth: 'auto',
            value: value, width: '100%',
            change: this.fontSizeChange.bind(this, i),
            locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            cssClass: this.parent.cssClass
        });
        fontSizeDropDown[i].isStringTemplate = true;
        fontSizeDropDown[i].isAngular = this.parent.isModalDialog;
        fontSizeDropDown[i].appendTo(select('#' + this.parentID + 'fontsizeinput' + i, dialogElement));
    };
    ConditionalFormatting.prototype.conditionChange = function (i, args) {
        this.newFormat[i].conditions = args.value;
        var valuespan = select('#' + this.parentID + 'valuespan' + i, document);
        var conditionvalue2 = select('#' + this.parentID + 'conditionvalue2' + i, document);
        if (args.value === 'Between' || args.value === 'NotBetween') {
            valuespan.classList.remove(cls.HIDDEN);
            conditionvalue2.parentElement.classList.remove(cls.HIDDEN);
        }
        else {
            valuespan.classList.add(cls.HIDDEN);
            conditionvalue2.parentElement.classList.add(cls.HIDDEN);
        }
    };
    ConditionalFormatting.prototype.onCheckChange = function (i, args) {
        this.newFormat[i].applyGrandTotals = args.checked;
    };
    ConditionalFormatting.prototype.fontNameChange = function (i, args) {
        this.newFormat[i].style.fontFamily = args.value.toString();
        select('#' + this.parentID + 'valuepreview' + i, document).style.fontFamily = args.value;
    };
    ConditionalFormatting.prototype.fontSizeChange = function (i, args) {
        this.newFormat[i].style.fontSize = args.value.toString();
        select('#' + this.parentID + 'valuepreview' + i, document).style.fontSize = args.value;
    };
    ConditionalFormatting.prototype.measureChange = function (i, args) {
        this.newFormat[i].measure = args.value.toString() === this.parent.localeObj.getConstant('AllValues') ?
            undefined : args.value.toString();
    };
    ConditionalFormatting.prototype.renderColorPicker = function (i) {
        var dialog = getInstance(select('#' + this.parentID + 'conditionalformatting', document), Dialog);
        var dialogElement = dialog.element;
        var format = this.newFormat[i];
        var value = isNaN(format.style.color) ? 'black' : format.style.color;
        var color = value.charAt(0) === '#' && this.isHex(value.substr(1)) ? value : this.colourNameToHex(value);
        select('#' + this.parentID + 'valuepreview' + i, document).style.color = color;
        this.fontColor[i] = new ColorPicker({
            cssClass: cls.FORMAT_COLOR_PICKER + ' ' + cls.FORMAT_FONT_COLOR_PICKER +
                (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), value: color, mode: 'Palette',
            change: this.fontColorChange.bind(this, i), locale: this.parent.locale, enableRtl: this.parent.enableRtl
        });
        this.fontColor[i].isStringTemplate = true;
        this.fontColor[i].isAngular = this.parent.isModalDialog;
        this.fontColor[i].appendTo(select('#' + this.parentID + 'fontcolor' + i, dialogElement));
        addClass([this.fontColor[i].element.nextElementSibling.querySelector('.' + cls.SELECTED_COLOR)], cls.ICON);
        value = isNaN(format.style.backgroundColor) ? 'white' : format.style.backgroundColor;
        color = value.charAt(0) === '#' && this.isHex(value.substr(1)) ? value : this.colourNameToHex(value);
        select('#' + this.parentID + 'valuepreview' + i, document).style.backgroundColor = color;
        select('#' + this.parentID + 'valuepreview' + i, document).style.fontFamily = format.style.fontFamily;
        select('#' + this.parentID + 'valuepreview' + i, document).style.fontSize = format.style.fontSize;
        this.backgroundColor[i] = new ColorPicker({
            cssClass: cls.FORMAT_COLOR_PICKER + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), value: color, mode: 'Palette',
            change: this.backColorChange.bind(this, i),
            locale: this.parent.locale, enableRtl: this.parent.enableRtl
        });
        this.backgroundColor[i].isStringTemplate = true;
        this.backgroundColor[i].isAngular = this.parent.isModalDialog;
        this.backgroundColor[i].appendTo(select('#' + this.parentID + 'backgroundcolor' + i, dialogElement));
        addClass([this.backgroundColor[i].element.nextElementSibling.querySelector('.e-selected-color')], cls.ICON);
        var toggleBtn = new Button({
            iconCss: cls.ICON + ' ' + cls.FORMAT_DELETE_ICON,
            cssClass: cls.FLAT + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), locale: this.parent.locale, enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer
        });
        toggleBtn.isStringTemplate = true;
        toggleBtn.appendTo(select('#' + this.parentID + 'removeButton' + i, dialogElement));
        toggleBtn.element.onclick = this.toggleButtonClick.bind(this, i);
    };
    ConditionalFormatting.prototype.backColorChange = function (i, args) {
        this.newFormat[i].style.backgroundColor = args.currentValue.hex;
        select('#' + this.parentID + 'valuepreview' + i, document).style.backgroundColor =
            args.currentValue.hex;
    };
    ConditionalFormatting.prototype.fontColorChange = function (i, args) {
        this.newFormat[i].style.color = args.currentValue.hex;
        select('#' + this.parentID + 'valuepreview' + i, document).style.color =
            args.currentValue.hex;
    };
    ConditionalFormatting.prototype.toggleButtonClick = function (i) {
        this.destroyColorPickers();
        this.newFormat.splice(i, 1);
        this.addFormat();
    };
    /**
     * To check is Hex or not.
     *
     * @param {string} h - It represent the hex value.
     * @returns {boolean} - It returns the isHex value as boolean.
     * @hidden
     */
    ConditionalFormatting.prototype.isHex = function (h) {
        var a = parseInt(h, 16);
        while (h.charAt(0) === '0') {
            h = h.substr(1);
        }
        return (a.toString(16) === h.toLowerCase() || (a === 0 && h === ''));
    };
    /**
     * To convert hex to RGB.
     *
     * @param {string} hex - hex value.
     * @returns { { r: number, g: number, b: number } | null } - Hex value.
     * @hidden
     */
    ConditionalFormatting.prototype.hexToRgb = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    /**
     * To convert color to hex.
     *
     * @param {string} colour - It contains the color value.
     * @returns {string} - It returns the colour Name To Hex.
     * @hidden
     */
    ConditionalFormatting.prototype.colourNameToHex = function (colour) {
        var colours = {
            'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4',
            'azure': '#f0ffff', 'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000',
            'blanchedalmond': '#ffebcd', 'blue': '#0000ff',
            'blueviolet': '#8a2be2', 'brown': '#a52a2a', 'burlywood': '#deb887', 'cadetblue': '#5f9ea0',
            'chartreuse': '#7fff00', 'chocolate': '#d2691e',
            'coral': '#ff7f50', 'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c', 'cyan': '#00ffff',
            'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 'darkgray': '#a9a9a9', 'darkgreen': '#006400',
            'darkkhaki': '#bdb76b', 'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f',
            'darkorange': '#ff8c00', 'darkorchid': '#9932cc', 'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkseagreen': '#8fbc8f',
            'darkslateblue': '#483d8b', 'darkslategray': '#2f4f4f', 'darkturquoise': '#00ced1',
            'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969', 'dodgerblue': '#1e90ff',
            'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22', 'fuchsia': '#ff00ff',
            'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff', 'gold': '#ffd700', 'goldenrod': '#daa520',
            'gray': '#808080', 'green': '#008000',
            'greenyellow': '#adff2f', 'honeydew': '#f0fff0', 'hotpink': '#ff69b4', 'indianred ': '#cd5c5c',
            'indigo': '#4b0082', 'ivory': '#fffff0',
            'khaki': '#f0e68c', 'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd',
            'lightblue': '#add8e6', 'lightcoral': '#f08080', 'lightcyan': '#e0ffff', 'lightgoldenrodyellow': '#fafad2',
            'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa',
            'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightsteelblue': '#b0c4de',
            'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 'linen': '#faf0e6',
            'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd', 'mediumorchid': '#ba55d3',
            'mediumpurple': '#9370d8', 'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee',
            'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585', 'midnightblue': '#191970',
            'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5', 'navajowhite': '#ffdead', 'navy': '#000080',
            'oldlace': '#fdf5e6', 'olive': '#808000', 'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500',
            'orchid': '#da70d6',
            'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee', 'palevioletred': '#d87093',
            'papayawhip': '#ffefd5',
            'peachpuff': '#ffdab9', 'peru': '#cd853f', 'pink': '#ffc0cb', 'plum': '#dda0dd', 'powderblue': '#b0e0e6', 'purple': '#800080',
            'rebeccapurple': '#663399', 'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1',
            'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57',
            'seashell': '#fff5ee', 'sienna': '#a0522d',
            'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd', 'slategray': '#708090', 'snow': '#fffafa',
            'springgreen': '#00ff7f',
            'steelblue': '#4682b4', 'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0',
            'violet': '#ee82ee', 'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5', 'yellow': '#ffff00',
            'yellowgreen': '#9acd32'
        };
        if (typeof colours[colour.toLowerCase()] !== 'undefined') {
            return colours[colour.toLowerCase()];
        }
        else if (colour.search('rgba') === 0) {
            var value = colour.substr(5).split(')')[0].split(',');
            var rgb = '';
            var a = '';
            for (var i = 0; i < value.length - 1; i++) {
                value[i] = (+value[i]).toString(16);
                if (value[i].length === 1) {
                    value[i] = '0' + value[i];
                }
                rgb = rgb + value[i];
            }
            a = (Math.round(+value[3] * 255)).toString(16);
            return '#' + rgb + a;
        }
        else if (colour.search('rgb') === 0) {
            var value = colour.substr(4).split(')')[0].split(',');
            var rgb = '';
            for (var i = 0; i < value.length; i++) {
                value[i] = (+value[i]).toString(16);
                if (value[i].length === 1) {
                    value[i] = '0' + value[i];
                }
                rgb = rgb + value[i];
            }
            return '#' + rgb;
        }
        return '#d5d5d5';
    };
    ConditionalFormatting.prototype.removeDialog = function () {
        var element = select('#' + this.parentID + 'conditionalformatting', document);
        var dialog = element ? getInstance(element, Dialog) : null;
        if (dialog && !dialog.isDestroyed) {
            this.destroyColorPickers();
            this.removeEventListeners();
            dialog.destroy();
        }
        if (element) {
            remove(element);
        }
        this.fontColor = [];
        this.backgroundColor = [];
        this.newFormat = [];
    };
    ConditionalFormatting.prototype.removeEventListeners = function () {
        for (var i = 0; i < (this.newFormat ? this.newFormat.length : 0); i++) {
            var removeButton = select('#' + this.parentID + 'removeButton' + i, document);
            if (removeButton) {
                removeButton.onclick = null;
            }
        }
    };
    ConditionalFormatting.prototype.destroyColorPickers = function () {
        for (var i = 0; i < (this.newFormat ? this.newFormat.length : 0); i++) {
            if (this.fontColor && this.fontColor[i] && !this.fontColor[i].isDestroyed) {
                this.fontColor[i].destroy();
            }
            if (this.backgroundColor && this.backgroundColor[i] && !this.backgroundColor[i].isDestroyed) {
                this.backgroundColor[i].destroy();
            }
            this.destroyDropDowns(i);
            this.destroyOtherComponents(i);
        }
    };
    ConditionalFormatting.prototype.destroyDropDowns = function (i) {
        var dialogElement = select('#' + this.parentID + 'conditionalformatting', document);
        if (!dialogElement) {
            return;
        }
        var measureDropdown = select('#' + this.parentID + 'measureinput' + i, dialogElement);
        if (measureDropdown) {
            var measureInstance = getInstance(measureDropdown, DropDownList);
            if (measureInstance && !measureInstance.isDestroyed) {
                measureInstance.destroy();
            }
        }
        var conditionDropdown = select('#' + this.parentID + 'conditioninput' + i, dialogElement);
        if (conditionDropdown) {
            var conditionInstance = getInstance(conditionDropdown, DropDownList);
            if (conditionInstance && !conditionInstance.isDestroyed) {
                conditionInstance.destroy();
            }
        }
        var fontNameDropdown = select('#' + this.parentID + 'fontnameinput' + i, dialogElement);
        if (fontNameDropdown) {
            var fontNameInstance = getInstance(fontNameDropdown, DropDownList);
            if (fontNameInstance && !fontNameInstance.isDestroyed) {
                fontNameInstance.destroy();
            }
        }
        var fontSizeDropdown = select('#' + this.parentID + 'fontsizeinput' + i, dialogElement);
        if (fontSizeDropdown) {
            var fontSizeInstance = getInstance(fontSizeDropdown, DropDownList);
            if (fontSizeInstance && !fontSizeInstance.isDestroyed) {
                fontSizeInstance.destroy();
            }
        }
    };
    ConditionalFormatting.prototype.destroyOtherComponents = function (i) {
        var dialogElement = select('#' + this.parentID + 'conditionalformatting', document);
        if (!dialogElement) {
            return;
        }
        var conditionValue1 = select('#' + this.parentID + 'conditionvalue1' + i, dialogElement);
        if (conditionValue1) {
            var value1Instance = getInstance(conditionValue1, TextBox);
            if (value1Instance && !value1Instance.isDestroyed) {
                value1Instance.destroy();
            }
        }
        var conditionValue2 = select('#' + this.parentID + 'conditionvalue2' + i, dialogElement);
        if (conditionValue2) {
            var value2Instance = getInstance(conditionValue2, TextBox);
            if (value2Instance && !value2Instance.isDestroyed) {
                value2Instance.destroy();
            }
        }
        var grandTotalCheckbox = select('#' + this.parentID + 'grandtotalcheckbox' + i, dialogElement);
        if (grandTotalCheckbox) {
            var checkboxInstance = getInstance(grandTotalCheckbox, CheckBox);
            if (checkboxInstance && !checkboxInstance.isDestroyed) {
                checkboxInstance.destroy();
            }
        }
        var removeButton = select('#' + this.parentID + 'removeButton' + i, dialogElement);
        if (removeButton) {
            var buttonInstance = getInstance(removeButton, Button);
            if (buttonInstance && !buttonInstance.isDestroyed) {
                buttonInstance.destroy();
            }
        }
    };
    /**
     * To create Conditional Formatting dialog.
     *
     * @returns {void}
     * @hidden
     */
    ConditionalFormatting.prototype.showConditionalFormattingDialog = function () {
        this.newFormat = [];
        for (var i = 0; i < this.parent.dataSourceSettings.conditionalFormatSettings.length; i++) {
            this.newFormat.push(extend({}, this.parent.dataSourceSettings.conditionalFormatSettings[i].properties, null, true));
        }
        this.createDialog();
        getInstance(select('#' + this.parentID + 'conditionalformatting', document), Dialog).refresh();
        this.addFormat();
    };
    /**
     * To destroy the Conditional Formatting dialog
     *
     * @returns {void}
     * @hidden
     */
    ConditionalFormatting.prototype.destroy = function () {
        var element = select('#' + this.parentID + 'conditionalformatting', document);
        var dialog = element ? getInstance(element, Dialog) : null;
        if (dialog && !dialog.isDestroyed) {
            dialog.close();
        }
        else {
            return;
        }
    };
    return ConditionalFormatting;
}());
export { ConditionalFormatting };
