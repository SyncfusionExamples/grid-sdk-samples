import { createRoot } from 'react-dom/client';

import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Filter, Sort, Group, Edit, Resize, Toolbar, Aggregate, Page, ExcelExport, PdfExport, ColumnChooser, ColumnMenu } from '@syncfusion/ej2-react-grids';
import { AggregateColumnsDirective, AggregateColumnDirective, AggregateDirective, AggregatesDirective } from '@syncfusion/ej2-react-grids';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { Browser } from "@syncfusion/ej2-base";
import { gridData } from '../data/virtualData'

import { PropertyPane } from './property-pane';

// custom code end
function Adaptive() {
    let hierarchyOrderdata = [
        {
            OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, OrderDate: new Date(8364186e5),
            ShipName: 'Vins et alcools Chevalier', ShipCity: 'Reims', ShipAddress: '59 rue de l Abbaye',
            ShipRegion: 'CJ', ShipPostalCode: '51100', ShipCountry: 'France', Freight: 32.38, Verified: !0
        },
        {
            OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, OrderDate: new Date(836505e6),
            ShipName: 'Toms Spezialitäten', ShipCity: 'Münster', ShipAddress: 'Luisenstr. 48',
            ShipRegion: 'CJ', ShipPostalCode: '44087', ShipCountry: 'Germany', Freight: 11.61, Verified: !1
        },
        {
            OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 2, OrderDate: new Date(8367642e5),
            ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
            ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 65.83, Verified: !0
        },
        {
            OrderID: 10251, CustomerID: 'VICTE', EmployeeID: 3, OrderDate: new Date(8367642e5),
            ShipName: 'Victuailles en stock', ShipCity: 'Lyon', ShipAddress: '2, rue du Commerce',
            ShipRegion: 'CJ', ShipPostalCode: '69004', ShipCountry: 'France', Freight: 41.34, Verified: !0
        },
        {
            OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 4, OrderDate: new Date(8368506e5),
            ShipName: 'Suprêmes délices', ShipCity: 'Charleroi', ShipAddress: 'Boulevard Tirou, 255',
            ShipRegion: 'CJ', ShipPostalCode: 'B-6000', ShipCountry: 'Belgium', Freight: 51.3, Verified: !0
        },
        {
            OrderID: 10253, CustomerID: 'HANAR', EmployeeID: 3, OrderDate: new Date(836937e6),
            ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
            ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 58.17, Verified: !0
        },
        {
            OrderID: 10254, CustomerID: 'CHOPS', EmployeeID: 5, OrderDate: new Date(8370234e5),
            ShipName: 'Chop-suey Chinese', ShipCity: 'Bern', ShipAddress: 'Hauptstr. 31',
            ShipRegion: 'CJ', ShipPostalCode: '3012', ShipCountry: 'Switzerland', Freight: 22.98, Verified: !1
        },
        {
            OrderID: 10255, CustomerID: 'RICSU', EmployeeID: 9, OrderDate: new Date(8371098e5),
            ShipName: 'Richter Supermarkt', ShipCity: 'Genève', ShipAddress: 'Starenweg 5',
            ShipRegion: 'CJ', ShipPostalCode: '1204', ShipCountry: 'Switzerland', Freight: 148.33, Verified: !0
        },
        {
            OrderID: 10256, CustomerID: 'WELLI', EmployeeID: 3, OrderDate: new Date(837369e6),
            ShipName: 'Wellington Importadora', ShipCity: 'Resende', ShipAddress: 'Rua do Mercado, 12',
            ShipRegion: 'SP', ShipPostalCode: '08737-363', ShipCountry: 'Brazil', Freight: 13.97, Verified: !1
        },
        {
            OrderID: 10257, CustomerID: 'HILAA', EmployeeID: 4, OrderDate: new Date(8374554e5),
            ShipName: 'HILARION-Abastos', ShipCity: 'San Cristóbal', ShipAddress: 'Carrera 22 con Ave. Carlos Soublette #8-35',
            ShipRegion: 'Táchira', ShipPostalCode: '5022', ShipCountry: 'Venezuela', Freight: 81.91, Verified: !0
        },
        {
            OrderID: 10258, CustomerID: 'ERNSH', EmployeeID: 1, OrderDate: new Date(8375418e5),
            ShipName: 'Ernst Handel', ShipCity: 'Graz', ShipAddress: 'Kirchgasse 6',
            ShipRegion: 'CJ', ShipPostalCode: '8010', ShipCountry: 'Austria', Freight: 140.51, Verified: !0
        },
        {
            OrderID: 10259, CustomerID: 'CENTC', EmployeeID: 7, OrderDate: new Date(8376282e5),
            ShipName: 'Centro comercial Moctezuma', ShipCity: 'México D.F.', ShipAddress: 'Sierras de Granada 9993',
            ShipRegion: 'CJ', ShipPostalCode: '05022', ShipCountry: 'Mexico', Freight: 3.25, Verified: !1
        },
        {
            OrderID: 10260, CustomerID: 'OTTIK', EmployeeID: 4, OrderDate: new Date(8377146e5),
            ShipName: 'Ottilies Käseladen', ShipCity: 'Köln', ShipAddress: 'Mehrheimerstr. 369',
            ShipRegion: 'CJ', ShipPostalCode: '50739', ShipCountry: 'Germany', Freight: 55.09, Verified: !0
        },
        {
            OrderID: 10261, CustomerID: 'QUEDE', EmployeeID: 2, OrderDate: new Date(8377146e5),
            ShipName: 'Que Delícia', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua da Panificadora, 12',
            ShipRegion: 'RJ', ShipPostalCode: '02389-673', ShipCountry: 'Brazil', Freight: 3.05, Verified: !1
        },
        {
            OrderID: 10262, CustomerID: 'RATTC', EmployeeID: 8, OrderDate: new Date(8379738e5),
            ShipName: 'Rattlesnake Canyon Grocery', ShipCity: 'Albuquerque', ShipAddress: '2817 Milton Dr.',
            ShipRegion: 'NM', ShipPostalCode: '87110', ShipCountry: 'USA', Freight: 48.29, Verified: !0
        }
    ];
    // custom code start
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
    let grid;
    let checkboxObj;
    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search', 'ColumnChooser', 'ExcelExport'];
    const renderingMode = 'Vertical';
    const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    const groupOptions = { showGroupedColumn: true };
    const validationRule = { required: true };
    const orderidRules = { required: true, number: true };
    const filterOptions = { type: 'Excel' };
    function onChange(e) {
        grid.rowRenderingMode = e.checked ? 'Horizontal' : 'Vertical';
        grid.allowGrouping = e.checked;
    }
    ;
    function footerSum(props) {
        return (<span>Sum: {props.Sum}</span>);
    }
    function footerAvg(props) {
        return (<span>Average: {props.Average}</span>);
    }
    function load() {
        this.adaptiveDlgTarget = document.getElementsByClassName('e-mobile-content')[0];
        if (this.pageSettings.pageSizes) {
            document.querySelector('.e-adaptive-demo')?.classList.add('e-pager-pagesizes');
        }
        else {
            document.querySelector('.e-adaptive-demo')?.classList.remove('e-pager-pagesizes');
        }
    }
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
                {!Browser.isDevice ? (<div className="e-mobile-layout">
                    <div className="e-mobile-content">
                        <GridComponent id="adaptivebrowser"  editSettings={editSettings} dataSource={gridData} height='350px' ref={(g) => { grid = g; }} enableAdaptiveUI={true} rowRenderingMode={renderingMode} allowFiltering={true} allowSorting={true} allowGrouping={false} showColumnChooser={true} showColumnMenu={true} allowPaging={true} groupSettings={groupOptions} filterSettings={filterOptions} toolbar={toolbarOptions} pageSettings={{ pageCount: 3, pageSizes: true }} load={load} toolbarClick={toolbarClick} allowExcelExport={true} allowPdfExport={true}>
                            <ColumnsDirective>
                                {/* --------- Stacked header: Order Info --------- */}
                                <ColumnDirective
                                    headerText="OrderID"
                                    field="OrderID"
                                    width={180}
                                    isPrimaryKey={true}
                                     validationRules={{required: true}}
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
                                     validationRules={{required: true}}
                                    type='date'
                                    editType='datepickeredit'
                                    width={150}

                                />


                            </ColumnsDirective>

                            <Inject services={[Filter, Sort, Group, Edit, Resize, Toolbar, Aggregate, Page, ExcelExport, PdfExport, ColumnChooser, ColumnMenu]} />
                        </GridComponent>
                    </div>
                </div>) : (<GridComponent id="adaptivedevice" editSettings={editSettings} dataSource={data} height='100%' ref={(g) => { grid = g; }} enableAdaptiveUI={true} rowRenderingMode={renderingMode} allowFiltering={true} allowSorting={true} allowGrouping={false} showColumnChooser={true} showColumnMenu={true} allowPaging={true} groupSettings={groupOptions} filterSettings={filterOptions} pageSettings={{ pageCount: 3, pageSizes: true }} load={load} toolbarClick={toolbarClick} allowExcelExport={true} allowPdfExport={true}>
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

                    <Inject services={[Filter, Sort, Group, Edit, Toolbar, Aggregate, Page, ExcelExport, PdfExport, ColumnChooser, ColumnMenu]} />
                </GridComponent>)}
            </div>
        </div>
    </div>);
}
export default Adaptive;
