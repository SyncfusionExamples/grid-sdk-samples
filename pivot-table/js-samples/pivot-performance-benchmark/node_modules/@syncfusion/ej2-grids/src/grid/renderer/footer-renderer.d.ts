import { IRenderer, IGrid } from '../base/interface';
import { ContentRender } from './content-renderer';
import { ServiceLocator } from '../services/service-locator';
import { SummaryModelGenerator } from '../services/summary-model-generator';
/**
 * Footer module is used to render grid content
 *
 * @hidden
 */
export declare class FooterRenderer extends ContentRender implements IRenderer {
    private locator;
    protected modelGenerator: SummaryModelGenerator;
    /** @hidden */
    aggregates: Object;
    /** @hidden */
    evtHandlers: {
        event: string;
        handler: Function;
    }[];
    constructor(gridModule?: IGrid, serviceLocator?: ServiceLocator);
    /**
     * The function is used to render grid footer div
     *
     * @returns {void}
     */
    renderPanel(): void;
    /**
     * The function is used to render grid footer table
     *
     * @returns {void}
     */
    renderTable(): void;
    private renderSummaryContent;
    refresh(e?: {
        aggregates?: Object;
    }): void;
    refreshCol(): void;
    /**
     * Handles column width changes and updates footer table width when resizing.
     *
     * @param {Object} args - Width change arguments
     * @param {number} args.index - Column index
     * @param {number} args.width - New width of the column
     * @param {string} args.module - Action source module (e.g., resize)
     * @returns {void}
     * @hidden
     */
    onWidthChange(args: {
        index: number;
        width: number;
        module: string;
    }): void;
    private onScroll;
    getColFromIndex(index?: number): HTMLElement;
    /**
     * Handles column visibility changes and refreshes the footer summary.
     *
     * @returns {void}
     * @hidden
     */
    columnVisibilityChanged(): void;
    addEventListener(): void;
    removeEventListener(): void;
    /**
     * Updates the footer table width to match the header table width.
     *
     * @param {HTMLElement} tFoot - Footer table element whose width should be synchronized
     * @returns {void}
     * @hidden
     */
    updateFooterTableWidth(tFoot: HTMLElement): void;
    refreshFooterRenderer(editedData: Object[]): void;
    getIndexByKey(data: object, ds: object[]): number;
    private getData;
    onAggregates(editedData: Object[]): Object;
}
