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

/* --------------------------------------------------------
 * Dialog Edit Template for Grid Editing
 * Uses Syncfusion components with id matching column field names
 * ----------------------------------------------------- */
function EditDialogTemplate(props) {
  const editDialogStyle = {
    padding: '20px',
    overflowY: 'hidden',
    backgroundColor: '#fafafa',
    borderRadius: '8px'
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginBottom: '12px'
  };

  const sectionTitleStyle = {
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '12px',
    marginTop: '8px',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    padding: '8px 12px',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const fieldLabelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
    letterSpacing: '0.3px'
  };

  return (
    <div className="e-dialog-edit-template" style={editDialogStyle}>
      {/* Order Information Section */}
      <h4 style={sectionTitleStyle}>Order Information</h4>
      <div style={rowStyle}>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Order ID</label>
          <TextBoxComponent id="OrderID" name="OrderID" type="text" value={props.OrderID || ''} disabled={!props.isAdd} floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Customer Name</label>
          <TextBoxComponent id="CustomerName" name="CustomerName" type="text" placeholder="Customer Name" value={props.CustomerName || ''} floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Email</label>
          <TextBoxComponent id="Email" name="Email" type="email" placeholder="Email" value={props.Email || ''} floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Order Date</label>
          <DatePickerComponent id="OrderDate" name="OrderDate" value={props.OrderDate} placeholder="Select date" floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Ship Date</label>
          <DatePickerComponent id="ShipDate" name="ShipDate" value={props.ShipDate} placeholder="Select date" floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Customer ID</label>
          <TextBoxComponent id="CustomerID" name="CustomerID" type="text" value={props.CustomerID || ''} disabled floatLabelType="Never" />
        </div>
      </div>

      {/* Product Information Section */}
      <h4 style={sectionTitleStyle}>Product Information</h4>
      <div style={rowStyle}>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Product Name</label>
          <TextBoxComponent id="ProductName" name="ProductName" type="text" placeholder="Product Name" value={props.ProductName || ''} floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Category</label>
          <TextBoxComponent id="Category" name="Category" type="text" placeholder="Category" value={props.Category || ''} floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Quantity</label>
          <NumericTextBoxComponent id="Quantity" name="Quantity" value={props.Quantity || 0} min={0} format="N2" placeholder="Quantity" floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Unit Price ($)</label>
          <NumericTextBoxComponent id="UnitPrice" name="UnitPrice" value={props.UnitPrice || 0} min={0} format="c2" placeholder="Unit Price" floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Discount (%)</label>
          <NumericTextBoxComponent id="Discount" name="Discount" value={props.Discount || 0} min={0} max={100} format="N2" placeholder="Discount" floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Tax (%)</label>
          <NumericTextBoxComponent id="Tax" name="Tax" value={props.Tax || 0} min={0} max={100} format="N2" placeholder="Tax" floatLabelType="Never" />
        </div>
      </div>

      {/* Shipping Information Section */}
      <h4 style={sectionTitleStyle}>Shipping Information</h4>
      <div style={rowStyle}>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Ship Address</label>
          <TextBoxComponent id="ShipAddress" name="ShipAddress" type="text" placeholder="Ship Address" value={props.ShipAddress || ''} floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Ship City</label>
          <TextBoxComponent id="ShipCity" name="ShipCity" type="text" placeholder="Ship City" value={props.ShipCity || ''} floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Ship State</label>
          <TextBoxComponent id="ShipState" name="ShipState" type="text" placeholder="Ship State" value={props.ShipState || ''} floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Postal Code</label>
          <TextBoxComponent id="ShipPostalCode" name="ShipPostalCode" type="text" placeholder="Postal Code" value={props.ShipPostalCode || ''} floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Country</label>
          <TextBoxComponent id="ShipCountry" name="ShipCountry" type="text" placeholder="Country" value={props.ShipCountry || ''} floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Phone</label>
          <TextBoxComponent id="Phone" name="Phone" type="text" placeholder="Phone" value={props.Phone || ''} floatLabelType="Never" />
        </div>
      </div>

      {/* Status & Priority Section */}
      <h4 style={sectionTitleStyle}>Status & Priority</h4>
      <div style={rowStyle}>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Order Status</label>
          <DropDownListComponent id="OrderStatus" name="OrderStatus" value={props.OrderStatus} dataSource={['Pending', 'Ready To Ship', 'Shipped', 'Delivered', 'Canceled', 'In Transit', 'Out For Delivery']} placeholder="Select status" floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Priority</label>
          <DropDownListComponent id="Priority" name="Priority" value={props.Priority} dataSource={['Low', 'Medium', 'High', 'Critical']} placeholder="Select priority" floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Warehouse</label>
          <DropDownListComponent id="Warehouse" name="Warehouse" value={props.Warehouse} dataSource={['WH-A', 'WH-B', 'WH-C', 'WH-D']} placeholder="Select warehouse" floatLabelType="Never" />
        </div>
      </div>

      {/* Payment Information Section */}
      <h4 style={sectionTitleStyle}>Payment</h4>
      <div style={rowStyle}>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Payment Method</label>
          <DropDownListComponent id="PaymentMethod" name="PaymentMethod" value={props.PaymentMethod} dataSource={['Card', 'Digital', 'Cash']} placeholder="Select method" floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Payment Status</label>
          <DropDownListComponent id="PaymentStatus" name="PaymentStatus" value={props.PaymentStatus} dataSource={['Paid', 'Pending', 'Refunded']} placeholder="Select status" floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Inventory Count</label>
          <NumericTextBoxComponent id="InventoryCount" name="InventoryCount" value={props.InventoryCount || 0} min={0} format="N2" placeholder="Inventory" floatLabelType="Never" />
        </div>
      </div>

      {/* Amount Summary Section */}
      <h4 style={sectionTitleStyle}>Amount Summary</h4>
      <div style={rowStyle}>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Gross Amount ($)</label>
          <NumericTextBoxComponent id="GrossAmount" name="GrossAmount" value={props.GrossAmount || 0} format="c2" disabled floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Discount Amount ($)</label>
          <NumericTextBoxComponent id="DiscountAmount" name="DiscountAmount" value={props.DiscountAmount || 0} format="c2" disabled floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Subtotal ($)</label>
          <NumericTextBoxComponent id="SubTotal" name="SubTotal" value={props.SubTotal || 0} format="c2" disabled floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Tax Amount ($)</label>
          <NumericTextBoxComponent id="TaxAmount" name="TaxAmount" value={props.TaxAmount || 0} format="c2" disabled floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Ship Fee ($)</label>
          <NumericTextBoxComponent id="ShipFee" name="ShipFee" value={props.ShipFee || 0} min={0} format="c2" placeholder="Ship Fee" floatLabelType="Never" />
        </div>
        <div style={fieldGroupStyle}>
          <label style={fieldLabelStyle}>Total Amount ($)</label>
          <NumericTextBoxComponent id="TotalAmount" name="TotalAmount" value={props.TotalAmount || 0} format="c2" disabled floatLabelType="Never" />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------
 * Main Grid Component
 * ----------------------------------------------------- */
export default function Grid() {
  var scrollNextSet = false;
  const gridRef = useRef(null);
  const dropRef = useRef(null);
  const seconGridRef = useRef(null);
  // Settings state
  const [rowHeight, setRowHeight] = useState('normal');
  const [selectionMode, setSelectionMode] = useState('Row');

  // Row height mapping
  const rowHeightMap = {
    compact: 32,
    relaxed: 55,
    normal: 47,
  };
  const secondGridQuery = new Query().where('OrderStatus', 'equal', 'Delivered')
  const firstGridQuery = new Query().where('OrderStatus', 'notequal', 'Delivered')

  // Dropdown data
  const rowHeightData = [
    { text: 'Small', value: 'compact' },
    { text: 'Medium', value: 'normal' },
    { text: 'Large', value: 'relaxed' },

  ];


  // Handlers
  const onRowHeightChange = (e) => {

    gridRef.current.setProperties({ rowHeight: rowHeightMap[e.value] }, true)

    gridRef.current.freezeRefresh();


  };

  const onSelectionModeChange = (e) => {
    setSelectionMode(e.value);
  };

  const onDataCountChange = (e) => {
    setDataCount(e.value);
    setDataSource(makeData(e.value));
  };
  const rowHeightTemplate = () => (
    <div>
      <label>Row Height:    </label>

      <DropDownListComponent
        ref={dropRef}
        dataSource={rowHeightData}
        fields={{ text: 'text', value: 'value' }}
        // value={}
        change={onRowHeightChange}
      />
    </div>
  );

  const toolbar = [
    'Edit',
    'Delete',
    'Update',
    'Cancel',
    { type: 'Separator' },

  ];



  const filterSettings = { type: 'Excel' };
  const selectionSettings = { type: 'Multiple', mode: selectionMode, persistSelection: true };
  const sortSettings = { columns: [] };
  const editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog', template: EditDialogTemplate };
  const pageSettings = { pageSize: 50 };

  

  const toolbarClick = (args) => {
    const grid = gridRef.current;
    if (!grid) return;
    switch (args.item.id) {
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


  // const [scrollNextset,setscrollNextset]=

  return (
    <div
      style={{
        width: '100%',
        overflow: 'auto'
      }}
    >
      {/* Left Grid */}
      <div
        style={{
          float: 'left',
          width: '49%',
          padding: '10px'
        }}
      >
        <h3>Order Pending Grid</h3>
        <br/>
        <GridComponent
          id="orders-grid"
          className="fill-grid"
          ref={gridRef}
          query={firstGridQuery}
          dataSource={gridData}
          columnMenuItems={['AutoFit', 'Group', 'Ungroup', 'SortAscending', 'SortDescending', 'Filter']}
          load={(args) => {
            args.enableSeamlessScrolling = true;
          }
          }
          height="370"
          width="100%"
          allowSorting
          allowMultiSorting
          allowFiltering
          filterSettings={filterSettings}

          allowReordering
          allowResizing
          showColumnMenu

          allowSelection
          selectionSettings={selectionSettings}
          editSettings={editSettings}
          allowRowDragAndDrop={true}
          rowDropSettings={{ targetID: "second-grid" }}
          rowDrop={(args) => {
            args.cancel = true
            for (let i = 0; i < args.data.length; i++) {
              gridRef.current.deleteRecord('OrderID', args.data[i])
              args.data[i].OrderStatus = "Delivered";
              seconGridRef.current.addRecord(args.data[i], 0);
            }
          }
          }

          toolbar={toolbar}
          toolbarClick={toolbarClick}
          sortSettings={sortSettings}
          pageSettings={pageSettings}
          enableVirtualization={true}
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
                },
                {
                  field: 'OrderDate',
                  headerTemplate: orderDateHeaderTemplate,
                  filter: { type: 'Menu' },
                   editType: 'datepickeredit',
                  format: 'yMd',
                  type: 'date',
                  width: 170,
                  textAlign: 'Left',
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
                  template: CustomerTemplate,
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
                  editType:'dropdownedit',
                  clipMode: 'Ellipsis',
                  disableHtmlEncode: true,
                },
                {
                  field: 'ShipDate',
                  headerText: 'Ship Date',
                  width: 180,
                  headerTemplate: shippedDateHeaderTemplate,
                  format: 'yMd',
                   editType: 'datepickeredit',
                  textAlign: 'Right',
                  filter: { type: 'Menu' },
                  type: 'date',
                  disableHtmlEncode: true,
                },

              ]}
            />


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
      <div
        style={{
          float: 'right',
          width: '49%',
          padding: '10px'
        }}
      >
        <h3>Order Completed Grid</h3>
        <br/>
        <GridComponent
          id="second-grid"
          className="fill-grid"
          ref={seconGridRef}
          dataSource={gridData}
          query={secondGridQuery}
          editSettings={{ allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Cell'}}
          columnMenuItems={['AutoFit', 'Group', 'Ungroup', 'SortAscending', 'SortDescending', 'Filter']}

          height="350"
          width="100%"
          rowHeight={rowHeightMap.normal}
          allowSorting
          allowMultiSorting
          allowFiltering
          filterSettings={filterSettings}


          allowSelection
          selectionSettings={{ type: 'Multiple', mode:'Cell' }}

          allowRowDragAndDrop={true}

          toolbar={toolbar}
          toolbarClick={toolbarClick}
          sortSettings={sortSettings}
          pageSettings={{ pageSize: 12 }}

          // allowRowDragAndDrop
          allowPaging={true}

          allowExcelExport
          allowPdfExport
        >
          <ColumnsDirective>
            {/* --------- Stacked header: Order Info --------- */}
            <ColumnDirective
              headerText="OrderID"
              field="OrderID"
              width={180}
              freeze={"Left"}
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
                  allowEditing: false,
                  disableHtmlEncode: true,
                },
                {
                  field: 'OrderDate',
                  headerTemplate: orderDateHeaderTemplate,
                  filter: { type: 'Menu' },
                  format: 'dd/MM/yyyy',
                  type: 'date',
                  editType: 'datepickeredit',
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
                  template: CustomerTemplate,
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
                  editType:'dropdownedit',
                  clipMode: 'Ellipsis',
                  disableHtmlEncode: true,
                },
                {
                  field: 'ShipDate',
                  headerText: 'Ship Date',
                  width: 180,
                  editType: 'datepickeredit',
                  headerTemplate: shippedDateHeaderTemplate,
                  format: 'yMd',
                  textAlign: 'Right',
                  filter: { type: 'Menu' },
                  type: 'date',
                  disableHtmlEncode: true,
                },

              ]}
            />
            <ColumnDirective
              field="Rating"
              width={100}
              textAlign='Center'
              freeze={'Right'}
            />


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