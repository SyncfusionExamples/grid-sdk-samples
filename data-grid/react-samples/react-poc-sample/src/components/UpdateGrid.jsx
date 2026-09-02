import { useCallback, useRef, useState, useEffect } from 'react';
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
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { Browser, isNullOrUndefined, extend, setValue, getValue } from '@syncfusion/ej2-base';
import { TextBoxComponent, UploaderComponent, NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { AccordionComponent, AccordionItemDirective, AccordionItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Query, DataUtil } from '@syncfusion/ej2-data';
import * as XLSX from 'xlsx';

import { gridData } from '../data/virtualData';

// Creates a reusable header template with an icon and label.
const createDecoratedHeader = (iconClass, label) => {
  return () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className={iconClass} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};

const customerNameHeaderTemplate = createDecoratedHeader('e-icons e-people', 'Customer');
const orderDateHeaderTemplate = createDecoratedHeader('e-icons e-timeline-today', 'Order Date');
const shippedDateHeaderTemplate = createDecoratedHeader('e-icons e-timeline-today', 'Ship Date');


// Main grid page component that wires dialogs, filters, uploads, and grid actions.
export default function UpdateGrid() {
  const gridRef = useRef(null);
  const selectGridRef = useRef(null);

  const fieldFocusRef = useRef(null);
  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [isSelectedRecordsDialogOpen, setIsSelectedRecordsDialogOpen] = useState(false);
  const [dropElement, setDropElement] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // Capture the upload drop area once the component is mounted.
  useEffect(() => {
    const element = document.getElementsByClassName('control-fluid')[0];
    setDropElement(element || null);
  }, []);

  const updateSelectedData = useCallback(() => {
       const remainingSelectedRecords = gridRef.current?.getSelectedRecords?.() ?? [];

    if (!remainingSelectedRecords.length) {
      setSelectedRowData(null);
      return;
    }

    const records = remainingSelectedRecords;
    const firstRecord = records[0] ?? {};
    const mergedRecord = { ...firstRecord };
    const allKeys = new Set(Object.keys(firstRecord));

    records.slice(1).forEach((record) => {
      if (!record || typeof record !== 'object') return;
      Object.keys(record).forEach((key) => {
        if (!allKeys.has(key)) allKeys.add(key);
      });
    });

    Array.from(allKeys).forEach((key) => {
      const values = records
        .map((record) => (record && typeof record === 'object' ? record[key] : undefined))
        .filter((value) => value !== undefined);

      if (!values.length) {
        mergedRecord[key] = null;
        return;
      }

      const firstValue = values[0];
      const hasCommonValue = values.every((value) => {
        if (value === null || firstValue === null) return value === firstValue;
        if (typeof value === 'number' && typeof firstValue === 'number') return value === firstValue;
        if (typeof value === 'string' && typeof firstValue === 'string') return value === firstValue;
        if (value instanceof Date && firstValue instanceof Date) return value.getTime() === firstValue.getTime();
        return String(value) === String(firstValue);
      });

      mergedRecord[key] = hasCommonValue ? firstValue : null;
    });

    setSelectedRowData(mergedRecord);
  }, []);

  const handleRowSelected = useCallback((args) => {

    const selectedRecords = args?.data ?? args?.rowData ?? null;

    if (!selectedRecords) {
      setSelectedRowData(null);
      return;
    }

    const records = Array.isArray(selectedRecords) ? selectedRecords : [selectedRecords];
    if (!records.length) {
      setSelectedRowData(null);
      return;
    }

    const firstRecord = records[0] ?? {};
    const mergedRecord = { ...firstRecord };
    const allKeys = new Set(Object.keys(firstRecord));

    records.slice(1).forEach((record) => {
      if (!record || typeof record !== 'object') return;

      Object.keys(record).forEach((key) => {
        if (!allKeys.has(key)) {
          allKeys.add(key);
        }
      });
    });

    Array.from(allKeys).forEach((key) => {
      const values = records
        .map((record) => record && typeof record === 'object' ? record[key] : undefined)
        .filter((value) => value !== undefined);

      if (!values.length) {
        mergedRecord[key] = null;
        return;
      }

      const firstValue = values[0];
      const hasCommonValue = values.every((value) => {
        if (value === null || firstValue === null) {
          return value === firstValue;
        }

        if (typeof value === 'number' && typeof firstValue === 'number') {
          return value === firstValue;
        }

        if (typeof value === 'string' && typeof firstValue === 'string') {
          return value === firstValue;
        }

        if (value instanceof Date && firstValue instanceof Date) {
          return value.getTime() === firstValue.getTime();
        }

        return String(value) === String(firstValue);
      });

      mergedRecord[key] = hasCommonValue ? firstValue : null;
    });

    setSelectedRowData(mergedRecord);
  }, []);

  const handleRowDeselected = useCallback((args) => {
      updateSelectedData()
  }, []);

  const bulkUpdate = useCallback((field, args) => {
    bulkCellUpdate(field, args.value, selectedRowData ? [selectedRowData] : null);
    gridRef.current.refresh();
  }, []);
  const handleDropdownChange = useCallback((field, args) => {
    bulkUpdate(field, args);
  }, []);

  const handleNumericChange = useCallback((field, args) => {
    bulkUpdate(field, args);
  }, []);

  const handleDateChange = useCallback((field, args) => {
    bulkUpdate(field, args);
  }, []);

  const handleTextChange = useCallback((field, args) => {
    bulkUpdate(field, args);
  }, []);

  const renderFieldControl = useCallback((field, type = 'text', options = [], labelText = field) => {
    const value = selectedRowData?.[field];

    const fieldControl = (() => {
      if (type === 'dropdown') {
        return (
          <DropDownListComponent
            key={field}
            dataSource={options}
            value={value ?? null}
            fields={{ text: 'text', value: 'value' }}
            floatLabelType="Always"
            style={{ width: '100%' }}
            change={(args) => handleDropdownChange(field, args)}
          />
        );
      }

      if (type === 'number') {
        return (
          <NumericTextBoxComponent
            key={field}
            value={value ?? 0}
            floatLabelType="Always"
            style={{ width: '100%' }}
            format="N2"
            change={(args) => handleNumericChange(field, args)}
          />
        );
      }

      if (type === 'date') {
        return (
          <DatePickerComponent
            key={field}
            value={value ? new Date(value) : null}
            floatLabelType="Always"
            style={{ width: '100%' }}
            change={(args) => handleDateChange(field, args)}
          />
        );
      }

      return (
        <TextBoxComponent
          key={field}
          value={value ?? ''}
          floatLabelType="Always"
          style={{ width: '100%' }}
          change={(args) => handleTextChange(field, args)}
        />
      );
    })();

    return (
      <div
        key={field}
        style={{
          display: 'grid',
          gridTemplateColumns: '130px minmax(0, 1fr)',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
        }}
      >
        <label style={{ fontSize: '12px', color: '#475569', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {labelText}
        </label>
        <div style={{ minWidth: 0 }}>{fieldControl}</div>
      </div>
    );
  }, [selectedRowData]);

  const getColumnRendererType = useCallback((column) => {
    const editType = column?.editType || column?.type || 'string';

    if (editType === 'dropdownedit' || editType === 'dropdown') return 'dropdown';
    if (editType === 'numericedit' || editType === 'number') return 'number';
    if (editType === 'datepickeredit' || editType === 'date') return 'date';

    return 'text';
  }, []);

  const getColumnDropdownOptions = useCallback((column) => {
    const field = column?.field || '';
    if (!field) return [];

    const dataSource = column?.dataSource || [];
    if (Array.isArray(dataSource) && dataSource.length) {
      return dataSource.map((item) => {
        if (typeof item === 'string') {
          return { text: item, value: item };
        }
        return {
          text: item.text ?? item.label ?? item.value,
          value: item.value ?? item.text ?? item.label,
        };
      });
    }

    const distinctValues = DataUtil.distinct(gridData, field) || [];
    if (distinctValues.length) {
      return distinctValues.map((item) => ({
        text: item,
        value: item,
      }));
    }

    const staticOptions = {
      OrderStatus: ['Ready To Ship', 'In Transit', 'Delivered'],
      Priority: ['Low', 'Medium', 'High', 'Critical'],
      ShipCountry: ['USA', 'Canada', 'Mexico', 'UK'],
      PaymentMethod: ['Credit Card', 'Cash On Delivery', 'UPI', 'Net Banking'],
      PaymentStatus: ['Paid', 'Pending', 'Refunded'],
    };

    return (staticOptions[field] || []).map((item) => ({ text: item, value: item }));
  }, []);

  const accordionSections = useCallback(() => {
    const columns = gridRef.current?.getColumns?.() || [];
    const selectedRecords = gridRef.current?.getSelectedRecords?.() ?? [];
    const isMultiSelection = selectedRecords.length > 1;
    const shipDetailValues = selectedRecords
      .map((record) => record?.ShipDetails)
      .filter((value) => value !== undefined && value !== null && value !== '');
    const hasSameShipDetails = selectedRecords.length > 1 && shipDetailValues.length > 0 && shipDetailValues.every((value) => value === shipDetailValues[0]);

    const validColumns = columns.filter((column) => {
      const field = column?.field;
      if (!field || column?.isPrimaryKey || field === 'OrderDate' || column?.allowEditing === false) return false;

      if (isMultiSelection && ['GrossAmount', 'DiscountAmount', 'TaxAmount', 'TotalAmount'].includes(field)) {
        return false;
      }

      if (isMultiSelection && field === 'ShipDetails' && !hasSameShipDetails) {
        return false;
      }

      return true;
    });

    const groups = {
      Order: [],
      Shipping: [],
      Customer: [],
      General: [],
    };

    validColumns.forEach((column) => {
      const field = column.field;
      let groupName = 'General';

      if (/^(Order|Product|Gross|Discount|Tax|Total|Priority)/.test(field)) {
        groupName = 'Order';
      } else if (/^(Ship|Payment)/.test(field) || /Fee|Status/.test(field)) {
        groupName = 'Shipping';
      } else if (/^(Customer|Email|Phone)/.test(field)) {
        groupName = 'Customer';
      }

      groups[groupName].push({
        ...column,
        label: column.headerText || field,
        rendererType: getColumnRendererType(column),
        dropdownOptions: getColumnDropdownOptions(column),
      });
    });

    return Object.entries(groups)
      .filter(([, fields]) => fields.length)
      .map(([title, fields]) => ({
        title,
        fields,
        content: () => (
          <div style={{ display: 'grid', gap: '12px', width: '100%', minWidth: 0 }}>
            {fields.map((column) =>
              renderFieldControl(
                column.field,
                column.rendererType,
                column.dropdownOptions,
                column.label
              )
            )}
          </div>
        ),
      }));
  }, [renderFieldControl, getColumnRendererType, getColumnDropdownOptions]);

  // Row height presets used by the toolbar actions.
  const rowHeightMap = {
    compact: 32,
    relaxed: 55,
    normal: 47,
  };

  const isDevice = Browser.isDevice;


  // Configure the toolbar based on device form factor.
  const toolbar = isDevice ? ['Add', 'Edit', 'Update', 'Cancel', 'ExcelExport',
    { tooltipText: 'View Selected Records', id: 'viewSelectedRecords', prefixIcon: 'e-icons e-eye' }, 'PdfExport'] : [
    'Add',
    'Edit',
    'Update',
    'Cancel',
    { type: 'Separator' },
    'ExcelExport',
    'PdfExport',
    { type: 'Separator' },
    { text: 'View Selected Records', tooltipText: 'View Selected Records', id: 'viewSelectedRecords', prefixIcon: 'e-icons e-eye' },
    { type: 'Separator' },
    { tooltipText: 'Clear all filters', id: 'quickfilter', prefixIcon: 'e-icons e-filter-clear' },
    { tooltipText: 'Reset To Defaults', tooltipText: 'Clear filters / sort / group / selection', id: 'reset', prefixIcon: 'e-icons e-refresh' },

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


  // Shared grid behavior settings.
  const filterSettings = { type: 'FilterBar', showFilterBarOperator: true, };
  const selectionSettings = { type: 'Multiple', mode: 'Row', persistSelection: true };
  const sortSettings = { columns: [] };
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: false,
    ...(isDevice ? { mode: 'Dialog' } : {}),
  };
  const pageSettings = { pageSize: 50 };

  const groupSettings = { showDropArea: false, showGroupedColumn: true };


  // Apply or remove a date filter for a specific grid column.
  const filterDate = (field, value) => {
    const grid = gridRef.current;
    if (!grid) return;

    if (value) {
      grid.filterByColumn(field, 'equal', value);
    } else {
      grid.removeFilteredColsByField(field);
    }
  };

  // Apply or remove a dropdown filter for a specific grid column.
  const filterValue = (field, value) => {
    const grid = gridRef.current;
    if (!grid) return;

    if (value && value !== 'All') {
      grid.filterByColumn(field, 'equal', value);
    } else {
      grid.removeFilteredColsByField(field);
    }
  };

  // filterBarTemplates settings
  const orderDateFilterTemplate = createDateFilterTemplate(filterDate);
  const shipDateFilterTemplate = createDateFilterTemplate(filterDate);
  const shipCountryFilterTemplate = createDropdownFilterTemplate(filterValue, ['USA', 'Canada', 'Mexico', 'UK']);
  const orderStatusFilterTemplate = createDropdownFilterTemplate(filterValue, ['Ready To Ship', 'In Transit', 'Delivered']);
  const priorityFilterTemplate = createDropdownFilterTemplate(filterValue, ['Low', 'Medium', 'High', 'Critical']);
  const paymentStatusFilterTemplate = createDropdownFilterTemplate(filterValue, ['Paid', 'Pending', 'Refunded']);

  function createDateFilterTemplate(filterDate) {
    let dateElement;

    return {
      create: () => {
        dateElement = document.createElement('input');
        return dateElement;
      },
      write: (args) => {
        const columns = gridRef.current?.filterSettings?.columns ?? [];
        const currentFilter = columns.find((col) => col.field === args.column.field);
        const currentValue = currentFilter?.value;

        const datePicker = new DatePicker({
          value: currentValue,
          change: (changeArgs) => filterDate(args.column.field, changeArgs.value),
        });
        datePicker.appendTo(dateElement);
      },
    };
  }

  // Builds a dropdown filter template with an optional "All" choice.
  function createDropdownFilterTemplate(filterValue, options) {
    let dropdownElement;

    return {
      create: () => {
        dropdownElement = document.createElement('input');
        return dropdownElement;
      },
      write: (args) => {
        const columns = gridRef.current?.filterSettings?.columns ?? [];
        const currentFilter = columns.find((col) => col.field === args.column.field);
        const currentValue = currentFilter?.value ?? 'All';

        const dropdown = new DropDownList({
          dataSource: ['All', ...options],
          value: currentValue,
          change: (changeArgs) => {
            filterValue(args.column.field, changeArgs.value);
          },
        });
        dropdown.appendTo(dropdownElement);
      },
    };
  }

  // Handle all toolbar button actions for the grid.
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
        setSelectedRowData(null);
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


  // Apply a single value or value array to multiple selected grid rows.
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

  // Load grid data from the selected Excel file.
  const handleExcelBind = () => {
    const grid = gridRef.current;
    if (!grid) return;
    if (excelFile === null) {
      gridRef.current.changeDataSource(gridData);
      return;
    }
    var reader = new FileReader();
    reader.onload = (e) => {
      var data = (e.target).result;
      var workbook = XLSX.read(data, { type: 'array' });
      workbook.SheetNames.forEach((sheetName) => {
        var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        if (Array.isArray(XL_row_object) && XL_row_object.length > 0) {

          grid.pinnedTopRowModels = [];
          grid.pinnedTopRecords = []

          grid.pinnedTopRowKeys = {}
          grid.pinnedRowIndexes = {}

          gridRef.current.changeDataSource(XL_row_object);


        } else {

        }
      });
    };
    setExcelFile(null);
    setIsExcelDialogOpen(false);
    reader.readAsArrayBuffer(excelFile);
  };

  // Close the Excel import dialog and clear the pending file.
  const handleExcelDialogCancel = () => {
    setExcelFile(null);
    setIsExcelDialogOpen(false);
  };

  // Hide the selected-records dialog.
  const handleSelectedRecordsDialogClose = () => {
    setIsSelectedRecordsDialogOpen(false);
  };

  // Populate the selected-records grid before the dialog opens.
  const handleSelectedRecordsDialogOpen = () => {
    selectGridRef.current.setProperties({ dataSource: gridRef.current.getSelectedRecords(), columns: gridRef.current.columns }, true);
    selectGridRef.current.freezeRefresh();
  };

  // Configure the uploader.
  const path = {
    saveUrl: 'https://services.syncfusion.com/react/production/api/FileUploader/Save',
    removeUrl: 'https://services.syncfusion.com/react/production/api/FileUploader/Remove'
  };

  // Store the uploaded Excel file when upload succeeds.
  const onSuccess = (args) => {
    var files = args.file;
    if (files) {
      setExcelFile(files.rawFile);
    }
  }

  // Clear the stored Excel file when the upload is removed.
  const onRemove = (args) => {
    setExcelFile(null);

  }

  return (

    <div className={`home-grid-parent`}>

      <DialogComponent
        width={isDevice ? '320px' : '420px'}
        header="Bind from Excel"
        visible={isExcelDialogOpen}
        content={() => {
          return (
            <UploaderComponent id="uploadFiles" asyncSettings={path} removing={onRemove} dropArea={dropElement} success={onSuccess} ></UploaderComponent>)
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
              dataSource={[]}
              height={isDevice ? '260' : '320'}
              width="100%"
            >
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
        <button
          onClick={() => {
            setExcelFile(null);
            setIsExcelDialogOpen(true);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 4px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          <span className="e-icons e-export-xls" style={{ fontSize: '16px' }} />
          <span>Bind from Excel</span>
        </button>
      </div>
      <div className={`${isDevice ? ' e-bigger' : ''}`} style={{ display: 'grid', gridTemplateColumns: isDevice ? '1fr' : 'minmax(0, 1fr) 360px', gap: '16px', alignItems: 'start', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>

        <GridComponent
          id="orders-grid"
          ref={gridRef}
          created={() => {
            gridRef.current.columns[0].isPrimaryKey = true;
          }}
          isRowPinned={(data) => {
            if (data && !isDevice && data.Priority === 'Critical' && data.PaymentStatus === 'Paid') {
              return true;
            }
            return false;
          }
          }
          dataSource={gridData}
          columnMenuItems={['AutoFit', 'Group', 'Ungroup', 'SortAscending', 'SortDescending']}
          height={isDevice ? '400' : '200'}
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
          rowSelected={handleRowSelected}

          rowDeselected={handleRowDeselected}
          editSettings={editSettings}
          recordDoubleClick={(args) => {
            const nextField = args?.column?.field ?? null;
            fieldFocusRef.current = nextField;
          }}
          actionComplete={(args) => {
            const focusedField = fieldFocusRef.current ?? gridRef.current?.getColumns()?.[0]?.field;
            if (args.requestType === 'beginEdit' && focusedField) {
              const elementId = gridRef.current?.element?.id;
              const fieldElement = args.form?.elements?.[`${elementId}${focusedField}`];

              if (fieldElement) {
                fieldElement.focus();
              }
              fieldFocusRef.current = null;

            }
            if(args.requestType === 'save') {
              updateSelectedData()
            }
          }}
          toolbar={toolbar}
          toolbarClick={toolbarClick}
          sortSettings={sortSettings}
          pageSettings={pageSettings}
          enableInfiniteScrolling={true}
          allowExcelExport
          allowPdfExport
          contextMenuItems={isDevice ? [] : [
            'AutoFit', 'SortAscending', 'SortDescending',
            'Copy', 'Edit', 'Save', 'Cancel',
            'Group', 'Ungroup'
          ]}
        >
          <ColumnsDirective>
            {/* --------- Stacked header: Order Info --------- */}
            <ColumnDirective
              headerText="OrderID"
              field="OrderID"
              width={180}
              isPrimaryKey={true}
              textAlign={isDevice ? 'Left' : 'Right'}
              headerTextAlign={'Right'}
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
                  validationRules: { required: true },
                  editType: 'datepickeredit',
                  visible: !isDevice,
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
                  visible: !isDevice,
                  headerTemplate: customerNameHeaderTemplate,
                  validationRules: { required: true },

                },
                {
                  field: 'Phone',
                  headerText: 'Phone',
                  width: 170,
                  visible: !isDevice,
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
                  visible: !isDevice,

                },
                {
                  field: 'ShipCountry',
                  headerText: 'Ship Country',
                  editType: 'dropdownedit',
                  visible: !isDevice,
                  filterBarTemplate: shipCountryFilterTemplate,
                  width: 200,
                  clipMode: 'Ellipsis',

                },
                {
                  field: 'ShipDate',
                  headerText: 'Ship Date',
                  width: 180,
                  visible: !isDevice,
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
                  visible: !isDevice,
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
              validationRules={{ required: true }}
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
              validationRules={{ required: true }}
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
              validationRules={{ required: true }}
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

        {!isDevice && selectedRowData && (
          <div
            style={{
              minWidth: 0,
              borderLeft: '4px solid #e5e7eb',
              paddingLeft: '16px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ minWidth: 0, border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px 12px 12px 16px', background: '#fff', minHeight: '200px', overflow: 'auto', boxSizing: 'border-box' }}>
              <div style={{ fontWeight: 600, marginBottom: '12px' }}>Selected Row Details</div>
              <AccordionComponent width="100%" height={425} expandMode={'Multiple'} >
                <AccordionItemsDirective>
                  {accordionSections().map((section) => (
                    <AccordionItemDirective
                      key={section.title}
                      header={section.title}
                      expanded={true}
                      content={section.content}
                    />
                  ))}
                </AccordionItemsDirective>
              </AccordionComponent>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
