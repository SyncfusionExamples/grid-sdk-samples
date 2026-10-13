import { PivotView } from '../base/pivotview';
import { Pager as GridPager } from '@syncfusion/ej2-grids';
/**
 * Module for Pager rendering
 */
/** @hidden */
export declare class Pager {
    /** @hidden */
    pager: GridPager;
    /** @hidden */
    parent: PivotView;
    private uiComponents;
    constructor(parent: PivotView);
    /**
     * It returns the Module name.
     *
     * @returns {string} - string
     * @hidden
     */
    getModuleName(): string;
    /**
     *
     * @hidden
     *
     */
    addEventListener(): void;
    /**
     *
     * @hidden
     */
    removeEventListener(): void;
    /**
     * Track UI component for later cleanup
     *
     * @param {string} type Component type
     * @param {DropDownList | NumericTextBox} instance Component instance
     * @returns {void}
     */
    private trackUIComponent;
    private createPager;
    private setPagerWidthClasses;
    private onPagerIconKeyDown;
    private wireEvent;
    private unWireEvent;
    private columnPageChange;
    private rowPageChange;
    private columnPageSizeChange;
    private rowPageSizeChange;
    private updatePageSettings;
    private createPagerContainer;
    private createPagerItems;
    /**
     * Clean up all UI components
     *
     * @returns {void}
     * @private
     */
    private cleanupUIComponents;
    /**
     * To destroy the pager.
     *
     * @returns {void}
     * @hidden
     */
    destroy(): void;
}
