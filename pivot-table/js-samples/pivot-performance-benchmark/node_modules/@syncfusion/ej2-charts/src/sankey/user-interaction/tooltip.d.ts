import { Sankey } from '../sankey';
import { Tooltip as SVGTooltip } from '@syncfusion/ej2-svg-base';
import { ChartLocation } from '../../common/utils/helper';
import { SankeyNodeAggregates } from '../model/sankey-interface';
/**
 * Tooltip rendering module for Sankey Chart.
 */
export declare class SankeyTooltip {
    /** @private */
    sankey: Sankey;
    /** @private */
    svgTooltip: SVGTooltip;
    private tooltipTimer;
    /**
     * Constructor.
     *
     * @param {Sankey} sankey - Sankey chart instance.
     */
    constructor(sankey: Sankey);
    /**
     * Wires all tooltip-related event listeners to the Sankey chart instance.
     *
     * This method attaches pointer, touch, mouse, and click events required for
     * tooltip rendering and lifecycle management.
     *
     * @returns {void}
     */
    private wireEvents;
    /**
     * Unwires all tooltip-related event listeners from the Sankey chart instance.
     *
     * @returns {void}
     */
    private unwireEvents;
    /**
     * Acts as a proxy to forward pointer and touch move events
     * to the existing handleMouseMove method.
     *
     * @param {PointerEvent | TouchEvent} event - The pointer or touch move event.
     * @returns {void}
     */
    private handlePointerMove;
    /**
     * Handles chart click events to hideTooltip the tooltip when fade-out mode is set to click.
     *
     * @param {Event} event - The click event triggered on the chart.
     * @returns {void}
     * @private
     */
    handleChartClick(event: Event): void;
    /**
     * Listens mouse move events inside the Sankey chart.
     *
     * @param {PointerEvent} event - The mouse or pointer move event within the chart.
     * @returns {void}
     * @private
     */
    handleMouseMove(event: PointerEvent): void;
    /**
     * Applies tooltip formatting for Sankey tooltip templates by resolving inline and legacy tokens.
     *
     * @param {string} format - The tooltip template format string.
     * @param {Object.<string, any>} values - The collection of tooltip values used to resolve tokens.
     * @returns {string} - Returns the formatted Sankey tooltip text.
     * @private
     */
    private applySankeyTooltipFormatting;
    /**
     * Resolves inline Sankey tooltip tokens in the specified template string.
     *
     * @param {string} input - The tooltip template string that contains inline tokens to resolve.
     * @param {Object.<string, any>} values - The collection of tooltip values used to resolve tokens.
     * @returns {string} - Returns the tooltip template string with supported inline tokens resolved.
     * @private
     */
    private resolveSankeyTooltipTokens;
    /**
     * Replaces a single inline Sankey tooltip token with the corresponding value.
     *
     * @param {Object.<string, any>} values - The collection of tooltip values used to resolve the token.
     * @param {string} match - The complete matched tooltip token text.
     * @param {string} token - The token content inside the tooltip expression.
     * @returns {string} - Returns the resolved tooltip token value, or the original token text when it cannot be resolved.
     * @private
     */
    private replaceSankeyTooltipToken;
    /**
     * Gets the formatted Sankey tooltip value by applying the specified inline format when it matches the value type.
     *
     * @param {any} rawValue - The raw tooltip value to format.
     * @param {string} inlineFormat - The inline format string specified in the tooltip token.
     * @param {string} fallbackText - The fallback tooltip text returned when formatting cannot be applied.
     * @returns {string} - Returns the formatted Sankey tooltip value, or the fallback text when the format is not applicable.
     * @private
     */
    private getFormattedSankeyTooltipValue;
    /**
     * Resolves legacy Sankey tooltip tokens in the specified template string.
     *
     * @param {string} format - The tooltip template format string that contains legacy tokens.
     * @param {Object.<string, any>} values - The collection of tooltip values used to resolve legacy tokens.
     * @returns {string} - Returns the tooltip template string with supported legacy tokens resolved.
     * @private
     */
    private resolveSankeyLegacyTokens;
    /**
     * Replaces a single legacy Sankey tooltip token with the corresponding value.
     *
     * @param {Object.<string, any>} values - The collection of tooltip values used to resolve the legacy token.
     * @param {string} match - The complete matched legacy tooltip token text.
     * @param {string} path - The legacy token path used to retrieve the tooltip value.
     * @returns {string} - Returns the resolved legacy tooltip token value, or the original token text when it cannot be resolved.
     * @private
     */
    private replaceSankeyLegacyToken;
    /**
     * Checks whether the specified inline format is a numeric format.
     *
     * @param {string} format - The inline format string to validate.
     * @returns {boolean} - Returns true when the format is numeric; otherwise, false.
     * @private
     */
    private isNumericFormat;
    /**
     * Gets the formatted tooltip content for a Sankey node format string.
     *
     * @param {string} format - The node tooltip format string.
     * @param {SankeyNodeAggregates} nodeAggregates - The node aggregate values.
     * @returns {string} - The formatted node tooltip content.
     *
     * @private
     */
    private getNodeTooltipContent;
    /**
     * Gets the formatted tooltip content for a Sankey link format string.
     *
     * @param {string} format - The link tooltip format string.
     * @param {SankeyNodeAggregates} sourceAggregates - The source node aggregate values.
     * @param {SankeyNodeAggregates} targetAggregates - The target node aggregate values.
     * @param {number} value - The current link value.
     * @returns {string} - The formatted link tooltip content.
     *
     * @private
     */
    private getLinkTooltipContent;
    /**
     * Shows tooltip for a given SVG element using the current chart mouse coordinates or a fallback position.
     *
     * @param {Element} targetElement - The SVG target element to show the tooltip for (node <rect> or link <path>).
     * @param {boolean} isInitialRender - Indicates whether the tooltip is being rendered for the first time.
     * @param {ChartLocation} [fallbackPosition] - Optional fallback position to place the tooltip when mouse coordinates are not applicable.
     * @returns {void}
     *
     * @private
     */
    showTooltipForElement(targetElement: Element, isInitialRender?: boolean, fallbackPosition?: ChartLocation): void;
    /**
     * Triggers tooltip rendering logic when a mouse or pointer release
     * action occurs inside the Sankey chart series area.
     *
     * @param {PointerEvent} event - The mouse or pointer up event within the chart.
     * @returns {void}
     *
     * @private
     */
    handlePointerUp(event: PointerEvent): void;
    /**
     * Resolves the nearest interactive SVG element (node or link) starting from the given element.
     *
     * @param {string} chartId - The root chart element id used to construct node ids from label ids.
     * @param {Element | null} startElement - The starting element to inspect and traverse from.
     * @returns {Element | null }} The resolved element and its type ('node' or 'link').
     *
     * @private
     */
    resolveInteractiveTarget(chartId: string, startElement: Element | null): {
        element: Element | null;
        type: 'node' | 'link' | null;
    };
    /**
     * Triggers tooltip hiding if mouse away from chart series area.
     *
     * @returns {void}
     * @private
     */
    handlePointerLeave(): void;
    /**
     * Triggers tooltip rendering logic when a mouse or pointer action
     * occurs within the Sankey chart series area.
     *
     * Determines the nearest interactive Sankey element (node or link)
     * based on the event target and renders or hideTooltips the tooltip accordingly.
     *
     * @param {boolean} isInitialRender - Indicates whether the tooltip is being rendered for the first time.
     * @param {PointerEvent} event - The mouse or pointer event occurring inside the chart.
     * @returns {void}
     * @private
     */
    renderTooltip(isInitialRender: boolean, event: PointerEvent): void;
    /**
     * Computes aggregated metrics for a Sankey node to be used in tooltip content.
     *
     * Calculates total inbound and outbound values for the given node id,
     * and resolves its display name and color (if provided).
     *
     * @param {string} nodeId - The Sankey node identifier to aggregate values for.
     * @param {string} [color] - Optional color associated with the node.
     * @returns {SankeyNodeAggregates} Aggregated values for the specified node.
     * @private
     */
    computeNodeAggregates(nodeId: string, color?: string): SankeyNodeAggregates;
    /**
     * Hides the tooltip after the specified delay.
     *
     * @param {number} delay - The delay in milliseconds before hiding the tooltip.
     * @returns {void}
     * @private
     */
    hideTooltip(delay?: number): void;
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
