import { Chart } from '../chart';
import { PointData } from '../../common/utils/helper';
import { BaseTooltip } from '../../common/user-interaction/tooltip';
/**
 * The `Tooltip` module is used to render tooltips for chart series.
 */
export declare class Tooltip extends BaseTooltip {
    /**
     * Constructor for the Touch module.
     *
     * @param {Chart} chart - The chart instance.
     */
    constructor(chart: Chart);
    /**
     * Adds event listeners for the chart.
     *
     * @returns {void}
     */
    private addEventListener;
    private mouseUpHandler;
    private mouseLeaveHandler;
    mouseMoveHandler(): void;
    /**
     * Handles the long press on chart.
     *
     * @returns {boolean} false
     * @private
     */
    private longPress;
    /**
     * Renders the tooltip.
     *
     * @returns {void}
     * @private
     */
    tooltip(): void;
    private findHeader;
    private findShapes;
    private renderSeriesTooltip;
    private triggerTooltipRender;
    private findMarkerHeight;
    private findData;
    private getSymbolLocation;
    private getRangeArea;
    private getWaterfallRegion;
    private getTooltipText;
    private getTemplateText;
    private renderGroupedTooltip;
    /**
     * Applies the tooltip distance offset to the resolved tooltip location.
     *
     * @param {ChartLocation} location - The resolved tooltip location to be adjusted.
     * @param {PointData} point - The point data for which the tooltip is rendered.
     * @param {Chart} chart - The chart instance used to determine orientation and RTL.
     * @returns {void}
     * @private
     */
    private applyTooltipDistance;
    private triggerSharedTooltip;
    private findSharedLocation;
    /**
     * Get symbol locations for the current points.
     * @returns {ChartLocation[]} Array of ChartLocation; invalid points are { x: null, y: null }.
     */
    private findSplitLocation;
    /**
     * Get clip bounds for each current point's series.
     * @returns {[Rect[], string[]]} clipBounds and seriesTypes arrays.
     * Missing series produce { x: null, y: null, width: null, height: null } and ''.
     */
    private findSplitClipBounds;
    private getBoxLocation;
    /**
     * Parses the tooltip template string and resolves all supported point and series tokens.
     *
     * @param {Points} point - The chart point used to resolve point-based tooltip tokens.
     * @param {Series} series - The chart series used to resolve series-based tooltip tokens.
     * @param {string} format - The tooltip template format string.
     * @param {Axis} xAxis - The x-axis used to format x point values.
     * @param {Axis} yAxis - The y-axis used to format y point values.
     * @returns {string} - Returns the parsed tooltip text with resolved token values.
     * @private
     */
    private parseTemplate;
    /**
     * Resolves tooltip tokens in the specified template string.
     *
     * @param {string} input - The tooltip template string that contains tokens to resolve.
     * @param {Points} point - The chart point used to resolve point-based tokens.
     * @param {Series} series - The chart series used to resolve series-based tokens.
     * @param {string[]} pointKeys - The available point property keys.
     * @param {string[]} seriesKeys - The available series property keys.
     * @param {Axis} xAxis - The x-axis used to format x point values.
     * @param {Axis} yAxis - The y-axis used to format y point values.
     * @returns {string} - Returns the tooltip template string with supported tokens resolved.
     * @private
     */
    private resolveTooltipTokens;
    /**
     * Replaces a single tooltip token with the corresponding point or series value.
     *
     * @param {Points} point - The chart point used to resolve point-based tokens.
     * @param {Series} series - The chart series used to resolve series-based tokens.
     * @param {string[]} pointKeys - The available point property keys.
     * @param {string[]} seriesKeys - The available series property keys.
     * @param {Axis} xAxis - The x-axis used to format x point values.
     * @param {Axis} yAxis - The y-axis used to format y point values.
     * @param {string} match - The complete matched tooltip token text.
     * @param {string} token - The token content inside the tooltip expression.
     * @returns {string} - Returns the resolved tooltip token value, or the original token text when it cannot be resolved.
     * @private
     */
    private replaceTooltipToken;
    /**
     * Gets the formatted tooltip text for the specified point value.
     *
     * @param {Points} point - The chart point that contains the value to format.
     * @param {Series} series - The chart series associated with the point.
     * @param {string} key - The point property key to format.
     * @param {Axis} xAxis - The x-axis used to format x point values.
     * @param {Axis} yAxis - The y-axis used to format y point values.
     * @returns {string} - Returns the formatted tooltip text for the specified point value.
     * @private
     */
    private getPointTooltipText;
    private formatPointValue;
    private getFormat;
    private getIndicatorTooltipFormat;
    removeHighlightedMarker(data: PointData[], fadeOut: boolean): void;
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the tooltip.
     *
     * @returns {void}
     * @private
     */
    destroy(): void;
}
