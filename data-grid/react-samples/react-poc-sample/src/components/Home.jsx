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
const resourceLinks = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M7.5 14.5L14.5 10L7.5 5.5V14.5ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#005FAA" />
      </svg>
    ),
    title: 'Explore the Demos',
    description: 'See our UI components in action with real-world industry examples.',
    link: 'https://ej2.syncfusion.com/react/demos/',
    tone: 'blue',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M4 16H12V14H4V16ZM4 12H12V10H4V12ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H10L16 6V18C16 18.55 15.8042 19.0208 15.4125 19.4125C15.0208 19.8042 14.55 20 14 20H2ZM9 7V2H2V18H14V7H9ZM2 2V7V2V7V18V2Z" fill="#904C00" />
      </svg>
    ),
    title: 'Explore the Docs',
    description: 'Comprehensive guides and API references for every control.',
    link: 'https://ej2.syncfusion.com/react/documentation/introduction',
    tone: 'orange',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M18 8L16.75 5.25L14 4L16.75 2.75L18 0L19.25 2.75L22 4L19.25 5.25L18 8ZM18 22L16.75 19.25L14 18L16.75 16.75L18 14L19.25 16.75L22 18L19.25 19.25L18 22ZM8 19L5.5 13.5L0 11L5.5 8.5L8 3L10.5 8.5L16 11L10.5 13.5L8 19Z" fill="#0078D4" />
      </svg>
    ),
    title: 'AI Prompting',
    description: 'Harness the power of AI with our curated integration patterns.',
    link: 'https://ej2.syncfusion.com/react/documentation/ai-tools/ai-powered-development',
    tone: 'cyan',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
        <path d="M2 18H15V13.4L16.125 12.85C16.3917 12.7167 16.6042 12.5333 16.7625 12.3C16.9208 12.0667 17 11.8 17 11.5C17 11.2167 16.9208 10.9542 16.7625 10.7125C16.6042 10.4708 16.3917 10.2833 16.125 10.15L15 9.625V5H10.2L9.95 3.3C9.9 2.93333 9.7375 2.625 9.4625 2.375C9.1875 2.125 8.86667 2 8.5 2C8.11667 2 7.7875 2.125 7.5125 2.375C7.2375 2.625 7.075 2.93333 7.025 3.3L6.775 5H2V7.15C2.93333 7.5 3.66667 8.06667 4.2 8.85C4.73333 9.63333 5 10.5167 5 11.5C5 12.5 4.73333 13.3917 4.2 14.175C3.66667 14.9583 2.93333 15.525 2 15.875V18ZM2 20C1.43333 20 0.958333 19.8083 0.575 19.425C0.191667 19.0417 0 18.5667 0 18V14.2C0.8 14.2 1.5 13.9458 2.1 13.4375C2.7 12.9292 3 12.2833 3 11.5C3 10.7333 2.7 10.1 2.1 9.6C1.5 9.1 0.8 8.83333 0 8.8V5C0 4.45 0.195833 3.97917 0.5875 3.5875C0.979167 3.19583 1.45 3 2 3H5.05C5.16667 2.15 5.55 1.4375 6.2 0.8625C6.85 0.2875 7.61667 0 8.5 0C9.36667 0 10.125 0.2875 10.775 0.8625C11.425 1.4375 11.8167 2.15 11.95 3H15C15.55 3 16.0208 3.19583 16.4125 3.5875C16.8042 3.97917 17 4.45 17 5V8.35C17.6 8.65 18.0833 9.08333 18.45 9.65C18.8167 10.2167 19 10.8333 19 11.5C19 12.1833 18.8167 12.8083 18.45 13.375C18.0833 13.9417 17.6 14.3667 17 14.65V18C17 18.5667 16.8042 19.0417 16.4125 19.425C16.0208 19.8083 15.55 20 15 20H2Z" fill="#5E5E5E" />
      </svg>
    ),
    title: 'React UI Components',
    description: 'Access 80+ high-performance React components today for faster development.',
    link: 'https://www.syncfusion.com/react-components',
    tone: 'gray',
  },
];

/* --------------------------------------------------------
 * Individual Header Template Functions
 * ----------------------------------------------------- */


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




function freightHeaderTemplate() {
  return (
    <div>
      <span className="e-icons e-money" aria-hidden="true" />
      <span>Freight</span>
    </div>
  );
}

function statusHeaderTemplate() {
  return (
    <div>
      <span className="e-icons e-bolt" aria-hidden="true" />
      <span>Status</span>
    </div>
  );
}

function priorityHeaderTemplate() {
  return (
    <div>
      <span className="e-icons e-circle-check e-icons" aria-hidden="true" />
      <span>Priority</span>
    </div>
  );
}

function verifiedHeaderTemplate() {
  return (
    <div>
      <span className="e-circle-check e-icons" aria-hidden="true" />
      <span>Verified</span>
    </div>
  );
}
/* --------------------------------------------------------
 * Status, Priority & Payment visual configuration
 * ----------------------------------------------------- */

/* Order status: plain muted text with a small leading icon (no fill) */
const orderStatusMap = {
  Pending: { color: '#64748b', icon: 'e-icons e-clock' },
  Shipped: { color: '#2563eb', icon: 'e-icons e-box' },
  Delivered: { color: '#059669', icon: 'e-icons e-check' },
  Processing: { color: '#4f46e5', icon: 'e-icons e-repeat' },
  Cancelled: { color: '#dc2626', icon: 'e-icons e-close' },
};

/* Priority: outline pill — white background, colored border + text */
const priorityMap = {
  Low: { color: '#1a8245', border: '#bfe6cc' },
  Medium: { color: '#b45309', border: '#f5d9a8' },
  High: { color: '#c2410c', border: '#f6c6a6' },
  Critical: { color: '#dc2626', border: '#f5b9b9' },
};

/* Payment status: filled pill badge with icon */
const paymentStatusMap = {
  Paid: { color: '#059669', bg: '#e3f6e8', icon: 'e-icons e-check' },
  Pending: { color: '#b45309', bg: '#fff4e0', icon: 'e-icons e-clock' },
};

/* Avatar palette cycles by name length so colors stay consistent per row */
const avatarPalette = [
  { bg: '#e3f6e8', color: '#1a8245' },
  { bg: '#e6f0ff', color: '#2563eb' },
  { bg: '#fff4e0', color: '#b45309' },
  { bg: '#f3e8ff', color: '#7c3aed' },
  { bg: '#ffe9dd', color: '#c2410c' },
];

const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');

/* Shared reset applied to every template's outer wrapper.
 * The grid sets a line-height on .e-rowcell equal to the active rowHeight
 * (e.g. 28 / 40 / 52px). Inline text inherits that line-height, so a single
 * <span> can end up as tall as the whole row — stacking two of them (name +
 * email) then overlaps into the next row. Resetting line-height to 'normal'
 * and controlling height explicitly on each badge/wrapper fixes both the
 * overlap and the inconsistent pill sizing. */
const cellReset = { lineHeight: 'normal' };

/* Order status template — plain text + icon, no background fill */
const OrderStatusTemplate = (props) => {
  const s = orderStatusMap[props.OrderStatus] || orderStatusMap.Pending;
  return (
    <div style={{ ...cellReset, display: 'inline-flex', alignItems: 'center', gap: '6px', height: '26px', color: s.color, fontWeight: '500', fontSize: '13px' }}>
      <span className={s.icon} aria-hidden="true" style={{ fontSize: '14px', lineHeight: 'normal' }} />
      <span style={{ lineHeight: 'normal' }}>{props.OrderStatus}</span>
    </div>
  );
};

/* Priority template — outline pill badge, fixed size regardless of text length */
const PriorityTemplate = (props) => {
  const p = priorityMap[props.Priority] || priorityMap.Low;
  return (
    <div
      style={{
        ...cellReset,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '92px',
        height: '26px',
        boxSizing: 'border-box',
        borderRadius: '999px',
        background: '#ffffff',
        color: p.color,
        border: `1.5px solid ${p.border}`,
        fontWeight: '600',
        fontSize: '12.5px',
      }}
    >
      {props.Priority}
    </div>
  );
};

/* Payment status template — filled pill with icon, fixed size */
const PaymentStatusTemplate = (props) => {
  const s = paymentStatusMap[props.PaymentStatus] || paymentStatusMap.Pending;
  return (
    <div
      style={{
        ...cellReset,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        width: '104px',
        height: '26px',
        boxSizing: 'border-box',
        borderRadius: '999px',
        background: s.bg,
        color: s.color,
        fontWeight: '600',
        fontSize: '12.5px',
      }}
    >
      <span className={s.icon} aria-hidden="true" style={{ fontSize: '13px', lineHeight: 'normal' }} />
      <span style={{ lineHeight: 'normal' }}>{props.PaymentStatus}</span>
    </div>
  );
};

/* Customer template — avatar with initials, name + email link stacked.
 * Explicit line-height + a constrained, vertically-centered flex column
 * keeps the two lines from bleeding into neighboring rows. */
const CustomerTemplate = (props) => {
  const name = props.CustomerName || '';
  const initials = getInitials(name);
  const palette = avatarPalette[name.length % avatarPalette.length];
  return (
    <div style={{ ...cellReset, display: 'flex', alignItems: 'center', gap: '10px', }}>
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: palette.bg,
          color: palette.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '11px',
          lineHeight: 'normal',
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1px', minWidth: 0, overflow: 'hidden' }}>
        <span
          style={{
            fontWeight: '600',
            fontSize: '13px',
            lineHeight: '1.3',
            color: '#1f2937',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </span>
        <a
          href={`mailto:${props.Email}`}
          style={{
            fontSize: '11.5px',
            lineHeight: '1.3',
            color: '#2563eb',
            textDecoration: 'underline',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {props.Email}
        </a>
      </div>
    </div>
  );
};


export default function Home() {
  const gridRef = useRef(null);
  const dropRef = useRef(null);
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
    <div className="home-page" aria-label="Syncfusion workspace home">

      <div className="workspace-content">

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
          height="340"
          width="1400"
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
                  disableHtmlEncode: true,
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
                  filter: { type: 'Menu' },
                  type: 'date',
                  editType: 'datepickeredit',
                  disableHtmlEncode: true,
                },
                {
                  field: 'ShipFee',
                  headerText: 'ShipFee',
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

    </div>
  );
}
