import * as React from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  ContextMenu,
  Inject,
  Page,
  Freeze,
  Reorder
} from '@syncfusion/ej2-react-grids';
import { taskData } from './data';

function DataGrid() {
  let grid;
  const isRowPinned = (data) => {
    if (data && data.Status === 'Open' && data.Priority === 'Critical') {
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
  const contextMenuClick = (args) => {
    let gridCol = grid.getColumnByField(args.column.field);
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
  const contextMenuOpen = (args) => {
    let gridCol = grid.getColumnByField(args.column.field);

    if (!args.rowInfo.target.closest('.e-headercell')) {
      grid.contextMenuModule.contextMenu.hideItems(['Freeze Left']);
      grid.contextMenuModule.contextMenu.hideItems(['Freeze Right']);
      grid.contextMenuModule.contextMenu.hideItems(['UnFreeze']);
    } else {
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
  };
 
  return (<div className='control-pane'>
    <div className='control-section' >
     
     <GridComponent
          dataSource={taskData}
          ref={(g) => (grid = g)}
          contextMenuOpen={contextMenuOpen}
          contextMenuClick={contextMenuClick}
          allowPaging={true}
          pageSettings={{ pageSize: 20 }}
          allowReordering={true}
          contextMenuItems={contextMenuItems}
          height="520"
          isRowPinned={isRowPinned}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="TaskID"
              headerText="Task ID"
              width={100}
              textAlign="Right"
              isPrimaryKey={true}
            />
            <ColumnDirective field="Title" headerText="Title" width={100} />
            <ColumnDirective field="Project" headerText="Project" width={120} />
            <ColumnDirective
              field="Assignee"
              headerText="Assignee"
              width={100}
            />
            <ColumnDirective
              field="Priority"
              headerText="Priority"
              width={100}
            />
            <ColumnDirective field="Status" headerText="Status" width={100} />
            <ColumnDirective
              field="CreatedDate"
              headerText="Created Date"
              width={130}
            />
            <ColumnDirective
              field="DueDate"
              headerText="Due Date"
              width={130}
            />
            <ColumnDirective field="Progress" headerText="Progress" width={100} />
          </ColumnsDirective>
          <Inject services={[ContextMenu, Freeze, Reorder, Page]} />
        </GridComponent>
    </div>
  </div>);
}
export default DataGrid;

