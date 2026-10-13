import { PivotView } from '../../pivotview/base/pivotview';
import { IAction } from '../../common/base/interface';
import { Toolbar } from '@syncfusion/ej2-navigations';
/**
 * Module for GroupingBar rendering
 */
/** @hidden */
export declare class GroupingBar implements IAction {
    /**
     * Internal variables
     */
    /** @hidden */
    gridPanel: Toolbar;
    /** @hidden */
    chartPanel: Toolbar;
    private groupingTable;
    private groupingChartTable;
    private rightAxisPanel;
    /** @hidden */
    rowPanel: HTMLElement;
    private rowAxisPanel;
    private touchObj;
    private resColWidth;
    private timeOutObj;
    private rowAxisWidth;
    private isDestroyed;
    /**
     * Module declarations
     */
    private parent;
    /** Constructor for GroupingBar module
     *
     * @param {PivotView} parent - Instance.
     */
    constructor(parent: PivotView);
    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - Module name.
     * @private
     */
    protected getModuleName(): string;
    /**
     * @hidden
     * @returns {void}
     */
    renderLayout(): void;
    /**
     * Appends the grouping table or chart table element to the DOM based on the display option and layout settings.
     *
     * @returns {void}
     * @hidden
     */
    appendToElement(): void;
    private updateChartAxisHeight;
    /**
     * @hidden
     * @returns {void}
     */
    refreshUI(): void;
    /**
     *
     * @returns {void}
     * @hidden
     */
    alignIcon(): void;
    /**
     *
     * @returns {void}
     * @hidden
     */
    setGridRowWidth(): void;
    private wireEvent;
    private unWireEvent;
    private dropIndicatorUpdate;
    private tapHoldHandler;
    /**
     *
     * @returns {void}
     * @hidden
     */
    RefreshFieldsPanel(): void;
    private createToolbarUI;
    /**
     *
     * @returns {void}
     * @hidden
     */
    addEventListener(): void;
    /**
     *
     * @returns {void}
     * @hidden
     */
    removeEventListener(): void;
    /**
     * To destroy the groupingbar
     *
     * @returns {void}
     * @hidden
     */
    destroy(): void;
    /**
     * Remove all event listeners from a DOM element and its children recursively
     *
     * @param {HTMLElement} element - The element to clean up
     * @returns {void}
     * @private
     */
    private removeAllEventListeners;
    private setTabularWidth;
}
