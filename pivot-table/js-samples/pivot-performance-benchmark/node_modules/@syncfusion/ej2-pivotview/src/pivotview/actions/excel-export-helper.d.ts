import { ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs } from '../../common/base/interface';
import { PivotView } from '../base/pivotview';
import { ExcelStyle, ExcelTheme } from '@syncfusion/ej2-grids';
/**
 * `ExcelExportHelper` module is used to add theme styles in Excel document.
 *
 * @hidden
 */
export declare class ExcelExportHelper {
    private parent;
    /**
     * Constructor for the PivotTable Excel Export Helper module.
     *
     * @param {PivotView} parent - Instance of pivot table.
     * @hidden
     */
    constructor(parent?: PivotView);
    /**
     * Merges the given theme style into the existing Excel style.
     *
     * @param {ExcelTheme} themestyle - Theme-specific style to apply.
     * @param {ExcelStyle} style - Existing Excel style to be extended.
     * @returns {ExcelStyle} The combined Excel style.
     * @hidden
     */
    updateThemeStyle(themestyle: ExcelTheme, style: ExcelStyle): ExcelStyle;
    /**
     * Returns the caption style by merging theme caption with the provided style.
     *
     * @param {ExcelTheme} theme - Excel theme containing caption style.
     * @param {ExcelStyle} styles - Base style to be extended.
     * @returns {ExcelTheme} The updated caption style as ExcelTheme.
     * @hidden
     */
    getCaptionThemeStyle(theme: ExcelTheme, styles: ExcelStyle): ExcelTheme;
    /**
     * Returns the header style by merging theme header with the provided style.
     *
     * @param {ExcelTheme} theme - Excel theme containing header style.
     * @param {ExcelStyle} styles - Base style to be extended.
     * @returns {ExcelTheme} The updated header style as ExcelTheme.
     * @hidden
     */
    getHeaderThemeStyle(theme: ExcelTheme, styles: ExcelStyle): ExcelTheme;
    /**
     * Returns the record style by merging theme record with the provided style
     *
     * @param {ExcelTheme} theme - Excel theme containing record style.
     * @param {ExcelStyle} styles - Base style to be extended.
     * @returns {ExcelTheme} The updated record style as ExcelTheme.
     * @hidden
     */
    getRecordThemeStyle(theme: ExcelTheme, styles: ExcelStyle): ExcelTheme;
    /**
     * Inserts an image into the Excel export at the specified cell location.
     *
     * @param {ExcelHeaderQueryCellInfoEventArgs | ExcelQueryCellInfoEventArgs} args - Cell info event arguments containing image data.
     * @param {number} colIndex - Column index where the image should be placed.
     * @param {number} rowIndex - Row index where the image should be placed.
     * @param {number} rowHeight - Height of the row to compare with image height.
     * @returns  {number} The final row height after inserting the image.
     * @hidden
     */
    setImage(args: ExcelHeaderQueryCellInfoEventArgs | ExcelQueryCellInfoEventArgs, colIndex: number, rowIndex: number, rowHeight: number): number;
}
