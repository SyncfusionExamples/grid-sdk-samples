import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Filter, Sort, Group, Edit, Resize, Toolbar, Aggregate, Page, ExcelExport, PdfExport, ColumnChooser, ColumnMenu, InfiniteScroll } from '@syncfusion/ej2-react-grids';
import { Browser } from "@syncfusion/ej2-base";
import { gridData } from '../data/virtualData';

// Adaptive grid demo page.
function Adaptive() {

    // Inline styles for the mobile device preview.
    const SAMPLE_CSS = `
  .e-bigger.e-responsive-dialog .e-dlg-content {
    padding: 16px;
  }

  /* The device with borders */
  .e-mobile-layout {
    position: relative;
    width: 360px;
    height: 600px;
    margin: auto;
    border: 16px #f4f4f4 solid;
    border-top-width: 60px;
    border-bottom-width: 60px;
    border-radius: 36px;
    box-shadow: 0 0px 2px rgb(144 144 144), 0 0px 10px rgb(0 0 0 / 16%);
  }

  .tailwind-dark .e-mobile-layout,
  .material-dark .e-mobile-layout,
  .fabric-dark .e-mobile-layout,
  .bootstrap-dark .e-mobile-layout,
  .bootstrap5-dark .e-mobile-layout {
    border: 16px rgb(255 255 255 / 10%) solid;
    border-top-width: 60px;
    border-bottom-width: 60px;
  }

  /* The horizontal line on the top of the device */
  .e-mobile-layout:before {
    content: '';
    display: block;
    width: 60px;
    height: 5px;
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ebebeb;
    border-radius: 10px;
  }

  .tailwind-dark .e-mobile-layout::before,
  .tailwind-dark .e-mobile-layout::after,
  .material-dark .e-mobile-layout::before,
  .material-dark .e-mobile-layout::after,
  .fabric-dark .e-mobile-layout::before,
  .fabric-dark .e-mobile-layout::after,
  .bootstrap-dark .e-mobile-layout::before,
  .bootstrap-dark .e-mobile-layout::after,
  .bootstrap5-dark .e-mobile-layout::before,
  .bootstrap5-dark .e-mobile-layout::after {
    background: rgb(255 255 255  / 20%);
  }

  /* The circle on the bottom of the device */
  .e-mobile-layout:after {
    content: '';
    display: block;
    width: 35px;
    height: 35px;
    position: absolute;
    left: 50%;
    bottom: -65px;
    transform: translate(-50%, -50%);
    background: #e8e8e8;
    border-radius: 50%;
  }

  /* The screen (or content) of the device */
  .e-mobile-layout .e-mobile-content {
    overflow: hidden;
    width: 328px;
    height: 100%;
    background: transparent;
    border: 0px solid #dddddd;
  }

  .highcontrast .e-mobile-layout {
      border: 16px #000000 solid;
      border-top-width: 60px;
      border-bottom-width: 60px;
      box-shadow: -1px 2px white, -2px -2px white, 2px -2px white, 2px 1px white;
  }`;
    // Grid instance used by the toolbar actions.
    let grid;
    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search', 'ColumnChooser', 'ExcelExport'];
    const renderingMode = 'Vertical';
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    const groupOptions = { showGroupedColumn: true };
    const filterOptions = { type: 'Excel' };

    // Set the adaptive dialog target and pager styling during grid load.
    function load() {
        this.adaptiveDlgTarget = document.getElementsByClassName('e-mobile-content')[0];
        if (this.pageSettings.pageSizes) {
            document.querySelector('.e-adaptive-demo')?.classList.add('e-pager-pagesizes');
        }
        else {
            document.querySelector('.e-adaptive-demo')?.classList.remove('e-pager-pagesizes');
        }
    }

    // Trigger grid export actions from toolbar commands.
    function toolbarClick(args) {
        switch (args.item.id) {
            case grid.element.id + '_pdfexport':
                grid.pdfExport();
                break;
            case grid.element.id + '_excelexport':
                grid.excelExport();
                break;
        }
    }
    return (<div className='control-pane'>
        <div className='control-section'>
            <style>
                {SAMPLE_CSS}
            </style>
            <div className="adaptive-grid-column col-md-9 e-bigger e-adaptive-demo">
                {/* Show the mobile device shell on desktop and the grid directly on devices. */}
                {!Browser.isDevice ? (<div className="e-mobile-layout">
                    <div className="e-mobile-content">
                        <GridComponent id="adaptivebrowser" editSettings={editSettings} dataSource={gridData} height='350px' ref={(g) => { grid = g; }} enableAdaptiveUI={true} rowRenderingMode={renderingMode} allowFiltering={true} allowSorting={true} allowGrouping={false} showColumnChooser={true} showColumnMenu={true} enableInfiniteScrolling={true} groupSettings={groupOptions} filterSettings={filterOptions} toolbar={toolbarOptions} pageSettings={{ pageCount: 3, pageSizes: true }} load={load} toolbarClick={toolbarClick} allowExcelExport={true} allowPdfExport={true}>
                            <ColumnsDirective>
                                {/* Column definitions for the adaptive grid. */}
                                {/* Primary order identifier column. */}
                                <ColumnDirective
                                    headerText="OrderID"
                                    field="OrderID"
                                    width={180}
                                    isPrimaryKey={true}
                                    validationRules={{ required: true }}
                                />
                                {/* Editable order status column. */}
                                <ColumnDirective
                                    headerText="Order Info"
                                    editType='dropdownedit'
                                    field='OrderStatus'
                                    width={150}
                                />


                                {/* Customer name column. */}
                                <ColumnDirective
                                    headerText="Customer"
                                    width={150}
                                    field='CustomerName'

                                />

                                {/* Shipping country column. */}
                                <ColumnDirective
                                    headerText="ShipCountry"
                                    field="ShipCountry"
                                    width={150}


                                />
                                {/* Shipping date column. */}
                                <ColumnDirective
                                    headerText="ShipDate"
                                    field="ShipDate"
                                    format={'dd/MM/yyyy'}
                                    validationRules={{ required: true }}
                                    type='date'
                                    editType='datepickeredit'
                                    width={150}

                                />


                            </ColumnsDirective>

                            <Inject services={[Filter, Sort, Group, Edit, Resize, Toolbar, Aggregate, Page, ExcelExport, PdfExport, ColumnChooser, ColumnMenu]} />
                        </GridComponent>
                    </div>
                </div>) : (<GridComponent id="adaptivebrowser" editSettings={editSettings} dataSource={gridData} height='350px' ref={(g) => { grid = g; }} enableAdaptiveUI={true} rowRenderingMode={renderingMode} allowFiltering={true} allowSorting={true} allowGrouping={false} showColumnChooser={true} showColumnMenu={true} enableInfiniteScrolling={true} groupSettings={groupOptions} filterSettings={filterOptions} toolbar={toolbarOptions} pageSettings={{ pageCount: 3, pageSizes: true }} load={load} toolbarClick={toolbarClick} allowExcelExport={true} allowPdfExport={true}>
                        
                    <ColumnsDirective>
                        {/* --------- Stacked header: Order Info --------- */}
                        <ColumnDirective
                            headerText="OrderID"
                            field="OrderID"
                            width={180}
                            isPrimaryKey={true}
                        />
                        <ColumnDirective
                            headerText="Order Info"
                            editType='dropdownedit'
                            field='OrderStatus'
                            width={150}

                        />


                        {/* --------- Stacked header: Customer Info --------- */}
                        <ColumnDirective
                            headerText="Customer"
                            width={150}
                            field='CustomerName'

                        />

                        {/* --------- Stacked header: Shipping --------- */}
                        <ColumnDirective
                            headerText="ShipCountry"
                            field="ShipCountry"
                            width={150}

                        />
                        <ColumnDirective
                            headerText="ShipDate"
                            field="ShipDate"
                            format={'dd/MM/yyyy'}
                            type='date'
                            width={150}
                            editType='datepickeredit'
                        />


                    </ColumnsDirective>

                    <Inject services={[Filter, Sort, Group, Edit, Toolbar, Aggregate, InfiniteScroll, ExcelExport, PdfExport, ColumnChooser, ColumnMenu]} />
                </GridComponent>)}
            </div>
        </div>
    </div>);
}
export default Adaptive;
