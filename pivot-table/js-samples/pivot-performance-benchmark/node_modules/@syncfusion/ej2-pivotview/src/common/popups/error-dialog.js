import { createElement, remove } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { PivotUtil } from '../../base/util';
/**
 * `ErrorDialog` module to create error dialog.
 */
/** @hidden */
var ErrorDialog = /** @class */ (function () {
    /**
     * Constructor for the dialog action.
     *
     * @param {PivotCommon} parent - parent.
     * @hidden
     */
    function ErrorDialog(parent) {
        this.parent = parent;
    }
    /**
     * Creates the error dialog for the unexpected action done.
     *
     * @function createErrorDialog
     * @param {string} title - title.
     * @param {string} description - description.
     * @returns {void}
     * @hidden
     */
    ErrorDialog.prototype.createErrorDialog = function (title, description) {
        var errorDialog = createElement('div', {
            id: this.parent.parentID + '_ErrorDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        this.errorPopUp = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            header: title,
            content: description,
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.closeErrorDialog.bind(this),
                    isFlat: false,
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''), content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                }
            ],
            cssClass: this.parent.cssClass,
            closeOnEscape: true,
            target: PivotUtil.getAppendToElement(this.parent.control.element, this.parent.control.isAngular),
            close: this.removeErrorDialog.bind(this)
        });
        this.errorPopUp.isStringTemplate = true;
        this.errorPopUp.isAngular = this.parent.control.isModalDialog;
        this.errorPopUp.appendTo(errorDialog);
    };
    ErrorDialog.prototype.closeErrorDialog = function () {
        this.errorPopUp.close();
    };
    /** @hidden */
    ErrorDialog.prototype.removeErrorDialog = function () {
        if (this.errorPopUp && !this.errorPopUp.isDestroyed) {
            this.errorPopUp.destroy();
            this.errorPopUp = null;
        }
        if (document.getElementById(this.parent.parentID + '_ErrorDialog')) {
            remove(document.getElementById(this.parent.parentID + '_ErrorDialog'));
        }
    };
    return ErrorDialog;
}());
export { ErrorDialog };
