import { Chart } from '../../chart';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { AccPoints, AccumulationSeries } from '../../accumulation-chart/model/acc-base';
import { PointData, ChartLocation } from '../../common/utils/helper';
import { Rect, Size } from '@syncfusion/ej2-svg-base';
import { AccPointData } from '../../common/utils/helper';
import { ChartData } from '../../chart/utils/get-data';
import { Series, Points } from '../../chart/series/chart-series';
import { FontModel } from '../../common/model/base-model';
import { Tooltip as SVGTooltip } from '@syncfusion/ej2-svg-base';
import { ChartShape } from '../../chart/utils/enum';
import { Chart3D } from '../../chart3d';
import { Chart3DSeries, Chart3DPoint } from '../../chart3d/series/chart-series';
import { Point3D } from '../../common/utils/helper';
/**
 * `Tooltip` module is used to render the tooltip for series.
 */
export declare class BaseTooltip extends ChartData {
    element: HTMLElement;
    elementSize: Size;
    textStyle: FontModel;
    isRemove: boolean;
    toolTipInterval: number;
    textElements: Element[];
    inverted: boolean;
    formattedText: string[];
    header: string;
    /**
     * @aspType string
     * @private
     */
    template: string | Function;
    /** @private */
    valueX: number;
    /** @private */
    valueY: number;
    control: AccumulationChart | Chart | Chart3D;
    text: string[];
    svgTooltip: SVGTooltip;
    headerText: string;
    /**
     * Constructor for tooltip module.
     *
     * @private
     */
    constructor(chart: Chart | AccumulationChart | Chart3D);
    getElement(id: string): HTMLElement;
    /**
     * Renders the tooltip.
     *
     * @returns {void}
     * @private
     */
    getTooltipElement(isTooltip: boolean): HTMLDivElement;
    createElement(): HTMLDivElement;
    pushData(data: PointData | AccPointData | Point3D, isFirst: boolean, tooltipDiv: HTMLDivElement, isChart: boolean, enable3D?: boolean): boolean;
    removeHighlight(): void;
    /**
     * Animates the opacity change of the given element to simulate a highlight effect.
     *
     * @param {number} targetOpacity - The final opacity value to which the element's opacity will be animated.
     * @param {HTMLElement} targetElement - The DOM element whose opacity is to be animated.
     * @param {number} duration - The duration of the animation effect.
     * @param {number} targetStrokeWidth - The final stroke-width value to which the element's stroke-width will be animated.
     * @returns {void}
     * @private
     */
    private animateHighlight;
    highlightPoint(series: Series | AccumulationSeries | Chart3DSeries, pointIndex: number, highlight: boolean): void;
    highlightPoints(): void;
    createTooltip(chart: Chart | AccumulationChart | Chart3D, isFirst: boolean, location: ChartLocation, clipLocation: ChartLocation, point: Points | AccPoints | Chart3DPoint, shapes: ChartShape[], offset: number, bounds: Rect, crosshairEnabled?: boolean, extraPoints?: PointData[], templatePoint?: Points | Points[] | AccPoints | Chart3DPoint | Chart3DPoint[], customTemplate?: string, splitLocations?: ChartLocation[], splitClipBounds?: Rect[], seriesTypes?: string[]): void;
    private findPalette;
    private findColor;
    updatePreviousPoint(extraPoints: PointData[]): void;
    fadeOut(data: PointData[]): void;
    removeHighlightedMarker(data: PointData[], fadeOut: boolean): void;
    removeText(): void;
    stopAnimation(): void;
    /**
     * Removes the tooltip on mouse leave.
     *
     * @returns {void}
     * @private
     */
    removeTooltip(duration: number): void;
    /**
     * Gets the formatted tooltip value by applying the specified inline format when it matches the value type.
     *
     * @param {any} rawValue - The raw tooltip value to format.
     * @param {string} inlineFormat - The inline format string specified in the tooltip token.
     * @param {string} fallbackText - The fallback tooltip text returned when formatting cannot be applied.
     * @param {any} intl - The internationalization instance used to format date and number values.
     * @param {boolean} useGrouping - Specifies whether grouping separators should be used while formatting numbers.
     * @returns {string} - Returns the formatted tooltip value, or the fallback text when the format is not applicable.
     */
    protected getFormattedTooltipValue(rawValue: any, inlineFormat: string, fallbackText: string, intl: any, useGrouping: boolean): string;
    /**
     * Checks whether the specified inline format is a numeric format.
     *
     * @param {string} format - The inline format string to validate.
     * @returns {boolean} - Returns true when the format is numeric; otherwise, false.
     * @private
     */
    isNumericFormat(format: string): boolean;
}
