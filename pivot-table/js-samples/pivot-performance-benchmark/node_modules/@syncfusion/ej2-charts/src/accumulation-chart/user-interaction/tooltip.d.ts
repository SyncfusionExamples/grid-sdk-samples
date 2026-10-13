import { AccumulationChart } from '../accumulation';
import { AccPointData } from '../../common/utils/helper';
import { BaseTooltip } from '../../common/user-interaction/tooltip';
/**
 * The `AccumulationTooltip` module is used to render tooltips for the accumulation chart.
 */
export declare class AccumulationTooltip extends BaseTooltip {
    accumulation: AccumulationChart;
    constructor(accumulation: AccumulationChart);
    /**
     * Adds an event listener.
     *
     * @hidden
     * @returns {void}
     */
    private addEventListener;
    private mouseLeaveHandler;
    private mouseUpHandler;
    private mouseMoveHandler;
    /**
     * Renders the tooltip.
     *
     * @param {PointerEvent | TouchEvent} event - The mouse move event or touch event.
     * @returns {void}
     * @private
     */
    tooltip(event: PointerEvent | TouchEvent): void;
    /**
     * @private
     */
    renderSeriesTooltip(chart: AccumulationChart, data: AccPointData): void;
    private triggerTooltipRender;
    private getPieData;
    /**
     * To get series from index.
     *
     * @param {number} index - The index of the series to retrieve.
     * @param {AccumulationSeries[]} visibleSeries - The array of visible series in the accumulation chart.
     * @returns {AccumulationSeries} - The series retrieved from the specified index.
     */
    private getSeriesFromIndex;
    private getTooltipText;
    private findHeader;
    /**
     * Parses the tooltip template string and resolves all supported point and series tokens.
     *
     * @param {AccPoints} point - The accumulation chart point used to resolve point-based tooltip tokens.
     * @param {AccumulationSeries} series - The accumulation chart series used to resolve series-based tooltip tokens.
     * @param {string} format - The tooltip template format string.
     * @returns {string} - Returns the parsed tooltip text with resolved token values.
     * @private
     */
    private parseTemplate;
    /**
     * Resolves tooltip tokens in the specified template string.
     *
     * @param {string} input - The tooltip template string that contains tokens to resolve.
     * @param {AccPoints} point - The accumulation chart point used to resolve point-based tokens.
     * @param {AccumulationSeries} series - The accumulation chart series used to resolve series-based tokens.
     * @param {string[]} pointKeys - The available point property keys.
     * @param {string[]} seriesKeys - The available series property keys.
     * @returns {string} - Returns the tooltip template string with supported tokens resolved.
     * @private
     */
    private resolveTooltipTokens;
    /**
     * Replaces a single tooltip token with the corresponding point or series value.
     *
     * @param {AccPoints} point - The accumulation chart point used to resolve point-based tokens.
     * @param {AccumulationSeries} series - The accumulation chart series used to resolve series-based tokens.
     * @param {string[]} pointKeys - The available point property keys.
     * @param {string[]} seriesKeys - The available series property keys.
     * @param {string} match - The complete matched tooltip token text.
     * @param {string} token - The token content inside the tooltip expression.
     * @returns {string} - Returns the resolved tooltip token value, or the original token text when it cannot be resolved.
     * @private
     */
    private replaceTooltipToken;
    /**
     * Gets the raw tooltip text for the specified point value.
     *
     * @param {string} key - The point property key.
     * @param {any} rawValue - The raw point value.
     * @returns {string} - Returns the raw point value as tooltip text.
     * @private
     */
    private getPointRawText;
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the Tooltip.
     *
     * @returns {void}
     * @private
     */
    destroy(): void;
}
