import { extend } from '@syncfusion/ej2-base';
/**
 * `ExcelExportHelper` module is used to add theme styles in Excel document.
 *
 * @hidden
 */
var ExcelExportHelper = /** @class */ (function () {
    /**
     * Constructor for the PivotTable Excel Export Helper module.
     *
     * @param {PivotView} parent - Instance of pivot table.
     * @hidden
     */
    function ExcelExportHelper(parent) {
        this.parent = parent;
    }
    /**
     * Merges the given theme style into the existing Excel style.
     *
     * @param {ExcelTheme} themestyle - Theme-specific style to apply.
     * @param {ExcelStyle} style - Existing Excel style to be extended.
     * @returns {ExcelStyle} The combined Excel style.
     * @hidden
     */
    ExcelExportHelper.prototype.updateThemeStyle = function (themestyle, style) {
        return extend(style, themestyle);
    };
    /**
     * Returns the caption style by merging theme caption with the provided style.
     *
     * @param {ExcelTheme} theme - Excel theme containing caption style.
     * @param {ExcelStyle} styles - Base style to be extended.
     * @returns {ExcelTheme} The updated caption style as ExcelTheme.
     * @hidden
     */
    ExcelExportHelper.prototype.getCaptionThemeStyle = function (theme, styles) {
        var style = this.updateThemeStyle(theme.caption, styles);
        return style;
    };
    /**
     * Returns the header style by merging theme header with the provided style.
     *
     * @param {ExcelTheme} theme - Excel theme containing header style.
     * @param {ExcelStyle} styles - Base style to be extended.
     * @returns {ExcelTheme} The updated header style as ExcelTheme.
     * @hidden
     */
    ExcelExportHelper.prototype.getHeaderThemeStyle = function (theme, styles) {
        var style = this.updateThemeStyle(theme.header, styles);
        return style;
    };
    /**
     * Returns the record style by merging theme record with the provided style
     *
     * @param {ExcelTheme} theme - Excel theme containing record style.
     * @param {ExcelStyle} styles - Base style to be extended.
     * @returns {ExcelTheme} The updated record style as ExcelTheme.
     * @hidden
     */
    ExcelExportHelper.prototype.getRecordThemeStyle = function (theme, styles) {
        var style = this.updateThemeStyle(theme.record, styles);
        return style;
    };
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
    ExcelExportHelper.prototype.setImage = function (args, colIndex, rowIndex, rowHeight) {
        var excelImage = {
            image: args.image.base64, row: rowIndex, column: colIndex + 1,
            lastRow: rowIndex, lastColumn: colIndex + 1, firstRowOffset: args.image.firstRowOffset,
            firstColumnOffset: args.image.firstColumnOffset
        };
        if (args.image.width && args.image.height) {
            excelImage.width = args.image.width;
            excelImage.height = args.image.height;
        }
        this.parent.excelExportModule.images.push(excelImage);
        var height = rowHeight > args.image.height ? rowHeight : args.image.height;
        return height || 50;
    };
    return ExcelExportHelper;
}());
export { ExcelExportHelper };
