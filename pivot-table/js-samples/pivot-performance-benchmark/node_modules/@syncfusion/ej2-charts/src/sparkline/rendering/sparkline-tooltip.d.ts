import { Sparkline } from '../index';
import { SparkValues } from '../utils/helper';
/**
 * Sparkline Tooltip Module
 */
export declare class SparklineTooltip {
    /**
     * Sparkline instance in tooltip.
     */
    private sparkline;
    /**
     * Sparkline current point index.
     */
    private pointIndex;
    /**
     * Sparkline tooltip timer.
     */
    private clearTooltip;
    constructor(sparkline: Sparkline);
    /**
     * @hidden
     * @returns {void}
     */
    private addEventListener;
    private mouseLeaveHandler;
    private mouseUpHandler;
    private fadeOut;
    /**
     * To remove tooltip and tracker elements.
     *
     * @private
     * @returns {void}
     */
    removeTooltipElements(): void;
    private mouseMoveHandler;
    private processTooltip;
    /**
     * To render tracker line.
     *
     * @param {SparkValues} points - The data points for rendering the tracker line.
     * @returns {void}
     */
    private renderTrackerLine;
    /**
     * To render tooltip.
     *
     * @param {SparkValues} points - The data points for rendering the tooltip.
     * @returns {void}
     */
    renderTooltip(points: SparkValues): void;
    private addTooltip;
    /**
     * Gets the formatted tooltip text for the specified Sparkline point.
     *
     * @param {string} format - The tooltip template format string.
     * @param {Sparkline} spark - The Sparkline instance used to resolve tooltip values.
     * @param {string} x - The formatted x-value text.
     * @param {string} y - The formatted y-value text.
     * @param {SparkValues} points - The Sparkline point values used to resolve tooltip tokens.
     * @returns {string[]} - Returns the formatted tooltip text collection.
     * @private
     */
    private getFormat;
    /**
     * Resolves inline Sparkline tooltip tokens in the specified template string.
     *
     * @param {string} input - The tooltip template string that contains inline tokens to resolve.
     * @param {Sparkline} spark - The Sparkline instance used to resolve tooltip values.
     * @param {string} x - The formatted x-value text.
     * @param {string} y - The formatted y-value text.
     * @param {SparkValues} points - The Sparkline point values used to resolve tooltip tokens.
     * @param {string} xName - The x-value field name used in the tooltip template.
     * @param {string} yName - The y-value field name used in the tooltip template.
     * @returns {string} - Returns the tooltip template string with supported tokens resolved.
     * @private
     */
    private resolveSparklineTooltipTokens;
    /**
     * Replaces a single inline Sparkline tooltip token with the corresponding x or y value.
     *
     * @param {Sparkline} spark - The Sparkline instance used to resolve and format tooltip values.
     * @param {string} x - The formatted x-value text.
     * @param {string} y - The formatted y-value text.
     * @param {SparkValues} points - The Sparkline point values used to resolve the token.
     * @param {string} xName - The x-value field name used in the tooltip template.
     * @param {string} yName - The y-value field name used in the tooltip template.
     * @param {string} match - The complete matched tooltip token text.
     * @param {string} token - The token content inside the tooltip expression.
     * @returns {string} - Returns the resolved tooltip token value, or the original token text when it cannot be resolved.
     * @private
     */
    private replaceSparklineTooltipToken;
    /**
     * Formats the specified Sparkline tooltip value using inline formatting, Sparkline formatting, or fallback text.
     *
     * @param {any} value - The raw tooltip value to format.
     * @param {Sparkline} sparkline - The Sparkline instance used to apply number or date formatting.
     * @param {string} inlineFormat - The optional inline format string specified in the tooltip token.
     * @param {string} fallbackText - The optional fallback tooltip text returned when inline formatting cannot be applied.
     * @returns {string | number} - Returns the formatted tooltip value.
     * @private
     */
    private formatValue;
    /**
     * Checks whether the specified inline format is a numeric format.
     *
     * @param {string} format - The inline format string to validate.
     * @returns {boolean} - Returns true when the format is numeric; otherwise, false.
     * @private
     */
    private isNumericFormat;
    /**
     * To remove tracker line.
     *
     * @returns {void}
     */
    private removeTracker;
    /**
     * To remove tooltip element.
     *
     * @returns {void}
     */
    private removeTooltip;
    /**
     * Get module name.
     *
     * @returns {string} - To get the module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the tooltip.
     *
     * @returns {void}
     */
    destroy(): void;
}
