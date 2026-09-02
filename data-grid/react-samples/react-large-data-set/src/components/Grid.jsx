import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Sort, Filter, Selection, VirtualScroll, DomVirtualization } from '@syncfusion/ej2-react-grids';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';


const avatarColors = [
  'avatar-red', 'avatar-blue', 'avatar-green', 'avatar-orange', 'avatar-purple'
];
function getInitials(name) {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
function getAvatarClass(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return avatarColors[sum % avatarColors.length];
}
const empAvatarTemplate = (props) => {
  return (<div className="customer-details">
    <div className={`customer-avatar ${getAvatarClass(props.Employees)}`}>
      {getInitials(props.Employees)}
    </div>

    <div className="customer-info">
      <p className="customer-name">{props.Employees}</p>
      <p className="customer-email">{props.Mail}</p>
    </div>
  </div>);
};
const statusTemplate = (props) => {
  const active = props.Status === 'Active';
  return (<div className={`statustemp ${active ? 'e-activecolor' : 'e-inactivecolor'}`}>
    <span className={`statustxt ${active ? 'e-activecolor' : 'e-inactivecolor'}`}>
      {props.Status}
    </span>
  </div>);
};
function DataGrid() {
  const gridRef = React.useRef(null);
  const dropdownRef = React.useRef(null);
  const dataCountRef = React.useRef('1000');
  let enableVirtualization=true
  const ddlData = React.useMemo(() => ([
    { text: '1,000 Rows and 11 Columns', value: '1000' },
    { text: '10,000 Rows and 11 Columns', value: '10000' },
    { text: '1,00,000 Rows and 11 Columns', value: '100000' }
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

  return (<div className='control-pane'>
    <div className='control-section' style={{ marginTop: '60px', paddingLeft: '25px', paddingRight: '26px' }}>
      <div style={{ paddingBottom: '18px', paddingTop: '20px' }}>
        <DropDownListComponent id="games" width="220px" dataSource={ddlData} value={dataCountRef.current} ref={dropdownRef} fields={fields} change={onChange} placeholder="Select a Data Range" popupHeight="240px" />
        <br />
      </div>
      <GridComponent id="DOMVirtualGrid" ref={gridRef} dataSource={data} query={queryRef.current} height={400} rowHeight={50} enableVirtualization={enableVirtualization} enableDomVirtualization={true} pageSettings={{ pageSize: 100 }} domVirtualizationSettings={{ rowBuffer: 10 }} clipMode='EllipsisWithTooltip' allowSorting={true} allowFiltering={true} allowSelection={true} filterSettings={{ type: 'CheckBox' }}>
        <ColumnsDirective>
          <ColumnDirective field='EmployeeID' headerText='Employee ID' width='150' isPrimaryKey={true} textAlign='Right'></ColumnDirective>
          <ColumnDirective field='Employees' headerText='Employee Name' width='260' template={empAvatarTemplate}></ColumnDirective>
          <ColumnDirective field='Designation' headerText='Designation' width='170'></ColumnDirective>
          <ColumnDirective field='Status' headerText='Status' width='150' template={statusTemplate}></ColumnDirective>
          <ColumnDirective field='CurrentSalary' headerText='Current Salary' width='160' format='C2' textAlign='Right'></ColumnDirective>
          <ColumnDirective field='Location' headerText='Location' width='160'></ColumnDirective>
          <ColumnDirective field='Address' headerText='Address' width='240'></ColumnDirective>
        </ColumnsDirective>

        <Inject services={[Sort, Filter, Selection, VirtualScroll, DomVirtualization]} />
      </GridComponent>
    </div>
  </div>);
}
export default DataGrid;

