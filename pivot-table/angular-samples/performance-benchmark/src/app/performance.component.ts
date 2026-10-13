import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { select, Browser } from '@syncfusion/ej2-base';
import {
  PivotViewComponent, FieldList, CalculatedField, Toolbar, GroupingBar,
  VirtualScroll, Pager, DrillThrough, Grouping, PDFExport, ExcelExport,
  ConditionalFormatting, NumberFormatting
} from '@syncfusion/ej2-angular-pivotview';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';

import { getPerformanceData } from './datasource';
import './App.css';

const TOTAL_DATA_ROWS = 1000000;

// University data - with rank_display (normal)
const UniversityData = getPerformanceData(1000000, false);

// University data with data compression format
const UniversityDataCompressed = getPerformanceData(1000000, true);

interface MetricsData {
  initialLoadTime: number;
  columnsSortingTime: number;
  rowsSortingTime: number;
  filteringTimeRow: number;
  filteringTimeColumn: number;
  groupingTime: number;
  ungroupingTime: number;
  drillDownTime: number;
  drillUpTime: number;
  clearFilteringTimeRow: number;
  clearFilteringTimeColumn: number;
  rowsInDOM: number;
  totalDatasetRows: number;
}

const EMPTY_METRICS: MetricsData = { ...{} } as MetricsData;

@Component({
  selector: 'app-performance',
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './performance.component.html',
  styles: []
})
export class PerformanceAppComponent {
  @ViewChild('pivotRef', { static: true }) public pivotRef!: PivotViewComponent;
  @ViewChild('modeDropdown', { static: true }) public modeDropdown!: DropDownListComponent;

  public TOTAL_DATA_ROWS = TOTAL_DATA_ROWS;
  public isInit: boolean = true;
  public initialLoadTime!: number;
  public loaded: boolean = false;
  public scrollMode: 'virtual' | 'compression' | 'paging' = 'virtual';

  // Synchronous cross-handler timing (avoid change detection churn on the pivot)
  private pendingActionType: string = '';
  private actionStartTime: number = 0;

  public metrics: MetricsData = {
    initialLoadTime: 0,
    columnsSortingTime: 0,
    rowsSortingTime: 0,
    filteringTimeRow: 0,
    filteringTimeColumn: 0,
    groupingTime: 0,
    ungroupingTime: 0,
    drillDownTime: 0,
    drillUpTime: 0,
    clearFilteringTimeRow: 0,
    clearFilteringTimeColumn: 0,
    rowsInDOM: 0,
    totalDatasetRows: 0
  };

  public scrollModeItems: { text: string; value: string }[] = [
    { text: 'Virtual Scroll', value: 'virtual' },
    { text: 'Data Compression', value: 'compression' },
    { text: 'Paging', value: 'paging' }
  ];

  public toolbarOptions: any = ['Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList'];

  public chartSettings: any = { title: 'Top Universities Analysis' };
  public displayOption: any = { view: 'Both' };
  public gridSettings: any = { columnWidth: 120, rowHeight: 36 };

  public dataSourceSettings: any = {
    enableSorting: true,
    allowLabelFilter: true,
    allowValueFilter: true,
    showHeaderWhenEmpty: false,
    columns: [
      { name: 'region', caption: 'Region' },
      { name: 'country', caption: 'Country' }
    ],
    rows: [
      { name: 'rank_display', caption: 'Rank' },
      { name: 'university', caption: 'University' }
    ],
    formatSettings: [
      { name: 'international_students', format: 'N0' },
      { name: 'faculty_count', format: 'N0' }
    ],
    dataSource: [],
    expandAll: false,
    values: [
      { name: 'international_students', caption: 'Students' },
      { name: 'faculty_count', caption: 'Faculty' },
      { name: 'score', caption: 'Score' }
    ],
    filters: [{ name: 'type', caption: 'University Type' }],
    fieldMapping: [
      { name: 'rank_display', dataType: 'number' },
      { name: 'country', caption: 'Country' },
      { name: 'city', caption: 'City' },
      { name: 'region', caption: 'Region' },
      { name: 'research_output', caption: 'Research Output' },
      { name: 'student_faculty_ratio', caption: 'Student faculty ratio' }
    ],
    conditionalFormatSettings: [
      {
        measure: 'international_students',
        value1: 1000,
        value2: 5000,
        conditions: 'Between',
        style: {
          backgroundColor: '#FFA500',
          color: 'white',
          fontFamily: 'Tahoma',
          fontSize: '12px'
        },
        applyGrandTotals: false
      },
      {
        measure: 'international_students',
        value1: 8000,
        conditions: 'GreaterThan',
        style: {
          backgroundColor: '#0C860C',
          color: 'white',
          fontFamily: 'Tahoma',
          fontSize: '12px'
        },
        applyGrandTotals: false
      },
      {
        measure: 'faculty_count',
        value1: 500,
        value2: 2000,
        conditions: 'Between',
        style: {
          backgroundColor: '#FFA500',
          color: 'white',
          fontFamily: 'Tahoma',
          fontSize: '12px'
        },
        applyGrandTotals: false
      },
      {
        measure: 'faculty_count',
        value1: 4000,
        conditions: 'GreaterThan',
        style: {
          backgroundColor: '#0C860C',
          color: 'white',
          fontFamily: 'Tahoma',
          fontSize: '12px'
        },
        applyGrandTotals: false
      }
    ],
    emptyCellsTextContent: '-'
  };

  public get enableVirtualization(): boolean {
    return this.scrollMode === 'virtual' || this.scrollMode === 'compression' || false;
  }

  public get pageSettings(): any {
    return this.scrollMode === 'paging' ? {
      rowPageSize: 10,
      columnPageSize: 6,
      currentColumnPage: 1,
      currentRowPage: 1
    } : {};
  }

  public get pagerSettings(): any {
    return this.scrollMode === 'paging' ? {
      position: 'Bottom',
      enableCompactView: false,
      showColumnPager: true,
      showRowPager: true,
      columnPageSizes: [3, 6, 9, 12],
      rowPageSizes: [10, 50, 100, 200],
      isInversed: false,
      showColumnPageSize: true,
      showRowPageSize: true
    } : {};
  }

  public formatSeconds(milliseconds: number): string {
    return milliseconds > 0 ? (milliseconds / 1000).toFixed(3) : '—';
  }

  private updateMetrics(partial: Partial<MetricsData>): void {
    this.metrics = { ...this.metrics, ...partial };
  }

  private updateDOMMetrics(): void {
    if (!this.pivotRef || !this.pivotRef.element) return;
    const rowsInDOM = this.pivotRef.element.querySelectorAll('tr.e-row').length;
    this.updateMetrics({ rowsInDOM: rowsInDOM });
  }

  private setupContextMenuHandler(): void {
    const cEle = select('ul.e-contextmenu', document);
    if (cEle && (cEle as any)['ej2_instances'] && (cEle as any)['ej2_instances'][0]) {
      const menu = (cEle as any)['ej2_instances'][0];
      const originalSelect = menu.select && menu.select.bind(menu);
      menu.select = (args: any): void => {
        if (args.element.textContent === 'Group') {
          this.pendingActionType = 'Grouping field';
        } else if (args.element.textContent === 'Ungroup') {
          this.pendingActionType = 'Ungrouping field';
        }
        if (originalSelect) {
          originalSelect(args);
        }
      };
    }
  }

  public onCreated(): void {
    this.initialLoadTime = new Date().getTime();
  }

  public onActionBegin(args: any): void {
    const trackable = ['Sort field', 'Drill down', 'Drill up'];
    if (trackable.includes(args.actionName)) {
      this.actionStartTime = new Date().getTime();
      if (args.actionName === 'Sort field') {
        this.pendingActionType = args.actionName + ' - ' + args.fieldInfo.axis;
      } else {
        this.pendingActionType = args.actionName;
      }
    }
  }

  public onMemberFiltering(args: any): void {
    const fieldName = args.filterSettings.name;
    const columns = args.dataSourceSettings.columns.map((c: any) => c.name);
    const rows = args.dataSourceSettings.rows.map((c: any) => c.name);
    if (columns.includes(fieldName)) {
      this.pendingActionType = 'Member filtering - column';
    } else if (rows.includes(fieldName)) {
      this.pendingActionType = 'Member filtering - row';
    }
  }

  public onMemberEditorOpen(args: any): void {
    const fieldName = args.fieldName;
    const columns = this.pivotRef.dataSourceSettings.columns.map((c: any) => c.name);
    const rows = this.pivotRef.dataSourceSettings.rows.map((c: any) => c.name);
    if (columns.includes(fieldName)) {
      this.pendingActionType = 'Member editor open - column';
    } else if (rows.includes(fieldName)) {
      this.pendingActionType = 'Member editor open - row';
    }
  }

  public onEnginePopulating(): void {
    const trackableActions = [
      'Member editor open - row',
      'Member editor open - column',
      'Member filtering - row',
      'Member filtering - column',
      'Grouping field',
      'Ungrouping field'
    ];
    if (trackableActions.includes(this.pendingActionType)) {
      this.actionStartTime = new Date().getTime();
    }
  }

  public onModeChange(e: any): void {
    const mode = e.value as 'virtual' | 'compression' | 'paging';
    if (mode !== this.scrollMode) {
      this.resetMetrics();
      this.scrollMode = mode;
      this.pivotRef.refresh();
    }
  }

  public resetMetrics(): void {
    if (this.isInit && !this.loaded) {
      this.metrics = { ...EMPTY_METRICS };
      this.loaded = false;
      return;
    }
    // unbind data from pivot — preserve axis field config (rows/columns/values/filters)
    this.pivotRef.setProperties({
      dataSourceSettings: {
        dataSource: [],
        groupSettings: [],
        drilledMembers: [],
        sortSettings: [],
        filterSettings: [],
        valueSortSettings: {}
      }
    }, true);
    this.isInit = true;
    this.initialLoadTime = 0;
    this.pendingActionType = '';
    this.actionStartTime = 0;
    this.pivotRef.refresh();
    this.metrics = { ...EMPTY_METRICS };
    this.loaded = false;
  }

  public handleLoad(): void {
    if (this.loaded) return;
    const pivotData = this.scrollMode === 'compression' ? UniversityDataCompressed : UniversityData;

    // start timing BEFORE binding
    this.isInit = true;
    this.initialLoadTime = new Date().getTime();

    // bind directly to pivot instance
    this.pivotRef.dataSourceSettings.dataSource = pivotData;
    this.loaded = true;
    // Update total dataset rows on load
    this.updateMetrics({ totalDatasetRows: TOTAL_DATA_ROWS });
  }

  public onDataBound(): void {
    if (((this.pivotRef.dataSourceSettings.dataSource as any) || []).length > 0) {
      if (this.isInit && this.initialLoadTime) {
        const loadTime = new Date().getTime() - this.initialLoadTime;
        this.updateMetrics({ initialLoadTime: loadTime });
        this.setupContextMenuHandler();
        this.isInit = false;
        this.initialLoadTime = 0;
      }
    }
    // Do not clear pendingActionType / actionStartTime here — actionComplete
    // may run after dataBound for the same user action and needs those values.
    this.updateDOMMetrics();
  }

  public onActionComplete(): void {
    if (!this.pendingActionType || !this.actionStartTime) {
      return;
    }
    const time = new Date().getTime() - this.actionStartTime;
    const type = this.pendingActionType;
    this.pendingActionType = '';
    this.actionStartTime = 0;

    if (type === 'Sort field - columns') {
      this.updateMetrics({ columnsSortingTime: time });
    } else if (type === 'Sort field - rows') {
      this.updateMetrics({ rowsSortingTime: time });
    } else if (type === 'Member filtering - column') {
      this.updateMetrics({ filteringTimeColumn: time });
    } else if (type === 'Member filtering - row') {
      this.updateMetrics({ filteringTimeRow: time });
    } else if (type === 'Member editor open - column') {
      this.updateMetrics({ clearFilteringTimeColumn: time });
    } else if (type === 'Member editor open - row') {
      this.updateMetrics({ clearFilteringTimeRow: time });
    } else if (type === 'Grouping field') {
      this.updateMetrics({ groupingTime: time });
    } else if (type === 'Ungrouping field') {
      this.updateMetrics({ ungroupingTime: time });
    } else if (type === 'Drill down') {
      this.updateMetrics({ drillDownTime: time });
    } else if (type === 'Drill up') {
      this.updateMetrics({ drillUpTime: time });
    }
  }

  public onLoad(args: any): void {
    if (Browser.isDevice) {
      args.dataSourceSettings.rows = [{ name: 'rank_display', caption: 'Rank', expandAll: true, allowDragAndDrop: false }];
    }
  }
}
