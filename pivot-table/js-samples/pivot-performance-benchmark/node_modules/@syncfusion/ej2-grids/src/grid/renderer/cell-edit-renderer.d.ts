import { IGrid } from '../base/interface';
import { Column } from '../models/column';
import { ServiceLocator } from '../services/service-locator';
/**
 * Cell Edit Renderer
 *
 * @hidden
 */
export declare class CellEditRenderer {
    protected parent: IGrid;
    protected serviceLocator: ServiceLocator;
    private renderer;
    /**
     * Constructor for CellEditRenderer
     *
     * @param {IGrid} parent - returns the IGrid
     */
    constructor(parent?: IGrid);
    update(elements: Element[], args: {
        columnObject?: Column;
        cell?: Element;
        row?: Element;
    }): void;
    private getEditElement;
    addNew(elements: Object, args: {
        row?: Element;
        rowData?: Object;
        isScroll?: boolean;
    }): void;
}
