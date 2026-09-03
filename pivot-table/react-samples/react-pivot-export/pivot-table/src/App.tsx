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

const pivotServiceUrl = import.meta.env.VITE_PIVOT_SERVICE_URL
  ?? 'http://localhost:5285/api/pivot/post';
const pivotExcelExportAction = 'onPivotExcelExport';

const dataSourceSettings: IDataOptions = {
  url: pivotServiceUrl,
  mode: 'Server',
  type: 'JSON',
  rows: [{
    name: 'ProductID', caption: 'Product ID'
  }],
  enableSorting: true,
  formatSettings: [{
    name: 'Price',
    format: 'C'
  }],
  columns: [{
    name: 'Year', caption: 'Production Year'
  }],
  values: [{
    name: 'Sold', caption: 'Units Sold'
  },
  {
    name: 'Price', caption: 'Sold Amount'
  }]
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
    <PivotViewComponent
      id='PivotView'
      ref={pivotObj}
      dataSourceSettings={dataSourceSettings}
      width='100%'
      height='700'
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
  );
}

export default App;
