import {
  PivotViewComponent,
  GroupingBar,
  FieldList,
  VirtualScroll,
  Toolbar,
  ExcelExport,
  Inject,
  type AfterServiceInvokeEventArgs,
  type IDataOptions,
  type PivotActionFailureEventArgs,
  type ToolbarArgs,
  type ToolbarItems,
} from '@syncfusion/ej2-react-pivotview';
import { Browser } from '@syncfusion/ej2-base';
import { useRef } from 'react';
import './App.css';

const pivotServiceUrl = import.meta.env.VITE_PIVOT_SERVICE_URL
  ?? 'https://pivot-controller-f9a8awhsh8haaaep.centralus-01.azurewebsites.net/api/pivot/post';
const pivotExcelExportAction = 'onPivotExcelExport';

const dataSourceSettings: IDataOptions = {
  url: pivotServiceUrl,
  mode: 'Server',
  type: 'JSON',
  enableSorting: true,
  rows: [],
  columns: [],
  values: [],
  filters: [],
};

function App() {
  const pivotObj = useRef<PivotViewComponent | null>(null);
  const exportInProgress = useRef(false);
  const toolbarOptions: ToolbarItems[] = ['FieldList'];

  function toolbarRender(args: ToolbarArgs): void {
    if (!args.customToolbar) {
      return;
    }
    args.customToolbar.splice(0, 0, {
      id: 'export-as-pivot',
      prefixIcon: 'e-menu-icon e-pivotview-excel-export e-icons',
      tooltipText: 'Excel Export as Pivot',
      click: toolbarClicked,
    });
  }

  function toolbarClicked(): void {
    if (!pivotObj.current || exportInProgress.current) {
      return;
    }

    exportInProgress.current = true;
    pivotObj.current?.showWaitingPopup();
    pivotObj.current?.exportAsPivot();
  }

  function finishExport(): void {
    exportInProgress.current = false;
    pivotObj.current?.hideWaitingPopup();
  }

  function afterServiceInvoke(args: AfterServiceInvokeEventArgs): void {
    if (exportInProgress.current && args.action === pivotExcelExportAction) {
      finishExport();
    }
  }

  function actionFailure(args: PivotActionFailureEventArgs): void {
    if (!exportInProgress.current) {
      return;
    }

    finishExport();
    console.error('Pivot export failed.', args.errorInfo);
  }

  return (
    <main className='app-shell' aria-label='Dynamic data pivot table'>
      <header className='page-header'>
        <h1>Dynamic Data Analysis</h1>
        <p>Open the Field List and drag discovered fields into Rows, Columns, Values, or Filters.</p>
      </header>
      <div className='pivot-table-container'>
        <PivotViewComponent
          id='PivotView'
          ref={pivotObj}
          dataSourceSettings={dataSourceSettings}
          width='100%'
          height='100%'
          showToolbar={true}
          gridSettings={{ columnWidth: Browser.isDevice ? 100 : 120 }}
          showFieldList={true}
          showGroupingBar={true}
          enableVirtualization={true}
          toolbar={toolbarOptions}
          toolbarRender={toolbarRender}
          afterServiceInvoke={afterServiceInvoke}
          actionFailure={actionFailure}
        >
          <Inject services={[FieldList, Toolbar, ExcelExport, GroupingBar, VirtualScroll]} />
        </PivotViewComponent>
      </div>
    </main>
  );
}

export default App;
