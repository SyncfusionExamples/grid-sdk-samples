import { classList } from '@syncfusion/ej2-base';
import * as literals from '../base/string-literals';
import { InlineEditRender } from './inline-edit-renderer';
/**
 * Cell Edit Renderer
 *
 * @hidden
 */
var CellEditRenderer = /** @class */ (function () {
    /**
     * Constructor for CellEditRenderer
     *
     * @param {IGrid} parent - returns the IGrid
     */
    function CellEditRenderer(parent) {
        this.parent = parent;
        this.renderer = new InlineEditRender(parent);
    }
    CellEditRenderer.prototype.update = function (elements, args) {
        if (this.parent.isReact && args.columnObject && args.columnObject.template) {
            var parentRow = args.cell.parentElement;
            var newTd = args.cell.cloneNode(true);
            parentRow.insertBefore(newTd, args.cell);
            newTd.focus();
            args.cell.remove();
            args.cell = newTd;
        }
        args.cell.setAttribute('aria-label', args.cell.innerHTML + this.parent.localeObj.getConstant('ColumnHeader') + args.columnObject.field);
        args.cell.innerHTML = '';
        args.cell.appendChild(this.getEditElement(elements, args));
        args.cell.classList.add('e-editedcell');
        classList(args.row, [literals.editedRow], []);
    };
    CellEditRenderer.prototype.getEditElement = function (elements, args) {
        var gObj = this.parent;
        var form = this.parent
            .createElement('form', { id: gObj.element.id + 'EditForm', className: 'e-gridform' });
        form.appendChild(elements[args.columnObject.uid]);
        if (args.columnObject.editType === 'booleanedit') {
            args.cell.classList.add('e-boolcell');
        }
        if (!args.columnObject.editType) {
            args.cell.classList.add('e-inputbox');
        }
        return form;
    };
    CellEditRenderer.prototype.addNew = function (elements, args) {
        this.renderer.addNew(elements, args);
    };
    return CellEditRenderer;
}());
export { CellEditRenderer };
