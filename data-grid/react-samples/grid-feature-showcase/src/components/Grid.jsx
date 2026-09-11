import * as React from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  ContextMenu,
  Inject,
  Page,
  Toolbar,
  Freeze,
  Filter,
  ColumnMenu,
  Resize,
  ColumnChooser,
  Sort,
  InfiniteScroll,
  Reorder, VirtualScroll,
} from '@syncfusion/ej2-react-grids';
import { ToolbarComponent } from '@syncfusion/ej2-react-navigations';
import { DateRangePicker, DatePicker } from '@syncfusion/ej2-calendars';
import { DropDownList, MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { gridData } from './datasource';
MultiSelect.Inject(CheckBoxSelection);
function DataGrid() {
  const gridRef = React.useRef(null);
  const searchBoxRef = React.useRef(null);
  const initialColumnsRef = React.useRef(null);
  const customFilterRef = React.useRef(false);
  const endDateRef= React.useRef(null);

  let grid = gridRef.current;

  const isRowPinned = (data) => {
    if (data && data.Priority === 'Critical' && data.PaymentStatus === 'Paid') {
      return true;
    }
    return false;
  };

  const contextMenuItems = [
    { text: 'Freeze Left', target: '.e-headercontent', id: 'freeze', iconCss: 'e-icons e-chevron-left-double' },
    { text: 'Freeze Right', target: '.e-headercontent', id: 'freezeright', iconCss: 'e-icons e-chevron-right-double' },
    { text: 'UnFreeze', target: '.e-headercontent', id: 'unfreeze', iconCss: 'e-icons e-undo' },
    'PinRow',
    'UnpinRow',
  ];

  const columnMenuItems = [
    "Filter",
    "SortAscending",
    "SortDescending",
    "AutoFit", 
    {
      text: 'Filter Type Change',
      id: 'filter-menu',
      items: [
        { text: 'Default Filter', id: 'default-filter' },
        { text: 'Excel Filter', id: 'excel-filter' },
        { text: 'CheckBox Filter', id: 'checkbox-filter' }
      ]
    },
  ];

  const contextMenuClick = (args) => {
    const gridCol = grid.getColumnByField(args.column.field);
    if (grid && args.item.id === 'freeze') {
      if (!gridCol.freeze) {
        gridCol.freeze = 'Left';
        grid.refreshColumns();
      }
    }
    if (grid && args.item.id === 'freezeright') {
      if (!gridCol.freeze) {
        gridCol.freeze = 'Right';
        grid.refreshColumns();
      }
    }
    if (grid && args.item.id === 'unfreeze') {
      gridCol.freeze = undefined;
      grid.refreshColumns();
    }
  };

  const columnMenuClick = (args) => {
    const gridInstance = gridRef.current;
    if (!gridInstance || !args.item) return;

    const filterTypeMap = {
      'default-filter': 'FilterBar',
      'excel-filter': 'Excel',
      'checkbox-filter': 'CheckBox',
    };

    const nextType = filterTypeMap[args.item.id];
    if (nextType) {
      gridInstance.filterSettings = {
        ...gridInstance.filterSettings,
        type: nextType,
      };
      if(nextType === 'FilterBar') {
        gridInstance.clearFiltering();
      }
      gridInstance.refresh();
      return;
    }
  };

  const globalSearch = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    const searchText = event.target.value.trim();
    const dateMatch = searchText.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    let searchValue = searchText;
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      const dateValue = new Date(Number(year), Number(month) - 1, Number(day));
      const isValidDate = dateValue.getFullYear() === Number(year)
        && dateValue.getMonth() === Number(month) - 1
        && dateValue.getDate() === Number(day);
      if (isValidDate) {
        let dateString=dateValue.toString();
        gridRef.current?.search(dateString);
      }
    }
    else
    {
      gridRef.current?.search(searchValue);
    }
   
    
  };

    const clearGlobalSearch = (args) => {
      if (!args.value) {
        gridRef.current?.search('');
      }
    };

  React.useEffect(() => {
    const searchInput = searchBoxRef.current?.element;
    if (!searchInput) {
      return undefined;
    }

    searchInput.addEventListener('keydown', globalSearch);
    return () => searchInput.removeEventListener('keydown', globalSearch);
  }, []);

  const cloneColumns = (columns) => columns.map(({ columns: childColumns, ...column }) => ({
    ...column,
    ...(childColumns ? { columns: cloneColumns(childColumns) } : {})
  }));

  const gridCreated = () => {
    const columns = gridRef.current?.columns
    initialColumnsRef.current = columns ? cloneColumns(columns) : null;
  };

  const toolbarClick = (args) => {
    if (args.item.id !== 'restore-columns' || !gridRef.current || !initialColumnsRef.current) {
      return;
    }
    // gridRef.current.columns= cloneColumns(initialColumnsRef.current);
    // gridRef.current.refreshColumns();

    gridRef.current.setProperties({
      columns: cloneColumns(initialColumnsRef.current),
      filterSettings: { type: 'FilterBar', columns:{}},
      sortSettings: { columns: [] },
    },true)
    gridRef.current.freezeRefresh();
  };

  const contextMenuOpen = (args) => {
    if(gridRef.current.pinnedDataCount > 4)
    {
      grid.contextMenuModule.contextMenu.enableItems(['Pin Row'], false);
    }
    else
    {
      grid.contextMenuModule.contextMenu.enableItems(['Pin Row'], true);
    }

    if (!args.rowInfo.target.closest('.e-headercell')) {
      grid.contextMenuModule.contextMenu.hideItems(['Freeze Left']);
      grid.contextMenuModule.contextMenu.hideItems(['Freeze Right']);
      grid.contextMenuModule.contextMenu.hideItems(['UnFreeze']);
    } else {
      if(args.column)
      {
        const gridCol = grid.getColumnByField(args.column.field);
        if (gridCol.freeze) {
          grid.contextMenuModule.contextMenu.hideItems(['Freeze Left']);
          grid.contextMenuModule.contextMenu.hideItems(['Freeze Right']);
          grid.contextMenuModule.contextMenu.showItems(['UnFreeze']);
        } else {
          grid.contextMenuModule.contextMenu.showItems(['Freeze Left']);
          grid.contextMenuModule.contextMenu.showItems(['Freeze Right']);
          grid.contextMenuModule.contextMenu.hideItems(['UnFreeze']);
        }
      }

    }
  };

  const applyDateRangeFilter = (field, value) => {
    const gridInstance = gridRef.current;
    if (!gridInstance) return;

    const range = Array.isArray(value) ? value : [];
    if (range.length === 2 && range[0] && range[1]) {
      customFilterRef.current = true;
      endDateRef.current = new Date(range[1]);
      gridRef.current.filterByColumn(field, 'greaterthan', new Date(range[0]), 'and');

    } else {
      gridInstance.clearFiltering();
    }
  };


  const actionBegin = (args) => {
    // Check for filter column and flag enabled in date range picker’s change event 
    if (args.requestType === "filtering" && (args.currentFilteringColumn === "OrderDate" || args.currentFilteringColumn ==="ShipDate" || args.currentFilteringColumn === "LastUpdated")  && customFilterRef.current) {
      customFilterRef.current = false;
      // End date value is added as additional filter value with lessthanorequal filter operator 
      args.columns.push({ actualFilterValue: {}, actualOperator: {}, field: args.currentFilteringColumn, ignoreAccent: false, isForeignKey: false, matchCase: false, operator: "lessthan", predicate: "and", uid: gridRef.current.getColumnByField(args.currentFilteringColumn).uid, value: endDateRef.current });
    }
  }

  const applyMultiSelectFilter = (field, value) => {
    const gridInstance = gridRef.current;
    if (!gridInstance) return;

    const selected = Array.isArray(value) ? value.filter(Boolean) : [];
    if (selected.length) {
      gridInstance.filterByColumn(field, 'in', selected);
    } else {
      gridInstance.clearFiltering();
    }
  };

  const createDateRangeFilterTemplate = () => {
    let dateElement;

    return {
      create: () => {
        dateElement = document.createElement('input');
        return dateElement;
      },
      write: (args) => {
        const columns = gridRef.current?.filterSettings?.columns ?? [];
        const currentFilter = columns.find((col) => col.field === args.column.field);
        const currentValue = currentFilter?.value ?? null;

        const dateRangePicker = new DateRangePicker({
          value: currentValue,
          change: (changeArgs) => applyDateRangeFilter(args.column.field, changeArgs.value),
          placeholder: 'Select range',
          showClearButton: true,
          format: 'dd/MM/yyyy',
        });

        dateRangePicker.appendTo(dateElement);
      },
    };
  };

  const createDropdownFilterTemplate = (options) => {
    let dropdownElement;

    return {
      create: () => {
        dropdownElement = document.createElement('input');
        return dropdownElement;
      },
      write: (args) => {
        const columns = gridRef.current?.filterSettings?.columns ?? [];
        const currentFilter = columns.find((col) => col.field === args.column.field);
        const currentValue = currentFilter?.value ?? [];

        const dropdown = new MultiSelect({
          dataSource: options,
          mode: 'CheckBox',
          showDropDownIcon:true,
          showSelectAll: true,
          allowFiltering: true,
          value: Array.isArray(currentValue) ? currentValue : currentValue ? [currentValue] : [],
          change: (changeArgs) => applyMultiSelectFilter(args.column.field, changeArgs.value),
        });

        dropdown.appendTo(dropdownElement);
      },
    };
  };

  const orderDateFilterTemplate = createDateRangeFilterTemplate();
  const shipDateFilterTemplate = createDateRangeFilterTemplate();
  const shipCountryFilterTemplate = createDropdownFilterTemplate(['USA', 'Canada', 'Mexico', 'UK']);
  const orderStatusFilterTemplate = createDropdownFilterTemplate(['Ready To Ship', 'In Transit', 'Delivered']);
  const priorityFilterTemplate = createDropdownFilterTemplate(['Low', 'Medium', 'High', 'Critical']);
  const paymentStatusFilterTemplate = createDropdownFilterTemplate(['Paid', 'Pending', 'Refunded']);

  return (
    <div className='control-pane'>
      <ToolbarComponent className='standalone-toolbar' aria-label='Global search toolbar'>
        <div className='toolbar-title'>Global Search</div>
        <div className='toolbar-search'>
          <TextBoxComponent
            ref={searchBoxRef}
            placeholder='Search across all columns'
            width={240}
            showClearButton={true}
            change={clearGlobalSearch}
            aria-label='Global search field'
          />
        </div>
      </ToolbarComponent>

      <div className='control-section'>
        <GridComponent
          id="ordergrid"
          dataSource={gridData}
          load={(args)=>
            {
              args.enableSeamlessScrolling=true;
            }
          }
          ref={(g) => {
            grid = g;
            gridRef.current = g;
          }}
          allowReordering={true}
          actionBegin={actionBegin}
          created={gridCreated}
          toolbarClick={toolbarClick}
          contextMenuOpen={contextMenuOpen}
          contextMenuClick={contextMenuClick}
          columnMenuClick={columnMenuClick}
          allowResizing={true}
          enableVirtualization={true}
          allowSorting={true}
          allowFiltering={true}
          filterSettings={{ type: 'FilterBar', showFilterBarOperator: true, showFilterBarStatus:false }}
          showColumnMenu={true}
          showColumnChooser={true}
          toolbar={[
            { text: 'Restore Columns', id: 'restore-columns', prefixIcon: 'e-icons e-refresh' },
            'ColumnChooser'
          ]}
          columnMenuItems={columnMenuItems}
          contextMenuItems={contextMenuItems}
          height="65vh"
          isRowPinned={isRowPinned}
        >
          <ColumnsDirective>
            <ColumnDirective field="OrderID" headerText="Order ID" width={200} textAlign="Right" isPrimaryKey={true} />
            <ColumnDirective field="CustomerName" filter={{operator: 'contains'}} headerText="Customer Name" width={240} />
            <ColumnDirective field="ProductName" headerText="Product Name" width={240} />
            <ColumnDirective field="TotalAmount" headerText="Total Amount" width={190} format="C2" textAlign="Right" />

            <ColumnDirective
              headerText="Order"
              textAlign="Center"
              columns={[
                { field: 'OrderDate', headerText: 'Order Date', filter: { type: 'Menu' }, width: 170, type: 'date', format: 'dd/MM/yyyy', textAlign: 'Left', filterBarTemplate: orderDateFilterTemplate },
                { field: 'ShipDate', headerText: 'Ship Date',filter: { type: 'Menu' }, width: 170, type: 'date', format: 'dd/MM/yyyy', textAlign: 'Left', filterBarTemplate: shipDateFilterTemplate },
                { field: 'OrderStatus', headerText: 'Order Status', width: 170, textAlign: 'Left', filterBarTemplate: orderStatusFilterTemplate }
              ]}
            />

            <ColumnDirective
              headerText="Customer"
              textAlign="Center"
              columns={[
                { field: 'Phone', headerText: 'Phone', width: 190 },
                { field: 'Email', headerText: 'Email', width: 220, visible: false },
                { field: 'CustomerID', headerText: 'Customer ID', width: 140, visible: false }
              ]}
            />

            <ColumnDirective
              headerText="Shipping"
              textAlign="Center"
              columns={[
                { field: 'ShipCountry', headerText: 'Ship Country', width: 190, filterBarTemplate: shipCountryFilterTemplate },
                { field: 'ShipDetails', headerText: 'Ship Details', width: 280 },
                { field: 'ShipFee', headerText: 'Ship Fee', width: 150, format: 'C2', textAlign: 'Right' }
              ]}
            />

            <ColumnDirective
              headerText="Financial"
              textAlign="Center"
              columns={[
                { field: 'Quantity', headerText: 'Qty', width: 110, textAlign: 'Right' },
                { field: 'UnitPrice', headerText: 'Unit Price', width: 140, format: 'C2', textAlign: 'Right' },
                { field: 'GrossAmount', headerText: 'Gross Amount', width: 190, format: 'C2', textAlign: 'Right' }
              ]}
            />

            <ColumnDirective field="DiscountAmount" filter={{ type: 'Menu' }} headerText="Discount Amount" width={190} format="C2" textAlign="Right" />
            <ColumnDirective field="TaxAmount" filter={{ type: 'Menu' }} headerText="Tax Amount" width={170} format="C2" textAlign="Right" />
            <ColumnDirective field="Priority" headerText="Priority" width={170} filterBarTemplate={priorityFilterTemplate} />
            <ColumnDirective field="Rating" headerText="Rating" width={120} textAlign="Right" />
            <ColumnDirective field="ShipAddress" headerText="Ship Address" width={240} visible={false} />
            <ColumnDirective field="ShipCity" headerText="Ship City" width={160} visible={false} />
            <ColumnDirective field="ShipState" headerText="Ship State" width={140} visible={false} />
            <ColumnDirective field="ShipPostalCode" headerText="Ship Postal Code" width={140} visible={false} />
            <ColumnDirective field="ProductID" headerText="Product ID" width={150} visible={false} />
            <ColumnDirective field="Category" headerText="Category" width={170} visible={false} />
            <ColumnDirective field="Discount"filter={{ type: 'Menu' }} headerText="Discount %" width={140} visible={false} />
            <ColumnDirective field="Tax" filter={{ type: 'Menu' }} headerText="Tax %" width={130} visible={false} />
            <ColumnDirective field="SubTotal" headerText="Subtotal" width={150} format="C2" textAlign="Right" visible={false} />
            <ColumnDirective field="PaymentMethod" headerText="Payment Method" width={170} visible={false} />
            <ColumnDirective field="PaymentStatus" headerText="Payment Status" width={170} visible={false} filterBarTemplate={paymentStatusFilterTemplate} />
            <ColumnDirective field="Warehouse" headerText="Warehouse" width={140} visible={false} />
            <ColumnDirective field="InventoryCount" headerText="Inventory Count" width={140} visible={false} />
            <ColumnDirective field="SalesChannel" headerText="Sales Channel" width={160} visible={false} />
            <ColumnDirective field="MarketRegion" headerText="Market Region" width={170} visible={false} />
            <ColumnDirective field="DeliveryMode" headerText="Delivery Mode" width={170} visible={false} />
            <ColumnDirective field="TrackingNumber" headerText="Tracking Number" width={180} visible={false} />
            <ColumnDirective field="Currency" headerText="Currency" width={120} visible={false} />
            <ColumnDirective field="IsPriorityOrder" headerText="Priority Flag" width={150} visible={false} />
            <ColumnDirective field="LastUpdated" headerText="Last Updated" width={170} type="date" format="dd/MM/yyyy" visible={false} />
          </ColumnsDirective>
          <Inject services={[Reorder, VirtualScroll, ContextMenu, Resize, Sort, InfiniteScroll, Resize, ColumnChooser, Filter, ColumnMenu, Freeze, Page, Toolbar]} />
        </GridComponent>
      </div>
    </div>
  );
}

export default DataGrid;

