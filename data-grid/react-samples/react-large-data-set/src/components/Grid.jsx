import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Sort, Filter, Selection, VirtualScroll } from '@syncfusion/ej2-react-grids';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';

function DataGrid() {
  const gridRef = React.useRef(null);
  const dropdownRef = React.useRef(null);
  const dataCountRef = React.useRef('1000');
  let enableVirtualization=true;
  const ddlData = React.useMemo(() => ([
    { text: '1,000 Rows and 10 Columns', value: '1000' },
    { text: '10,000 Rows and 10 Columns', value: '10000' },
    { text: '100,000 Rows and 10 Columns', value: '100000' }
  ]), []);
  const fields = React.useMemo(() => ({ text: 'text', value: 'value' }), []);
  const data = React.useMemo(() => new DataManager({
    url: 'https://services.syncfusion.com/react/production/api/UrlDataSource',
    adaptor: new UrlAdaptor()
  }), []);
  const queryRef = React.useRef(new Query().addParams('dataCount', dataCountRef.current));

  const onChange = React.useCallback((args) => {
    const value = args?.value?.toString();
    if (!value) {
      return;
    }
    dataCountRef.current = value;
    queryRef.current = new Query().addParams('dataCount', value);

    const grid = gridRef.current;

    if (grid) {
      grid.query = queryRef.current;
      grid.freezeRefresh();
    }
  }, []);

  const load=(args)=>
  {
    if(enableVirtualization)
    {
      args.enableSeamlessScrolling=true;
    }
  }
  const filter={type:'Menu'}

  return (<div className='control-pane'>
    <div className='control-section' style={{ marginTop: '60px', paddingLeft: '25px', paddingRight: '26px' }}>
      <div style={{ paddingBottom: '18px', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: '15px' }}>
        <span style={{ fontWeight: 600, color: '#1f2937', letterSpacing: '0.2px' }}>Data Size</span>
        <DropDownListComponent id="games" width="240px" dataSource={ddlData} value={dataCountRef.current} ref={dropdownRef} fields={fields} change={onChange} placeholder="Select a Data Range" popupHeight="240px" />
        <br />
      </div>
      <GridComponent id="VirtualGrid" ref={gridRef} dataSource={data} query={queryRef.current} height={400} rowHeight={50} enableVirtualization={enableVirtualization} load={load} pageSettings={{ pageSize: 50 }} clipMode='EllipsisWithTooltip' allowSorting={true} allowFiltering={true} allowSelection={true} filterSettings={{ type: 'CheckBox', enableInfiniteScrolling: true }}>
        <ColumnsDirective>
          <ColumnDirective field='EmployeeID' headerText='Employee ID' width='150' isPrimaryKey={true} textAlign='Right'></ColumnDirective>
          <ColumnDirective field='Employees' headerText='Employee Name' width='260'></ColumnDirective>
          <ColumnDirective field='Designation' headerText='Designation' width='170'></ColumnDirective>
          <ColumnDirective field='Mail' headerText='Mail' width='240'></ColumnDirective>
          <ColumnDirective field='Status' headerText='Status' width='150'></ColumnDirective>
          <ColumnDirective field='CurrentSalary' filter={filter} headerText='Current Salary' width='160' format='C2' textAlign='Right'></ColumnDirective>
          <ColumnDirective field='Location' headerText='Location' width='160'></ColumnDirective>
          <ColumnDirective field='Address' headerText='Address' width='240'></ColumnDirective>  
          <ColumnDirective field='Rating' headerText='Rating' width='130'></ColumnDirective>
          <ColumnDirective field='Trustworthiness' headerText='Trustworthiness' width='240'></ColumnDirective>
        </ColumnsDirective>
        <Inject services={[Sort, Filter, Selection, VirtualScroll]} />
      </GridComponent>
    </div>
  </div>);
}
export default DataGrid;

