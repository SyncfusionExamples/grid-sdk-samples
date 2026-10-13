import { PivotFieldList } from '../base/field-list';
/**
 * Module to render Axis Field Table
 */
/** @hidden */
export declare class AxisTableRenderer {
    /** @hidden */
    parent: PivotFieldList;
    /** @hidden */
    axisTable: Element;
    private leftAxisPanel;
    private rightAxisPanel;
    private droppableInstances;
    /** Constructor for render module */
    constructor(parent: PivotFieldList);
    /**
     * Initialize the axis table rendering
     *
     * @returns {void}
     * @private
     */
    render(): void;
    private renderAxisTable;
    private getIconupdate;
    private wireEvent;
    private unWireEvent;
    private updateDropIndicator;
    /**
     * Destroys the AxisTableRenderer instance
     *
     * @returns {void}
     * @hidden
     */
    destroy(): void;
}
