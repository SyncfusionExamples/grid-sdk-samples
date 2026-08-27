import { Link } from 'react-router';
import { useRef, useState } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Freeze,
  Sort,
  VirtualScroll,
  Filter,
  Edit,
  Toolbar,
  Group,
  Reorder,
  Resize,
  RowDD,
  Selection,
  ExcelExport,
  PdfExport,
  Page,
  ContextMenu,
  ColumnChooser,
  ColumnMenu,
  InfiniteScroll,
} from '@syncfusion/ej2-react-grids';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { NumericTextBoxComponent, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { Query } from '@syncfusion/ej2-data';

import { gridData } from '../data/virtualData';

function customerNameHeaderTemplate() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span className="e-people e-icons" aria-hidden="true" />
      <span>Name</span>
    </div>
  );
}

function orderDateHeaderTemplate() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span className="e-timeline-today e-icons" aria-hidden="true" />
      <span>Order Date</span>
    </div>
  );
}

function shippedDateHeaderTemplate() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span className="e-icons e-timeline-today" aria-hidden="true" />
      <span>Shipped Date</span>
    </div>
  );
}


export default function Home() {
  const gridRef = useRef(null);

  // Settings state

  const [selectionMode, setSelectionMode] = useState('Row');

  // Row height mapping
  const rowHeightMap = {
    compact: 32,
    relaxed: 55,
    normal: 47,
  };

  const toolbar = [
    'Add',
    'Edit',
    'Delete',
    'Update',
    'Cancel',
    { type: 'Separator' },
    'ExcelExport',
    'PdfExport',
    { type: 'Separator' },
    { text: 'Clear Filter', tooltipText: 'Clear all filters', id: 'quickfilter', prefixIcon: 'e-icons e-filter-clear' },
    { text: 'Reset Defaults', tooltipText: 'Clear filters / sort / group / selection', id: 'reset', prefixIcon: 'e-icons e-refresh' },
    { type: 'Separator' },
    {
      prefixIcon: 'e-icons e-small-icon',
      id: 'big',
      align: 'Right',
      tooltipText: 'Row-height-big',
    },
    {
      prefixIcon: 'e-icons e-medium-icon',
      id: 'medium',
      align: 'Right',
      tooltipText: 'Row-height-medium',
    },
    {
      prefixIcon: 'e-icons e-big-icon',
      id: 'small',
      align: 'Right',
      tooltipText: 'Row-height-small',
    },

  ];


  const filterSettings = { type: 'Excel' };
  const selectionSettings = { type: 'Multiple', mode: selectionMode, persistSelection: true };
  const sortSettings = { columns: [] };
  const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
  const pageSettings = { pageSize: 50 };

  const groupSettings = { showDropArea: true, showGroupedColumn: true };

  const toolbarClick = (args) => {
    const grid = gridRef.current;
    if (!grid) return;

    switch (args.item.id) {
      case 'small':
        gridRef.current.setProperties({
          rowHeight: 30,
        }, true);
        gridRef.current.refresh();
        break;
      case 'medium':
        gridRef.current.setProperties({
          rowHeight: 45,
        }, true);
        gridRef.current.refresh();
        break;
      case 'big':
        gridRef.current.setProperties({
          rowHeight: 50,
        }, true);
        gridRef.current.refresh();
        break;
      case 'quickfilter':
        grid.clearFiltering();
        break;
      case 'reset':
        grid.query = new Query();
        grid.clearFiltering();
        grid.clearSorting();
        grid.clearGrouping();
        grid.searchSettings.key = '';
        grid.clearSelection();
        grid.pageSettings.currentPage = 1;
        grid.refresh();
        break;

      default:
        if (args.item.id === grid.element.id + '_excelexport') grid.excelExport();
        else if (args.item.id === grid.element.id + '_pdfexport') grid.pdfExport({ allowHorizontalOverflow: false, pageOrientation: 'Landscape' });
        break;
    }
  };
  return (

      <div className="home-grid-parent">
        <GridComponent
          id="orders-grid"

          ref={gridRef}
          dataSource={gridData}
          columnMenuItems={['AutoFit', 'Group', 'Ungroup', 'SortAscending', 'SortDescending', 'Filter']}
          isRowPinned={(data) => {
            if (data && data.Priority === 'Critical' && data.PaymentStatus === 'Paid') {
              return true
            }
          }
          }
          height="250"
          width="100%"
          rowHeight={rowHeightMap.normal}
          allowSorting
          allowMultiSorting
          allowFiltering
          filterSettings={filterSettings}
          allowGrouping
          groupSettings={groupSettings}
          allowReordering
          allowResizing
          showColumnMenu

          allowSelection
          selectionSettings={selectionSettings}
          editSettings={editSettings}
          allowRowDragAndDrop={true}
          rowDropSettings={{ targetID: "second-grid" }}

          toolbar={toolbar}
          toolbarClick={toolbarClick}
          sortSettings={sortSettings}
          pageSettings={pageSettings}
          enableInfiniteScrolling={true}
          allowExcelExport
          allowPdfExport
          contextMenuItems={[
            'AutoFit', 'SortAscending', 'SortDescending',
            'Copy', 'Edit', 'Delete', 'Save', 'Cancel',
            'Group', 'Ungroup',
          ]}
        >
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
              textAlign="Center"
              columns={[

                {
                  field: 'OrderStatus',
                  headerText: 'Order Status',
                  width: 170,
                  textAlign: 'Left',
                  editType:'dropdownedit',
                  editType:'dropdownedit',
                },
                {
                  field: 'OrderDate',
                  headerTemplate: orderDateHeaderTemplate,
                  filter: { type: 'Menu' },
                  format: 'yMd',
                  editType: 'datepickeredit',
                  type: 'date',
                  width: 170,
                  textAlign: 'Left',
                  disableHtmlEncode: true,
                },
              ]}

            />


            {/* --------- Stacked header: Customer Info --------- */}
            <ColumnDirective
              headerText="Customer"
              textAlign="Center"
              columns={[
                {
                  field: 'CustomerName',
                  headerText: 'Name',
                  width: 280,
                
                  headerTemplate: customerNameHeaderTemplate,
                  validationRules: { required: true },
                  disableHtmlEncode: true,
                },
                {
                  field: 'Phone',
                  headerText: 'Phone',
                  width: 170,
                  textAlign: 'Left',
                  disableHtmlEncode: true,
                },
              ]}
            />

            {/* --------- Stacked header: Shipping --------- */}
            <ColumnDirective
              headerText="Shipping"
              textAlign="Center"
              columns={[
                {
                  field: 'ShipDetails',
                  headerText: 'Ship Details',
                  width: 260,
                  
                  disableHtmlEncode: true,
                },
                {
                  field: 'ShipCountry',
                  headerText: 'Ship Country',
                  editType:'dropdownedit',
                  width: 200,
                  clipMode: 'Ellipsis',
                  disableHtmlEncode: true,
                },
                {
                  field: 'ShipDate',
                  headerText: 'Ship Date',
                  width: 180,
                  headerTemplate: shippedDateHeaderTemplate,
                  format: 'yMd',
                  textAlign: 'Right',
                   validationRules:{required: true},
                  filter: { type: 'Menu' },
                  type: 'date',
                  editType: 'datepickeredit',
                  disableHtmlEncode: true,
                },
                {
                  field: 'ShipFee',
                  headerText: 'Ship Fee',
                  width: 180,
                  format: 'C2',
                  editType:'numericedit',
                  textAlign: 'Right',
                  type: 'number',
                  disableHtmlEncode: true,
                },
              ]}
            />

            {/* Product Name */}
            <ColumnDirective
              field='ProductName'
              headerText='Product Name'
              width={250}
              disableHtmlEncode={true}
            />

            {/* Gross Amount */}
            <ColumnDirective
              field='GrossAmount'
              headerText='Gross Amount'
              width={160}
              format='C2'
              textAlign='Right'
              filter={{ type: 'Menu' }}
              type='number'
              disableHtmlEncode={true}
            />

            {/* Discount Amount */}
            <ColumnDirective
              field='DiscountAmount'
              headerText='Discount Amount'
              width={180}
              format='C2'
              editType='numericedit'
              textAlign='Right'
              filter={{ type: 'Menu' }}
              type='number'
              disableHtmlEncode={true}
            />

            {/* Tax Amount */}
            <ColumnDirective
              field='TaxAmount'
              headerText='Tax Amount'
              width={150}
              format='C2'
              editType='numericedit'
              textAlign='Right'
              filter={{ type: 'Menu' }}
              type='number'
              disableHtmlEncode={true}
            />

            {/* Total Amount */}
            <ColumnDirective
              field='TotalAmount'
              headerText='Total Amount'
              width={160}
              format='C2'
              textAlign='Right'
              filter={{ type: 'Menu' }}
              type='number'
              disableHtmlEncode={true}
            />

            {/* Priority */}
            <ColumnDirective
              field='Priority'
              headerText='Priority'
              width={130}
              editType={'dropdownedit'}
            />

            {/* Payment Method */}
            <ColumnDirective
              field='PaymentMethod'
              headerText='Payment Method'
              width={180}
              editType='dropdownedit'
              disableHtmlEncode={true}
            />

            {/* Payment Status */}
            <ColumnDirective
              field='PaymentStatus'
              headerText='Payment Status'
              width={160}
              textAlign='Center'
              editType='dropdownedit'
              disableHtmlEncode={true} />
          </ColumnsDirective>

          <Inject
            services={[
              ColumnChooser,
              VirtualScroll,
              ColumnMenu,
              Sort,
              Filter,
              Edit,
              Toolbar,
              Group,
              Reorder,
              Resize,
              RowDD,
              Selection,
              ExcelExport,
              PdfExport,
              Page,
              ContextMenu,
              Freeze,
              InfiniteScroll
            ]}
          />
        </GridComponent>
      </div>


  );
}
