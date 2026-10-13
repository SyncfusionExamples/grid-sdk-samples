import { MouseEventArgs } from '@syncfusion/ej2-base';
import { PivotView } from '../../pivotview/base/pivotview';
import { PivotFieldList } from '../../pivotfieldlist/base/field-list';
import { AggregateTypes } from '../base/enum';
/**
 * `AggregateMenu` module to create aggregate type popup.
 */
/** @hidden */
export declare class AggregateMenu {
    /** @hidden */
    parent: PivotView | PivotFieldList;
    /** @hidden */
    stringAggregateTypes: AggregateTypes[];
    private menuInfo;
    private parentElement;
    private buttonElement;
    private currentMenu;
    /**
     * Constructor for the rener action.
     *
     * @param {PivotView | PivotFieldList} parent - It contains the value of parent.
     * @hidden
     */
    constructor(parent?: PivotView | PivotFieldList);
    /**
     * Initialize the pivot table rendering
     *
     * @param {MouseEventArgs} args - It contains the args value
     * @param {HTMLElement} parentElement - It contains the value of parentElement
     * @returns {void}
     * @private
     */
    render(args: MouseEventArgs, parentElement: HTMLElement): void;
    private openContextMenu;
    private createContextMenu;
    private getMenuItem;
    private beforeMenuOpen;
    /**
     * create Value Settings Dialog
     *
     * @param {HTMLElement} target - It represent the target element.
     * @param {HTMLElement} parentElement - It represent the parentElement.
     * @param {string} type -It represent the type.
     * @returns {void}
     * @hidden */
    createValueSettingsDialog(target: HTMLElement, parentElement: HTMLElement, type?: string): void;
    private createFieldOptions;
    private selectOptionInContextMenu;
    private updateDataSource;
    private updateValueSettings;
    private removeDialog;
    /**
     * To destroy the pivot button event listener
     *
     * @returns {void}
     * @hidden
     */
    destroy(): void;
    /**
     * Cleans up all menu instances
     *
     * @private
     * @returns {void}
     */
    private cleanupMenuInstances;
    /**
     * Cleans up any open dialogs
     *
     * @private
     * @returns {void}
     */
    private cleanupDialogs;
    /**
     * Cleans up components inside a dialog
     *
     * @private
     * @param {HTMLElement} dialogElement - The dialog element
     * @returns {void}
     */
    private cleanupDialogComponents;
    /**
     * Cleans up DOM elements created by this class
     *
     * @private
     * @returns {void}
     */
    private cleanupDOMElements;
    /**
     * Sets the aggregate action info for the action object
     *
     * @private
     * @param {SummaryTypes} aggregateType - The aggregate type
     * @param {string} fieldName - The field name
     * @param {string} fieldCaption - The field caption
     * @param {string} baseField - The base field (optional)
     * @param {string} baseItem - The base item (optional)
     * @returns {void}
     */
    private setAggregateActionInfo;
}
