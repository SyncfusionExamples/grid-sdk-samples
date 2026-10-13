import { PdfDocument, PdfGridCell, PdfGridRow } from '@syncfusion/ej2-pdf-export';
import { PdfExportProperties, PdfHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { PdfBorderStyle } from '../../common/base/enum';
import { IAxisSet } from '../../base/engine';
import { PivotView } from '../base/pivotview';
/**
 * `PDFExportHelper` module is used to add header and footer in PDF document
 *
 * @hidden
 */
export declare class PDFExportHelper {
    /**
     * Method to draw a header in a PDF document.
     *
     * @param  {PdfExportProperties} pdfExportProperties - It contains the export properties for the table and chart.
     * @param  {PdfDocument} pdfDocument - It contains the current PDF document
     * @returns {void}
     * @hidden
     */
    drawHeader(pdfExportProperties: PdfExportProperties, pdfDocument: PdfDocument): void;
    /**
     * Method to draw a footer in a PDF document.
     *
     * @param  {PdfExportProperties} pdfExportProperties -It contains the export properties for table and chart
     * @param  {PdfDocument} pdfDocument - It contains the current PDF document
     * @returns {void}
     * @hidden
     */
    drawFooter(pdfExportProperties: PdfExportProperties, pdfDocument: PdfDocument): void;
    private drawPageTemplate;
    private processContentValidation;
    private drawText;
    private drawPageNumber;
    private drawImage;
    private drawLine;
    private getFontFromContent;
    private getPenFromContent;
    private getBrushFromContent;
    private setContentFormat;
    private getPageNumberStyle;
    /**
     *
     * @param {PdfBorderStyle} dashType - It contains the PDF dash style
     * @returns {number} - It returns PDF dash style
     * @hidden
     */
    getDashStyle(dashType: PdfBorderStyle): number;
    /**
     *
     * @param {string} hexDec - It contains a hexadecimal code as string
     * @returns {number} - It returns RGB as number
     * @hidden
     */
    hexDecToRgb(hexDec: string): {
        r: number;
        g: number;
        b: number;
    };
    /**
     * Converts the supplied base64 image data into a `PdfBitmap`, applies any optional sizing, and assigns it to the
     * specified PDF grid cell so the image is rendered when exporting to PDF.
     *
     * @param {PdfGridCell} cell - Holds the current cell for customization.
     * @param {Object} image - Holds the image data to insert.
     * @param {string} image.base64 - Base64-encoded image string used to create the bitmap.
     * @param {number} [image.height] - Height to assign to the image when provided.
     * @param {number} [image.width] - Width to assign to the image when provided.
     * @param {PdfGridRow} pdfGridRow - The current PDF grid row;
     * @returns {void}
     * @hidden
     */
    configureCellImage(cell: PdfGridCell, image: {
        base64: string;
        height?: number;
        width?: number;
    }, pdfGridRow: PdfGridRow): void;
    /**
     * Applies hyperlink formatting to the supplied PDF grid cell when hyperlink metadata is available, ensuring the exported
     * PDF displays a clickable link with consistent styling.
     *
     * @param {PdfGridCell} cell - The PDF grid cell to render as a hyperlink when hyperlink metadata is provided.
     * @param {PdfHeaderQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs} args - Provides hyperlink metadata (target URL and optional display text). When not set, the cell is rendered as plain text.
     * @param {PdfGridRow} pdfGridRow - The current PDF grid row; used to identify header rows for default text styling.
     * @param {IAxisSet} pivotCell - The current pivot cell; used to identify row header/summary regions for default text styling.
     * @param {PivotView} currentPivotInstance - The current PivotView instance; used with pivotCell to determine the row header levels.
     * @returns {void}
     * @hidden
     */
    setHyperLink(cell: PdfGridCell, args: PdfHeaderQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs, pdfGridRow?: PdfGridRow, pivotCell?: IAxisSet, currentPivotInstance?: PivotView): void;
    /**
     * Applies the default header background color to the provided PDF grid cell.
     *
     * @param {PdfGridCell} cell - The PDF grid cell to style.
     * @returns {void}
     * @hidden
     */
    applyHeaderBackground(cell: PdfGridCell): void;
    /**
     * Converts a font family name string to its corresponding PdfFontFamily enumeration value.
     *
     * @param {string} family - The font family name to convert (e.g., 'TimesRoman', 'Courier', 'Symbol', 'ZapfDingbats').
     * @returns {number} - The PdfFontFamily enumeration value corresponding to the specified font family name.
     * @hidden
     */
    getFontFamily(family: string): number;
}
