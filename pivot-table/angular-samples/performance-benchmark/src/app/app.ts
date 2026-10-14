import { Component, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { select, Browser } from '@syncfusion/ej2-base';
import {
  PivotViewModule, FieldListService, CalculatedFieldService, ToolbarService,
  GroupingBarService, GroupingService, VirtualScrollService, PagerService,
  DrillThroughService, PDFExportService, ExcelExportService,
  ConditionalFormattingService, NumberFormattingService, PivotViewComponent,
  IDataOptions, PivotActionCompleteEventArgs
} from '@syncfusion/ej2-angular-pivotview';
import { DropDownListComponent, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { getPerformanceData } from './datasource';

const TOTAL_DATA_ROWS = 1000000;

/** Metrics displayed in the side panel. */
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

const EMPTY_METRICS: MetricsData = {
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
  totalDatasetRows: 0,
};

@Component({
  selector: 'app-root',
  imports: [PivotViewModule, DropDownListModule, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    FieldListService, CalculatedFieldService, ToolbarService, GroupingBarService,
    GroupingService, VirtualScrollService, PagerService, DrillThroughService,
    PDFExportService, ExcelExportService, ConditionalFormattingService, NumberFormattingService
  ]
})
export class App {
  @ViewChild('pivotview') public pivotRef!: PivotViewComponent;
  @ViewChild('metricsPanel') public metricsPanel!: MetricsPanelComponent;
  @ViewChild('toolbar') public toolbar!: BenchmarkToolbarComponent;

  public isInit: boolean = true;
  public initialLoadTime!: number;

  // Synchronous cross-handler timing (avoid re-render of Pivot for metrics)
  private _pendingActionType: string = '';
  private _actionStartTime: number = 0;

  private loaded: boolean = false;

  public scrollMode: 'virtual' | 'compression' | 'paging' = 'virtual';

  public scrollModeItems: { [key: string]: Object }[] = [
    { text: 'Virtual Scroll', value: 'virtual' },
    { text: 'Data Compression', value: 'compression' },
    { text: 'Paging', value: 'paging' },
  ];

  public scrollModeFields: Object = { text: 'text', value: 'value' };

  public toolbarOptions: any = [
    'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList'
  ];

  public chartSettings = {
    title: 'Top Universities Analysis'
  };
  public displayOption = {
    view: 'Both' as const
  };
  public gridSettings = {
    columnWidth: 120,
    rowHeight: 36
  };

  public pageSettings: Object = {
    rowPageSize: 10,
    columnPageSize: 6,
    currentColumnPage: 1,
    currentRowPage: 1
  };

  public pagerSettings: Object = {
    position: 'Bottom',
    enableCompactView: false,
    showColumnPager: true,
    showRowPager: true,
    columnPageSizes: [3, 6, 9, 12],
    rowPageSizes: [10, 50, 100, 200],
    isInversed: false,
    showColumnPageSize: true,
    showRowPageSize: true
  };

  public emptyPageSettings: Object = {};
  public emptyPagerSettings: Object = {};

  // University data - with rank_display (normal)
  public UniversityData: any[] = getPerformanceData(1000000, false);

  // University data with data compression format
  public UniversityDataCompressed: any[] = getPerformanceData(1000000, true);

  public dataSourceSettings: IDataOptions = {
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
      { name: 'score', caption: 'Score' },
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

  public created = (): void => {
    this.initialLoadTime = new Date().getTime();
  };

  public load = (args: any): void => {
    if (Browser.isDevice) {
      args.dataSourceSettings.rows = [{ name: 'rank_display', caption: 'Rank', expandAll: true, allowDragAndDrop: false }];
    }
  };

  public actionBegin = (args: any): void => {
    const trackable = ['Sort field', 'Drill down', 'Drill up'];
    if (trackable.includes(args.actionName)) {
      this._actionStartTime = new Date().getTime();
      if (args.actionName === 'Sort field') {
        this._pendingActionType = args.actionName + ' - ' + args.fieldInfo.axis;
      } else {
        this._pendingActionType = args.actionName;
      }
    }
  };

  public memberFiltering = (args: any): void => {
    const fieldName = args.filterSettings.name;
    const columns = args.dataSourceSettings.columns.map((c: any) => c.name);
    const rows = args.dataSourceSettings.rows.map((c: any) => c.name);
    if (columns.includes(fieldName)) {
      this._pendingActionType = "Member filtering - column";
    } else if (rows.includes(fieldName)) {
      this._pendingActionType = "Member filtering - row";
    }
  };

  public memberEditorOpen = (args: any): void => {
    const fieldName = args.fieldName;
    const columns = this.pivotRef.dataSourceSettings.columns.map((c: any) => c.name);
    const rows = this.pivotRef.dataSourceSettings.rows.map((c: any) => c.name);
    if (columns.includes(fieldName)) {
      this._pendingActionType = "Member editor open - column";
    } else if (rows.includes(fieldName)) {
      this._pendingActionType = "Member editor open - row";
    }
  };

  public enginePopulating = (): void => {
    const trackableActions = [
      "Member editor open - row",
      "Member editor open - column",
      "Member filtering - row",
      "Member filtering - column",
      "Grouping field",
      "Ungrouping field"
    ];
    if (trackableActions.includes(this._pendingActionType)) {
      this._actionStartTime = new Date().getTime();
    }
  };

  public handleModeChange = (mode: 'virtual' | 'compression' | 'paging'): void => {
    this.resetMetrics();
    this.scrollMode = mode;
    this.pivotRef.refresh();
  };

  public onModeChange = (e: any): void => {
    const mode = e.value as 'virtual' | 'compression' | 'paging';
    if (mode !== this.scrollMode) {
      this.handleModeChange(mode);
    }
  };

  public resetMetrics = (): void => {
    if (this.isInit && !this.loaded) {
      this.metricsPanel?.resetMetrics();
      this.toolbar?.setLoaded(false);
      return;
    }
    // unbind data from pivot — preserve axis field config (rows/columns/values/filters)
    if (this.pivotRef) {
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
    }
    this.isInit = true;
    this.initialLoadTime = 0;
    this._pendingActionType = '';
    this._actionStartTime = 0;
    this.pivotRef?.refresh();
    this.metricsPanel?.resetMetrics();
    this.toolbar?.setLoaded(false);
    this.loaded = false;
  };

  public handleLoad = (): void => {
    if (this.loaded || this.toolbar?.getLoaded()) return;

    let pivotData: any[];
    pivotData = this.scrollMode === 'compression' ? this.UniversityDataCompressed : this.UniversityData;

    // start timing BEFORE binding
    this.isInit = true;
    this.initialLoadTime = new Date().getTime();

    // bind directly to pivot instance
    if (this.pivotRef) {
      this.pivotRef.dataSourceSettings.dataSource = pivotData;
    }
    this.loaded = true;
    this.toolbar?.setLoaded(true);
    // Update total dataset rows on load
    this.metricsPanel?.updateMetrics({ totalDatasetRows: TOTAL_DATA_ROWS });
  };

  public onDataBound = (): void => {
    if ((this.pivotRef?.dataSourceSettings.dataSource)?.length > 0) {
      if (this.isInit && this.initialLoadTime) {
        const loadTime = new Date().getTime() - this.initialLoadTime;
        this.metricsPanel?.updateMetrics({ initialLoadTime: loadTime });
        this.setupContextMenuHandler();
        this.isInit = false;
        this.initialLoadTime = 0;
      }
    }
    // Do not clear _pendingActionType / _actionStartTime here — actionComplete
    // may run after dataBound for the same user action and needs those values.
    this.updateDOMMetrics();
  };

  public actionComplete = (_args: PivotActionCompleteEventArgs): void => {
    if (!this._pendingActionType || !this._actionStartTime) {
      return;
    }
    const time = new Date().getTime() - this._actionStartTime;
    const type = this._pendingActionType;
    this._pendingActionType = '';
    this._actionStartTime = 0;

    if (type === 'Sort field - columns') {
      this.metricsPanel?.updateMetrics({ columnsSortingTime: time });
    } else if (type === 'Sort field - rows') {
      this.metricsPanel?.updateMetrics({ rowsSortingTime: time });
    } else if (type === 'Member filtering - column') {
      this.metricsPanel?.updateMetrics({ filteringTimeColumn: time });
    } else if (type === 'Member filtering - row') {
      this.metricsPanel?.updateMetrics({ filteringTimeRow: time });
    } else if (type === 'Member editor open - column') {
      this.metricsPanel?.updateMetrics({ clearFilteringTimeColumn: time });
    } else if (type === 'Member editor open - row') {
      this.metricsPanel?.updateMetrics({ clearFilteringTimeRow: time });
    } else if (type === 'Grouping field') {
      this.metricsPanel?.updateMetrics({ groupingTime: time });
    } else if (type === 'Ungrouping field') {
      this.metricsPanel?.updateMetrics({ ungroupingTime: time });
    } else if (type === 'Drill down') {
      this.metricsPanel?.updateMetrics({ drillDownTime: time });
    } else if (type === 'Drill up') {
      this.metricsPanel?.updateMetrics({ drillUpTime: time });
    }
  };

  private updateDOMMetrics = (): void => {
    if (!this.pivotRef?.element) return;
    const rowsInDOM = this.pivotRef.element.querySelectorAll('tr.e-row').length;
    this.metricsPanel?.updateMetrics({ rowsInDOM });
  };

  private setupContextMenuHandler = (): void => {
    const cEle = select('ul.e-contextmenu', document);
    if (cEle && cEle['ej2_instances'] && cEle['ej2_instances'][0]) {
      const menu = cEle['ej2_instances'][0];
      const originalSelect = menu.select?.bind(menu);
      menu.select = (function (this: App, args: any): void {
        if (args.element.textContent === 'Group') {
          this._pendingActionType = 'Grouping field';
        } else if (args.element.textContent === 'Ungroup') {
          this._pendingActionType = 'Ungrouping field';
        }
        if (originalSelect) {
          originalSelect(args);
        }
      }).bind(this);
    }
  };
}

@Component({
  selector: 'app-metrics-panel',
  imports: [],
  template: `
    <div class="panel">
      <div class="panel-head">
        <span class="panel-head-text">Performance Metrics</span>
      </div>
      <div class="metrics-body metrics-body--full">
        <app-big-card label="Initial Load Time" [value]="formatSeconds(initialLoadTime)" unit="s"></app-big-card>
        <app-section label="Sorting">
          <app-mini-card label="Column Sort" [value]="formatSeconds(columnsSortingTime)" unit="s"></app-mini-card>
          <app-mini-card label="Row Sort" [value]="formatSeconds(rowsSortingTime)" unit="s"></app-mini-card>
        </app-section>
        <app-section label="Filtering">
          <app-mini-card label="Column Filter" [value]="formatSeconds(filteringTimeColumn)" unit="s"></app-mini-card>
          <app-mini-card label="Row Filter" [value]="formatSeconds(filteringTimeRow)" unit="s"></app-mini-card>
        </app-section>
        <app-section label="Clear Filtering">
          <app-mini-card label="Column Clear" [value]="formatSeconds(clearFilteringTimeColumn)" unit="s"></app-mini-card>
          <app-mini-card label="Row Clear" [value]="formatSeconds(clearFilteringTimeRow)" unit="s"></app-mini-card>
        </app-section>
        <app-section label="Grouping">
          <app-mini-card label="Applied Group" [value]="formatSeconds(groupingTime)" unit="s"></app-mini-card>
          <app-mini-card label="Removed Group" [value]="formatSeconds(ungroupingTime)" unit="s"></app-mini-card>
        </app-section>
        <app-section label="Drill">
          <app-mini-card label="Drill Down" [value]="formatSeconds(drillDownTime)" unit="s"></app-mini-card>
          <app-mini-card label="Drill Up" [value]="formatSeconds(drillUpTime)" unit="s"></app-mini-card>
        </app-section>
        <app-section label="DOM Insights">
          <app-mini-card label="Rows in DOM" [value]="rowsInDOM + ''" unit="rows"></app-mini-card>
          <app-mini-card label="Total Dataset" [value]="totalDatasetRows.toLocaleString()" unit="rows"></app-mini-card>
        </app-section>
      </div>
    </div>
  `,
  styleUrl: './app.css'
})
export class MetricsPanelComponent {
  public initialLoadTime: number = 0;
  public columnsSortingTime: number = 0;
  public rowsSortingTime: number = 0;
  public filteringTimeRow: number = 0;
  public filteringTimeColumn: number = 0;
  public groupingTime: number = 0;
  public ungroupingTime: number = 0;
  public drillDownTime: number = 0;
  public drillUpTime: number = 0;
  public clearFilteringTimeRow: number = 0;
  public clearFilteringTimeColumn: number = 0;
  public rowsInDOM: number = 0;
  public totalDatasetRows: number = 0;

  public updateMetrics(partial: Partial<MetricsData>): void {
    Object.assign(this, partial);
  }

  public resetMetrics(): void {
    this.initialLoadTime = 0;
    this.columnsSortingTime = 0;
    this.rowsSortingTime = 0;
    this.filteringTimeRow = 0;
    this.filteringTimeColumn = 0;
    this.groupingTime = 0;
    this.ungroupingTime = 0;
    this.drillDownTime = 0;
    this.drillUpTime = 0;
    this.clearFilteringTimeRow = 0;
    this.clearFilteringTimeColumn = 0;
    this.rowsInDOM = 0;
    this.totalDatasetRows = 0;
  }

  public formatSeconds(milliseconds: number): string {
    return milliseconds > 0 ? (milliseconds / 1000).toFixed(3) : '—';
  }
}

@Component({
  selector: 'app-section',
  imports: [],
  template: `
    <div class="section section--primary">
      <div class="section-label section-label--primary">{{ label }}</div>
      <div class="section-row"><ng-content></ng-content></div>
    </div>
  `
})
export class SectionComponent {
  public label: string = '';
}

@Component({
  selector: 'app-mini-card',
  imports: [],
  template: `
    <div class="mini-card mini-card--primary">
      <div class="mini-label">{{ label }}</div>
      <div class="mini-values">
        <div class="mini-value mini-value--primary">{{ value }}</div>
        <div class="mini-unit mini-unit--muted">{{ unit }}</div>
      </div>
    </div>
  `
})
export class MiniCardComponent {
  public label: string = '';
  public value: string = '';
  public unit: string = '';
}

@Component({
  selector: 'app-big-card',
  imports: [],
  template: `
    <div class="big-card">
      <div class="big-left">
        <span class="big-label">{{ label }}</span>
      </div>
      <div class="big-right">
        <span class="big-value">{{ value }}</span>
        <span class="big-chip">{{ unit }}</span>
      </div>
    </div>
  `
})
export class BigCardComponent {
  @Input() public label: string = '';
  @Input() public value: string = '';
  @Input() public unit: string = '';
}

@Component({
  selector: 'app-benchmark-toolbar',
  imports: [],
  template: `
    <div class="top-toolbar">
      <div class="toolbar-group">
        <div class="toolbar-column">
          <span class="toolbar-label">Benchmark Mode</span>
        </div>
      </div>

      <div class="vertical-separator" aria-hidden="true"></div>

      <div class="toolbar-actions">
        <button ej-button cssClass="e-primary" [disabled]="loaded" (click)="load.emit()">
          {{ loaded ? 'Loaded' : 'Load Data' }}
        </button>
        <button ej-button cssClass="reset-button" (click)="reset.emit()">Reset</button>
      </div>
    </div>
  `
})
export class BenchmarkToolbarComponent {
  public loaded: boolean = false;

  public setLoaded(loaded: boolean): void {
    this.loaded = loaded;
  }

  public getLoaded(): boolean {
    return this.loaded;
  }
}
