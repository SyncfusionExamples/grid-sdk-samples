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
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { Browser, isNullOrUndefined,extend, setValue, getValue } from "@syncfusion/ej2-base";
import { SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { NumericTextBoxComponent, TextBoxComponent, UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Query } from '@syncfusion/ej2-data';
import * as XLSX from 'xlsx';

import { gridData } from '../data/virtualData';

const createDecoratedHeader = (iconClass, label, accentColor = '#2563eb') => {
  return () => (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '0 16px 0 10px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(239,246,255,0.96))',
        border: `1px solid ${accentColor}35`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(37, 99, 235, 0.08)',
        color: '#0f172a',
        fontWeight: 700,
        letterSpacing: '0.02em',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '22px',
          height: '22px',
          borderRadius: '7px',
          background: accentColor,
          color: '#fff',
          fontSize: '11px',
          boxShadow: '0 4px 10px rgba(37, 99, 235, 0.18)',
          flexShrink: 0,
        }}
        className={iconClass}
        aria-hidden="true"
      />
      <span
        style={{
          display: 'block',
          flex: '1 1 auto',
          minWidth: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '13px',
          lineHeight: 1.2,
          textAlign: 'center',
        }}
        title={label}
      >
        {label}
      </span>
      
    </div>
  );
};

const customerNameHeaderTemplate = createDecoratedHeader('e-icons e-people', 'Customer', '#7c3aed');
const orderDateHeaderTemplate = createDecoratedHeader('e-icons e-timeline-today', 'Order Date', '#2563eb');
const shippedDateHeaderTemplate = createDecoratedHeader('e-icons e-timeline-today', 'Ship Date', '#0ea5e9');

function createDateFilterTemplate(filterDate) {
  let dateElement;

  return {
    create: () => {
      dateElement = document.createElement('input');
      return dateElement;
    },
    write: (args) => {
      const datePicker = new DatePicker({
        value: args.value,
        change: (changeArgs) => filterDate(args.column.field, changeArgs.value),
      });
      datePicker.appendTo(dateElement);
    },
  };
}

function createDropdownFilterTemplate(filterValue, options) {
  let dropdownElement;

  return {
    create: () => {
      dropdownElement = document.createElement('input');
      return dropdownElement;
    },
    write: (args) => {
      const dropdown = new DropDownList({
        dataSource: ['All', ...options],
        value: args.value || 'All',
        change: (changeArgs) => {
          filterValue(args.column.field, changeArgs.value);
        },
      });
      dropdown.appendTo(dropdownElement);
    },
  };
}

function parseExcelSheet(sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const headerRowIndex = rows.findIndex((row) => row.includes('OrderID'));
  if (headerRowIndex < 0) return [];

  const fieldMap = {
    OrderID: 'OrderID',
    'Order Status': 'OrderStatus',
    OrderDate: 'OrderDate',
    Name: 'CustomerName',
    Phone: 'Phone',
    'Ship Details': 'ShipDetails',
    'Ship Country': 'ShipCountry',
    'Ship Date': 'ShipDate',
    'Ship Fee': 'ShipFee',
  };
  const headers = rows[headerRowIndex].map((header) => fieldMap[header] || header);

  return rows.slice(headerRowIndex + 1).filter((row) => row.some(Boolean)).map((row) => {
    return headers.reduce((record, field, index) => {
      if (field) record[field] = row[index];
      return record;
    }, {});
  });
}


export default function Home() {
  const gridRef = useRef(null);
  const selectGridRef = useRef(null);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [bulkUpdateField, setBulkUpdateField] = useState('');
  const [bulkUpdateValue, setBulkUpdateValue] = useState('');
  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [isSelectedRecordsDialogOpen, setIsSelectedRecordsDialogOpen] = useState(false);
  const [totalRecordCount, setTotalRecordCount] = useState(gridData.length);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isBatchEditMode, setIsBatchEditMode] = useState(false);

  const bulkUpdateFields = [
    { text: 'Order Status', value: 'OrderStatus' },
    { text: 'Customer Name', value: 'CustomerName' },
    { text: 'Phone', value: 'Phone' },
    { text: 'Ship Country', value: 'ShipCountry' },
    { text: 'Product Name', value: 'ProductName' },
    { text: 'Priority', value: 'Priority' },
    { text: 'Payment Method', value: 'PaymentMethod' },
    { text: 'Payment Status', value: 'PaymentStatus' },
  ];

  // Settings state

  const [selectionMode, setSelectionMode] = useState('Row');

  // Row height mapping
  const rowHeightMap = {
    compact: 32,
    relaxed: 55,
    normal: 47,
  };

  const isDevice = Browser.isDevice;
  const handleEditModeChange = (args) => {
    const mode = args.checked ? 'Batch' : 'Normal';
    setIsBatchEditMode(args.checked);
    if (gridRef.current) {
      gridRef.current.editSettings.mode = mode;
    }
  };

  const editModeToolbarTemplate = () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 8px' }}>
      <span>Batch Edit</span>
      <SwitchComponent checked={isBatchEditMode} change={handleEditModeChange} />
    </div>
  );

  const toolbar = isDevice ? ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ExcelExport',{ tooltipText: 'Bind from Excel', id: 'bindFromExcel', prefixIcon: 'e-icons e-export-xls' },
    { tooltipText: 'View Selected Records', id: 'viewSelectedRecords', prefixIcon: 'e-icons e-eye' }, 'PdfExport'] : [
    'Add',
    'Edit',
    'Delete',
    'Update',
    'Cancel',
    { type: 'Separator' },
    'ExcelExport',
    'PdfExport',
    { type: 'Separator' },
    {  tooltipText: 'Bind from Excel', id: 'bindFromExcel', prefixIcon: 'e-icons e-export-xls' },
    { tooltipText: 'View Selected Records', id: 'viewSelectedRecords', prefixIcon: 'e-icons e-eye' },
    { type: 'Separator' },
    {  tooltipText: 'Clear all filters', id: 'quickfilter', prefixIcon: 'e-icons e-filter-clear' },
    { tooltipText: 'Reset To Defaults', tooltipText: 'Clear filters / sort / group / selection', id: 'reset', prefixIcon: 'e-icons e-refresh' },
    
        { type: 'Separator' },
    { id: 'editMode',  template: editModeToolbarTemplate },
    
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


  const filterSettings = { type: 'FilterBar', showFilterBarOperator: true, };
  const selectionSettings = { type: 'Multiple', mode: 'Row', persistSelection: true };
  const sortSettings = { columns: [] };
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    ...(isDevice ? { mode: 'Dialog' } : {}),
  };
  const pageSettings = { pageSize: 50 };

  const groupSettings = { showDropArea: false,showToggleButton:true, showGroupedColumn: true };


  const filterDate = (field, value) => {
    const grid = gridRef.current;
    if (!grid) return;

    if (value) {
      grid.filterByColumn(field, 'equal', value);
    } else {
      grid.removeFilteredColsByField(field);
    }
  };

  const filterValue = (field, value) => {
    const grid = gridRef.current;
    if (!grid) return;

    if (value && value !== 'All') {
      grid.filterByColumn(field, 'equal', value);
    } else {
      grid.removeFilteredColsByField(field);
    }
  };

  const orderDateFilterTemplate = createDateFilterTemplate(filterDate);
  const shipDateFilterTemplate = createDateFilterTemplate(filterDate);
  const shipCountryFilterTemplate = createDropdownFilterTemplate(filterValue, ['USA', 'Canada', 'Mexico', 'UK']);
  const orderStatusFilterTemplate = createDropdownFilterTemplate(filterValue, ['Ready To Ship', 'In Transit', 'Delivered']);
  const priorityFilterTemplate = createDropdownFilterTemplate(filterValue, ['Low', 'Medium', 'High', 'Critical']);
  const paymentStatusFilterTemplate = createDropdownFilterTemplate(filterValue, ['Paid', 'Pending', 'Refunded']);

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
      case 'bindFromExcel':
        setExcelFile(null);
        setIsExcelDialogOpen(true);
        break;
      case 'viewSelectedRecords':
        setIsSelectedRecordsDialogOpen(true);
        break;

      default:
        if (args.item.id === grid.element.id + '_excelexport') grid.excelExport();
        else if (args.item.id === grid.element.id + '_pdfexport') grid.pdfExport({ allowHorizontalOverflow: false, pageOrientation: 'Landscape' });
        break;
    }
  };
  const gridCreated = (args) => {
    if (Browser.isDevice) {
      gridRef.current.hideColumns(['Total Amount', 'Tax Amount', 'Discount Amount', 'Product Name', 'Gross Amount', 'Name', 'Phone', 'Ship Fee', 'Ship Date', 'Ship Country', 'Ship Details'])
    }
  }
  const contextMenuClick = (args) => {
    if (args.item.id === 'bulkUpdate') {
      setBulkUpdateField('');
      setBulkUpdateValue('');
      setIsBulkUpdateOpen(true);
    }
  };

  const bulkCellUpdate = (
    field,
    value,
    rowData
  ) => {
    // Require a primary key; without one, persistence and cell refresh are not possible.
    const pkName = gridRef.current.getPrimaryKeyFieldNames()[0];
    if (isNullOrUndefined(pkName)) {
        return;
    }

    // Validate the field against grid columns.
    if (isNullOrUndefined(gridRef.current.getColumnByField(field))) {
        return;
    }

    // Determine the target records: use the passed rowData, otherwise selected records.
    const records = (rowData && rowData.length)
        ? rowData
        : gridRef.current.getSelectedRecords();

    const isValueArray = Array.isArray(value);

    // Single value -> update every record; array -> up to the array length only.
    const updateCount = isValueArray
        ? Math.min(value.length, records.length)
        : records.length;

    // Nothing to do when there are no records or no values (empty array).
    if (!updateCount) {
        return;
    }

    // Build the change-set to be persisted through the data module.
    const changes = {
        addedRecords: [],
        deletedRecords: [],
        changedRecords: []
    };

    const original = {
        addedRecords: [],
        deletedRecords: [],
        changedRecords: []
    };

    const valueArray = isValueArray ? value : null;
    const singleValue = isValueArray ? null : value;

    // Update only the resolved count of records.
    for (let i = 0; i < updateCount; i++) {
        const record = records[i];

        const cellValue = isValueArray
            ? valueArray[i]
            : singleValue;

        // Capture the original record (before modification) for persistence.
        original.changedRecords.push(
            extend({}, {}, record, true)
        );

        // Update the underlying record object directly.
        setValue(field, cellValue, record);

        // Track the modified record for persistence.
        changes.changedRecords.push(
            extend({}, {}, record, true)
        );

        // Refresh the rendered cell for the updated row.
        gridRef.current.setCellValue(
            getValue(pkName, record),
            field,
            cellValue
        );
    }

    // Persist the batch of changes through the data module.
    gridRef.current.getDataModule().saveChanges(changes, pkName, original);
}
  const handleBulkUpdateOk = () => {
    const grid = gridRef.current;
        if (!grid || !bulkUpdateField) return;
    console.log(bulkUpdateField, bulkUpdateValue)
    let selectedRecords = grid.getSelectedRecords();
    bulkCellUpdate(bulkUpdateField, bulkUpdateValue, selectedRecords);
    gridRef.current.freezeRefresh();
    setIsBulkUpdateOpen(false);

  };

  const handleBulkUpdateCancel = () => {
    setBulkUpdateField('');
    setBulkUpdateValue('');
    setIsBulkUpdateOpen(false);
  };


  const handleExcelBind = () => {
    const grid = gridRef.current;
    if (!grid) return;
    if(excelFile === null)
    {
       gridRef.current.changeDataSource(gridData, gridRef.current.getColumns());
       return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'array', cellDates: true });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const importedData = parseExcelSheet(firstSheet);

      grid.setProperties({ dataSource: importedData }, true);
      grid.freezeRefresh()
      setExcelFile(null);
      setIsExcelDialogOpen(false);
    };
    reader.readAsArrayBuffer(excelFile);
  };

  const handleExcelDialogCancel = () => {
    setExcelFile(null);
    setIsExcelDialogOpen(false);
  };

  const handleSelectedRecordsDialogClose = () => {
    setIsSelectedRecordsDialogOpen(false);
  };

  const handleSelectedRecordsDialogOpen = () => {
    selectGridRef.current.setProperties({ dataSource: gridRef.current.getSelectedRecords() }, true);
    selectGridRef.current.freezeRefresh();
  };

  const updateTotalRecordCount = () => {

    const dataSource = gridRef.current?.dataSource;
    const records = Array.isArray(dataSource)
      ? dataSource
      : dataSource?.json || dataSource?.result || [];
    setTotalRecordCount(Array.isArray(records) ? records.length : 0);
  };

  const path = {
    saveUrl: 'https://services.syncfusion.com/react/production/api/FileUploader/Save',
    removeUrl: 'https://services.syncfusion.com/react/production/api/FileUploader/Remove'
  };
  const dropElement = document.getElementsByClassName('control-fluid')[0];
  const parseExcel = (file) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      var workbook = XLSX.read(e.target.result, { type: 'array', cellDates: true });
      workbook.SheetNames.forEach((sheetName) => {
        var importedData = parseExcelSheet(workbook.Sheets[sheetName]);
        gridRef.current.changeDataSource(importedData, gridRef.current.getColumns());
      });
    };
    reader.readAsArrayBuffer(file.rawFile);
  };
  const onSuccess = (args) => {
    var files = args.file;
    if (files) {
      setExcelFile(files[0].rawFile);
    }

  }
  const onRemove = (args) => {
    console.log(args)
    setExcelFile(null);
   
  }

  return (

    <div className={`home-grid-parent`}>
      <DialogComponent
        width={isDevice ? '300px' : '360px'}
        header="Bulk Update"
        visible={isBulkUpdateOpen}
        showCloseIcon
        isModal
        close={handleBulkUpdateCancel}
        buttons={[
          {
            buttonModel: { content: 'Cancel' },
            click: handleBulkUpdateCancel,
          },
          {
            buttonModel: { content: 'OK', isPrimary: true },
            click: handleBulkUpdateOk,
          },
        ]}
      >
        <div style={{ display: 'grid', gap: '18px', padding: '8px 0' }}>
          <DropDownListComponent
            placeholder="Column Field"
            dataSource={bulkUpdateFields}
            fields={{ text: 'text', value: 'value' }}
            value={bulkUpdateField || null}
            change={(args) => setBulkUpdateField(args.value || '')}
            floatLabelType="Always"
          />
          <TextBoxComponent
            placeholder="Enter Value"
            value={bulkUpdateValue}
            input={(args) => setBulkUpdateValue(args.value || '')}
            floatLabelType="Always"
          />
        </div>
      </DialogComponent>
      <DialogComponent
        width={isDevice ? '320px' : '420px'}
        header="Bind from Excel"
        visible={isExcelDialogOpen}
        content={() => {
          return (
            <UploaderComponent asyncSettings={path} removing={onRemove} dropArea={dropElement} change={onSuccess}></UploaderComponent>)
        }
        }
        showCloseIcon
        isModal
        close={handleExcelDialogCancel}
        buttons={[
          {
            buttonModel: { content: 'Cancel' },
            click: handleExcelDialogCancel,
          },
          {
            buttonModel: { content: 'OK', isPrimary: true, disabled: !excelFile },
            click: handleExcelBind,
          },
        ]}
      >

      </DialogComponent>


      <DialogComponent
        width={isDevice ? '280px' : '720px'}
        header="Selected Records"
        visible={isSelectedRecordsDialogOpen}
        showCloseIcon
        isModal
        position={isDevice ? { X: 'center', Y: '100' } : { X: 'center', Y: 'center' }}

        beforeOpen={handleSelectedRecordsDialogOpen}
        content={() => {

          return <div>
            <GridComponent
              ref={selectGridRef}
              dataSource={selectedRecords}
              height={isDevice ? '260' : '320'}
              width="100%"
            >
              <ColumnsDirective>
                <ColumnDirective field="OrderID" headerText="Order ID" width="120" />
                <ColumnDirective field="OrderStatus" headerText="Order Status" width="140" />
                <ColumnDirective field="CustomerName" headerText="Customer" width="160" />
                <ColumnDirective field="ShipCountry" headerText="Ship Country" width="130" />
                <ColumnDirective field="OrderDate" headerText="Order Date" type="date" format="yMd" width="130" />
                <ColumnDirective field="ShipDate" headerText="Ship Date" type="date" format="yMd" width="130" />
                <ColumnDirective field="TotalAmount" headerText="Total Amount" format="C2" textAlign="Right" width="140" />
              </ColumnsDirective>
            </GridComponent></div>
          
        }}
        close={handleSelectedRecordsDialogClose}
        buttons={[{
          buttonModel: { content: 'Close' },
          click: handleSelectedRecordsDialogClose,
        }]}
      >
       
      </DialogComponent>

      <div className="total-record-count">
        Total records: {totalRecordCount}
      </div>
      <div className={`${isDevice ? ' e-bigger' : ''}`}>
      <GridComponent
        id="orders-grid"
        ref={gridRef}
        isRowPinned={(data)=>
        {
          if(data && !isDevice && data.Priority === 'Critical' && data.PaymentStatus === 'Paid' && data.OrderStatus !== 'Delivered')
          {
            return true;
          }
          return false;
        }
        }
        dataSource={gridData}
        dataBound={()=>
          {
            console.log('dataBound event triggered');
            updateTotalRecordCount()
          }
        }
        actionComplete={()=>
          {
              updateTotalRecordCount()
          }
        }
        columnMenuItems={['AutoFit', 'Group', 'Ungroup', 'SortAscending', 'SortDescending']}

        height={isDevice ? "400" : "200"}
        width="100%"
        rowHeight={isDevice ? undefined : rowHeightMap.normal}
        allowSorting
        allowMultiSorting
        allowFiltering
        filterSettings={filterSettings}
        enableAdaptiveUI={isDevice}
        rowRenderingMode={isDevice ? 'Vertical' : 'Horizontal'}
        adaptiveUIMode={isDevice ? 'Mobile' : 'Both'}
        allowGrouping={!isDevice}
        groupSettings={groupSettings}
        allowReordering={!isDevice}
        allowResizing={!isDevice}
        showColumnMenu={!isDevice}

        allowSelection
        selectionSettings={selectionSettings}
        editSettings={editSettings}

        toolbar={toolbar}
        toolbarClick={toolbarClick}
        sortSettings={sortSettings}
        pageSettings={pageSettings}
        enableInfiniteScrolling={true}
        allowExcelExport
        allowPdfExport
        contextMenuItems={isDevice ? [] : [
          'AutoFit', 'SortAscending', 'SortDescending',
          'Copy', 'Edit', 'Delete', 'Save', 'Cancel',
          'Group', 'Ungroup', 'PinRow', 'UnpinRow', { id: 'bulkUpdate', text: 'Bulk Update' }
        ]}
        contextMenuClick={contextMenuClick}
      >
        <ColumnsDirective>
          {/* --------- Stacked header: Order Info --------- */}
          <ColumnDirective
            headerText="OrderID"
            field="OrderID"
            width={180}
            isPrimaryKey={true}
            validationRules={{ required: true }}
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
                editType: 'dropdownedit',
                filterBarTemplate: orderStatusFilterTemplate,

              },
              {
                field: 'OrderDate',
                headerTemplate: orderDateHeaderTemplate,
                filter: { type: 'Menu' },
                format: 'yMd',
                editType: 'datepickeredit',
                visible:!isDevice,
                type: 'date',
                filterBarTemplate: orderDateFilterTemplate,
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
                visible:!isDevice,
                headerTemplate: customerNameHeaderTemplate,
                validationRules: { required: true },
                
              },
              {
                field: 'Phone',
                headerText: 'Phone',
                width: 170,
                visible:!isDevice,
                textAlign: 'Left',
                
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
                visible:!isDevice,
                
              },
              {
                field: 'ShipCountry',
                headerText: 'Ship Country',
                editType: 'dropdownedit',
                visible:!isDevice,
                filterBarTemplate: shipCountryFilterTemplate,
                width: 200,
                clipMode: 'Ellipsis',
                
              },
              {
                field: 'ShipDate',
                headerText: 'Ship Date',
                width: 180,
                visible:!isDevice,
                headerTemplate: shippedDateHeaderTemplate,
                format: 'yMd',
                textAlign: 'Right',
                validationRules: { required: true },
                filter: { type: 'Menu' },
                type: 'date',
                filterBarTemplate: shipDateFilterTemplate,
                editType: 'datepickeredit',
                
              },
              {
                field: 'ShipFee',
                headerText: 'Ship Fee',
                width: 180,
                visible:!isDevice,
                format: 'C2',
                editType: 'numericedit',
                textAlign: 'Right',
                type: 'number',
              },
            ]}
          />

          {/* Product Name */}
          <ColumnDirective
            field='ProductName'
            headerText='Product Name'
            width={250}
            editType='dropdownedit'

          />

          {/* Gross Amount */}
          <ColumnDirective
            field='GrossAmount'
            headerText='Gross Amount'
            width={160}
            visible={!isDevice}
            format='C2'
            textAlign='Right'
            filter={{ type: 'Menu' }}
            type='number'
          />

          {/* Discount Amount */}
          <ColumnDirective
            field='DiscountAmount'
            headerText='Discount Amount'
            width={180}
            format='C2'
            visible={!isDevice}
            editType='numericedit'
            textAlign='Right'
            filter={{ type: 'Menu' }}
            type='number'
          />

          {/* Tax Amount */}
          <ColumnDirective
            field='TaxAmount'
            headerText='Tax Amount'
            width={150}
            format='C2'
            visible={!isDevice}
            editType='numericedit'
            textAlign='Right'
            filter={{ type: 'Menu' }}
            type='number'
          />

          {/* Total Amount */}
          <ColumnDirective
            field='TotalAmount'
            headerText='Total Amount'
            width={160}
            editType='numericedit'
            format='C2'
            textAlign={isDevice ? 'Left' : 'Right'}
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
            filterBarTemplate={priorityFilterTemplate}
          />

          {/* Payment Method */}
          <ColumnDirective
            field='PaymentMethod'
            headerText='Payment Method'
            width={180}
            visible={!isDevice}
            editType='dropdownedit'
            disableHtmlEncode={true}
          />

          {/* Payment Status */}
          <ColumnDirective
            field='PaymentStatus'
            headerText='Payment Status'
            width={160}
            textAlign='Left'
            editType='dropdownedit'
            filterBarTemplate={paymentStatusFilterTemplate}
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
