import { Workbook } from '@syncfusion/ej2-excel-export';
import { ExcelImage, ExcelExportProperties } from '../../common/base/interface';
import { PivotView } from '../base/pivotview';
/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
export declare class ExcelExport {
    private parent;
    private engine;
    private rows;
    private actualrCnt;
    private theme;
    /** @hidden */
    images: ExcelImage[];
    private workSheet;
    private columns;
    private isHeaderIncluded;
    private book;
    private excelExportHelper;
    /**
     * Constructor for the PivotGrid Excel Export module.
     *
     * @param {PivotView} parent - Instance of pivot table.
     * @hidden
     */
    constructor(parent?: PivotView);
    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - string.
     * @private
     */
    protected getModuleName(): string;
    private addHeaderAndFooter;
    /**
     *
     * Method to perform excel export.
     *
     * @hidden
     */
    exportToExcel(type: string, exportProperties?: ExcelExportProperties, isBlob?: boolean, workBook?: Workbook, isMultipleExport?: boolean, currentPivotInstance?: PivotView): Promise<Workbook>;
    private updateOlapPageSettings;
    /**
     * To destroy the excel export module
     *
     * @returns {void}
     * @hidden
     */
    destroy(): void;
}
