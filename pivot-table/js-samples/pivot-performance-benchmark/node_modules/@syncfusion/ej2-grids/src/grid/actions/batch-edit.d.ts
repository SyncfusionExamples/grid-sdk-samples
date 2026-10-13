import { FormValidator } from '@syncfusion/ej2-inputs';
import { IGrid, EditEventArgs } from '../base/interface';
import { CellFocusArgs, IUndoRedoAction } from '../base/interface';
import { EditRender } from '../renderer/edit-renderer';
import { Row } from '../models/row';
import { ServiceLocator } from '../services/service-locator';
import { Column } from '../models/column';
/**
 * `BatchEdit` module is used to handle batch editing actions.
 *
 * @hidden
 */
export declare class BatchEdit {
    protected parent: IGrid;
    private serviceLocator;
    protected form: Element;
    formObj: FormValidator;
    protected renderer: EditRender;
    private focus;
    private dataBoundFunction;
    private batchCancelFunction;
    private removeSelectedData;
    protected cellDetails: {
        rowData?: Object;
        field?: string;
        value?: string;
        isForeignKey?: boolean;
        column?: Column;
        rowIndex?: number;
        cellIndex?: number;
        foreignKeyData?: Object;
    };
    private isColored;
    protected args: EditEventArgs;
    private isAdded;
    private originalCell;
    private cloneCell;
    protected editNext: boolean;
    protected preventSaveCell: boolean;
    protected index: number;
    protected crtRowIndex: number;
    protected field: string;
    private initialRender;
    private validationColObj;
    private isAdd;
    protected newReactTd: Element;
    protected evtHandlers: {
        event: string;
        handler: Function;
    }[];
    /** @hidden */
    addBatchRow: boolean;
    protected prevEditedBatchCell: boolean;
    private mouseDownElement;
    undoStack: IUndoRedoAction[];
    redoStack: IUndoRedoAction[];
    private storedRowUids;
    private isUndoAction;
    private isRedoAction;
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, renderer?: EditRender);
    /**
     * @returns {void}
     * @hidden
     */
    addEventListener(): void;
    /**
     * @returns {void}
     * @hidden
     */
    removeEventListener(): void;
    private batchCancel;
    private dataBound;
    /**
     * @returns {void}
     * @hidden
     */
    destroy(): void;
    /**
     * Pushes an action to the specified stack with size management.
     *
     * @param {IUndoRedoAction[]} stack - The stack to push to (undo or redo)
     * @param {IUndoRedoAction} action - The action to push
     * @returns {void}
     */
    pushToStack(stack: IUndoRedoAction[], action: IUndoRedoAction): void;
    /**
     * Clears both undo and redo stacks.
     *
     * @returns {void}
     * @hidden
     */
    clearStacks(): void;
    private restoreCellSelection;
    private storeDeleteAction;
    /**
     * Stores the action in the undo stack after the cell is saved.
     *
     * @param {CellSaveArgs} args - The cell save arguments
     * @returns {void}
     */
    private storeCellsInUndoStack;
    /**
     * Undo the last batch edit action and restore the grid to its previous state.
     *
     * @returns {void}
     * @hidden
     */
    undoBatchEdit(): void;
    /**
     * Redo the last undone batch edit action and reapply the changes to the grid.
     *
     * @returns {void}
     * @hidden
     */
    redoBatchEdit(): void;
    /**
     * Cleans up a restored cell if value matches original.
     *
     * @param {string} rowUid - specfies the rowUid
     * @param {string} field - specfies the column field
     * @param {string | number | boolean | Date } previousValue - specfies the pervious value
     * @returns {void}
     */
    private restoreCellState;
    /**
     * Handles undo and redo for the autofill operation.
     *
     * @param {IAutoFill} autoFillAction - autofill action from undo/redo stack
     * @returns {void}
     */
    private autoFill;
    /**
     * Restores an action to its previous state.
     *
     * @param {IUndoRedoAction} action - The action to revert
     * @returns {void}
     */
    private undoAction;
    /**
     * Reapplies a previously undone action.
     *
     * @param {IUndoRedoAction} action - The action to reapply
     * @returns {void}
     * @private
     */
    private redoAction;
    /**
     * Defines whether an undo action is available.
     *
     * @returns {boolean} - True if undo stack has actions
     * @hidden
     */
    isUndoStackAvailable(): boolean;
    /**
     * Defines whether an redo action is available.
     *
     * @returns {boolean} - True if redo stack has actions
     * @hidden
     */
    isRedoStackAvailable(): boolean;
    protected mouseDownHandler(e: MouseEvent): void;
    protected clickHandler(e: MouseEvent): void;
    protected dblClickHandler(e: MouseEvent): void;
    private onBeforeCellFocused;
    onCellFocused(e: CellFocusArgs): void;
    private isAddRow;
    private editCellFromIndex;
    closeEdit(): void;
    protected removeBatchElementChanges(row: Row<Column>, isDirty: boolean): boolean;
    /**
     * Restores rows after batch cancel with frozen rows.
     * @returns {void}
     * @hidden
     */
    private restoreFrozenRow;
    deleteRecord(fieldname?: string, data?: Object): void;
    addRecord(data?: Object): void;
    private restoreDeletedRows;
    endEdit(): void;
    protected validateFormObj(): boolean;
    batchSave(): void;
    getBatchChanges(): Object;
    /**
     * @param {string} uid - specifes the uid
     * @returns {void}
     * @hidden
     */
    removeRowObjectFromUID(uid: string): void;
    /**
     * @param {Row<Column>} row - specifies the row object
     * @returns {void}
     * @hidden
     */
    addRowObject(row: Row<Column>): void;
    private bulkDelete;
    refreshRowIdx(): void;
    private bulkAddRow;
    private findNextEditableCell;
    private getDefaultData;
    private setCellIdx;
    editCell(index: number, field: string, isAdd?: boolean): void;
    editCellExtend(index: number, field: string, isAdd?: boolean): void;
    updateCell(rowIndex: number, field: string, value: string | number | boolean | Date): void;
    private setChanges;
    updateRow(index: number, data: Object): void;
    getCellIdx(uid: string): number;
    protected refreshTD(td: Element, column: Column, rowObj: Row<Column>, value: string | number | boolean | Date): void;
    protected getColIndex(cells: Element[], index: number): number;
    private editNextValCell;
    escapeCellEdit(): void;
    protected generateCellArgs(): Object;
    saveCell(isForceSave?: boolean): void;
    private successCallBack;
    private prevEditedBatchCellMatrix;
    protected getDataByIndex(index: number): Object;
    private keyDownHandler;
    /**
     * @returns {void}
     * @hidden
     */
    addCancelWhilePaging(): void;
    private getBottomIndex;
}
