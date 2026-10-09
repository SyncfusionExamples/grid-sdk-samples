import * as React from 'react';
import { select, Browser } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import {
  PivotViewComponent, Inject, FieldList, CalculatedField, Toolbar, GroupingBar,
  VirtualScroll, Pager, DrillThrough, Grouping, PDFExport, ExcelExport,
  ConditionalFormatting, NumberFormatting
} from '@syncfusion/ej2-react-pivotview';
import type {
  IDataOptions, PivotActionCompleteEventArgs
} from '@syncfusion/ej2-react-pivotview';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

import { getPerformanceData } from './datasource';
import './App.css';

const TOTAL_DATA_ROWS = 1000000;

/** Metrics displayed in the side panel (updated via setState on MetricsPanel only). */
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

/** Parent state only for values that must remount/reconfigure the PivotView. */
interface PerformanceState {
  scrollMode: 'virtual' | 'compression' | 'paging';
}

// University data - with rank_display (normal)
const UniversityData: any[] = getPerformanceData(1000000, false);

// University data with data compression format
const UniversityDataCompressed: any[] = getPerformanceData(1000000, true);

/**
 * Isolated metrics panel: setState here re-renders ONLY this panel,
 * so PivotViewComponent is never remounted/updated for benchmark metrics.
 */
class MetricsPanel extends React.Component<{}, MetricsData> {
  constructor(props: {}) {
    super(props);
    this.state = { ...EMPTY_METRICS };
  }

  public updateMetrics(partial: Partial<MetricsData>): void {
    this.setState(partial as Pick<MetricsData, keyof MetricsData>);
  }

  public resetMetrics(): void {
    this.setState({ ...EMPTY_METRICS });
  }

  private formatSeconds(milliseconds: number): string {
    return milliseconds > 0 ? (milliseconds / 1000).toFixed(3) : '—';
  }

  render() {
    const {
      initialLoadTime,
      columnsSortingTime,
      rowsSortingTime,
      filteringTimeRow,
      filteringTimeColumn,
      groupingTime,
      ungroupingTime,
      drillDownTime,
      drillUpTime,
      clearFilteringTimeRow,
      clearFilteringTimeColumn,
      rowsInDOM,
      totalDatasetRows,
    } = this.state;

    return (
      <div className="panel">
        <div className="panel-head">
          <span className="panel-head-text">Performance Metrics</span>
        </div>
        <div className="metrics-body metrics-body--full">
          <BigCard
            label="Initial Load Time"
            value={this.formatSeconds(initialLoadTime)}
            unit="s"
          />
          <Section label="Sorting">
            <MiniCard label="Column Sort" value={this.formatSeconds(columnsSortingTime)} unit="s" />
            <MiniCard label="Row Sort" value={this.formatSeconds(rowsSortingTime)} unit="s" />
          </Section>
          <Section label="Filtering">
            <MiniCard label="Column Filter" value={this.formatSeconds(filteringTimeColumn)} unit="s" />
            <MiniCard label="Row Filter" value={this.formatSeconds(filteringTimeRow)} unit="s" />
          </Section>
          <Section label="Clear Filtering">
            <MiniCard label="Column Clear" value={this.formatSeconds(clearFilteringTimeColumn)} unit="s" />
            <MiniCard label="Row Clear" value={this.formatSeconds(clearFilteringTimeRow)} unit="s" />
          </Section>
          <Section label="Grouping">
            <MiniCard label="Applied Group" value={this.formatSeconds(groupingTime)} unit="s" />
            <MiniCard label="Removed Group" value={this.formatSeconds(ungroupingTime)} unit="s" />
          </Section>
          <Section label="Drill">
            <MiniCard label="Drill Down" value={this.formatSeconds(drillDownTime)} unit="s" />
            <MiniCard label="Drill Up" value={this.formatSeconds(drillUpTime)} unit="s" />
          </Section>
          <Section label="DOM Insights">
            <MiniCard label="Rows in DOM" value={`${rowsInDOM}`} unit="rows" />
            <MiniCard label="Total Dataset" value={totalDatasetRows.toLocaleString()} unit="rows" />
          </Section>
        </div>
      </div>
    );
  }
}

/**
 * Toolbar controls with their own loaded flag state so Load/Reset button
 * updates do not force a PivotView re-render via the parent.
 */
interface ToolbarProps {
  scrollMode: 'virtual' | 'compression' | 'paging';
  scrollModeItems: { text: string; value: string }[];
  onModeChange: (mode: 'virtual' | 'compression' | 'paging') => void;
  onLoad: () => void;
  onReset: () => void;
}

interface ToolbarState {
  loaded: boolean;
}

class BenchmarkToolbar extends React.Component<ToolbarProps, ToolbarState> {
  constructor(props: ToolbarProps) {
    super(props);
    this.state = { loaded: false };
  }

  public setLoaded(loaded: boolean): void {
    this.setState({ loaded });
  }

  public getLoaded(): boolean {
    return this.state.loaded;
  }

  render() {
    const { scrollMode, scrollModeItems, onModeChange, onLoad, onReset } = this.props;
    const { loaded } = this.state;

    return (
      <div className="top-toolbar">
        <div className="toolbar-group">
          <div className="toolbar-column">
            <span className="toolbar-label">Benchmark Mode</span>
            <DropDownListComponent
              dataSource={scrollModeItems}
              fields={{ text: 'text', value: 'value' }}
              value={scrollMode}
              width={150}
              change={(e: any) => {
                const mode = e.value as 'virtual' | 'compression' | 'paging';
                if (mode !== scrollMode) {
                  onModeChange(mode);
                }
              }}
            />
          </div>
        </div>

        <div className="vertical-separator" aria-hidden="true" />

        <div className="toolbar-actions">
          <ButtonComponent
            cssClass={'e-primary'}
            disabled={loaded}
            onClick={onLoad}
          >
            {loaded ? 'Loaded' : 'Load Data'}
          </ButtonComponent>

          <ButtonComponent
            cssClass={`reset-button`}
            onClick={onReset}
          >
            Reset
          </ButtonComponent>
        </div>
      </div>
    );
  }
}

export default class Performance extends React.Component<{}, PerformanceState> {
  public isInit: boolean = true;
  public initialLoadTime!: number;
  public pivotRef: any = React.createRef<PivotViewComponent | undefined>();

  private metricsRef = React.createRef<MetricsPanel>();
  private toolbarRef = React.createRef<BenchmarkToolbar>();

  // Synchronous cross-handler timing (avoid parent setState / re-render of Pivot)
  private _pendingActionType: string = '';
  private _actionStartTime: number = 0;

  private loaded: boolean = false;

  public scrollModeItems = [
    { text: 'Virtual Scroll', value: 'virtual' },
    { text: 'Data Compression', value: 'compression' },
    { text: 'Paging', value: 'paging' },
  ];

  private toolbarOptions: any = [
    'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList'
  ];

  /** Stable prop objects so React wrapper does not treat them as changed props. */
  private chartSettings = {
    title: 'Top Universities Analysis'
  };
  private displayOption = {
    view: 'Both' as const
  };
  private gridSettings = {
    columnWidth: 120,
    rowHeight: 36
  };

  constructor(props: any) {
    super(props);
    this.state = {
      scrollMode: 'virtual',
    };
  }

  private dataSourceSettings: IDataOptions = {
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

  private updateDOMMetrics = () => {
    if (!this.pivotRef?.current?.element) return;
    const rowsInDOM = this.pivotRef.current.element.querySelectorAll('tr.e-row').length;
    this.metricsRef.current?.updateMetrics({ rowsInDOM });
  };

  private setupContextMenuHandler = (): void => {
    const cEle = select('ul.e-contextmenu', document);
    if (cEle && cEle['ej2_instances'] && cEle['ej2_instances'][0]) {
      const menu = cEle['ej2_instances'][0];
      const originalSelect = menu.select?.bind(menu);
      menu.select = (function (this: Performance, args: any): void {
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

  public created = () => {
    this.initialLoadTime = new Date().getTime();
  };

  public actionBegin = (args: any) => {
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

  private memberFiltering = (args: any): void => {
    const fieldName = args.filterSettings.name;
    const columns = args.dataSourceSettings.columns.map((c: any) => c.name);
    const rows = args.dataSourceSettings.rows.map((c: any) => c.name);
    if (columns.includes(fieldName)) {
      this._pendingActionType = "Member filtering - column";
    } else if (rows.includes(fieldName)) {
      this._pendingActionType = "Member filtering - row";
    }
  };

  private memberEditorOpen = (args: any): void => {
    const fieldName = args.fieldName;
    const columns = this.pivotRef.current.dataSourceSettings.columns.map((c: any) => c.name);
    const rows = this.pivotRef.current.dataSourceSettings.rows.map((c: any) => c.name);
    if (columns.includes(fieldName)) {
      this._pendingActionType = "Member editor open - column";
    } else if (rows.includes(fieldName)) {
      this._pendingActionType = "Member editor open - row";
    }
  };

  private enginePopulating = () => {
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
      // pending type already set on instance — no parent setState
    }
  }

  private handleModeChange = (mode: 'virtual' | 'compression' | 'paging') => {
    this.resetMetrics();
    this.setState({ scrollMode: mode }, () => {
      this.pivotRef.current?.refresh();
    });
  };

  private resetMetrics = () => {
    if (this.isInit && !this.loaded) {
      this.metricsRef.current?.resetMetrics();
      this.toolbarRef.current?.setLoaded(false);
      return;
    }
    // unbind data from pivot — preserve axis field config (rows/columns/values/filters)
    if (this.pivotRef?.current) {
      this.pivotRef.current.setProperties({
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
    this.pivotRef?.current?.refresh();
    // Metrics/toolbar only — does NOT re-render PivotView via parent state
    this.metricsRef.current?.resetMetrics();
    this.toolbarRef.current?.setLoaded(false);
    this.loaded = false;
  };

  public handleLoad = () => {
    if (this.loaded || this.toolbarRef.current?.getLoaded()) return;
    const { scrollMode } = this.state;

    let pivotData: any[] | DataManager;
    pivotData = scrollMode === 'compression' ? UniversityDataCompressed : UniversityData;

    // start timing BEFORE binding
    this.isInit = true;
    this.initialLoadTime = new Date().getTime();

    // bind directly to pivot instance — never goes through React state
    if (this.pivotRef?.current) {
      this.pivotRef.current.dataSourceSettings.dataSource = pivotData;
    }
    this.loaded = true;
    this.toolbarRef.current?.setLoaded(true);
    // Update total dataset rows on load
    this.metricsRef.current?.updateMetrics({ totalDatasetRows: TOTAL_DATA_ROWS });
  };

  private onDataBound = (): void => {
    const pivotObj = this.pivotRef?.current;
    if ((pivotObj?.dataSourceSettings.dataSource)?.length > 0) {
      if (this.isInit && this.initialLoadTime) {
        const loadTime = new Date().getTime() - this.initialLoadTime;
        this.metricsRef.current?.updateMetrics({ initialLoadTime: loadTime });
        this.setupContextMenuHandler();
        this.isInit = false;
        this.initialLoadTime = 0;
      }
    }
    // Do not clear _pendingActionType / _actionStartTime here — actionComplete
    // may run after dataBound for the same user action and needs those values.
    this.updateDOMMetrics();
  };

  public actionComplete = (_args: PivotActionCompleteEventArgs) => {
    if (!this._pendingActionType || !this._actionStartTime) {
      return;
    }
    const time = new Date().getTime() - this._actionStartTime;
    const type = this._pendingActionType;
    this._pendingActionType = '';
    this._actionStartTime = 0;

    // setState scoped to MetricsPanel — PivotView is not re-rendered
    if (type === 'Sort field - columns') {
      this.metricsRef.current?.updateMetrics({ columnsSortingTime: time });
    } else if (type === 'Sort field - rows') {
      this.metricsRef.current?.updateMetrics({ rowsSortingTime: time });
    } else if (type === 'Member filtering - column') {
      this.metricsRef.current?.updateMetrics({ filteringTimeColumn: time });
    } else if (type === 'Member filtering - row') {
      this.metricsRef.current?.updateMetrics({ filteringTimeRow: time });
    } else if (type === 'Member editor open - column') {
      this.metricsRef.current?.updateMetrics({ clearFilteringTimeColumn: time });
    } else if (type === 'Member editor open - row') {
      this.metricsRef.current?.updateMetrics({ clearFilteringTimeRow: time });
    } else if (type === 'Grouping field') {
      this.metricsRef.current?.updateMetrics({ groupingTime: time });
    } else if (type === 'Ungrouping field') {
      this.metricsRef.current?.updateMetrics({ ungroupingTime: time });
    } else if (type === 'Drill down') {
      this.metricsRef.current?.updateMetrics({ drillDownTime: time });
    } else if (type === 'Drill up') {
      this.metricsRef.current?.updateMetrics({ drillUpTime: time });
    }
  };

  private load = (args: any): void => {
    if (Browser.isDevice) {
      args.dataSourceSettings.rows = [{ name: 'rank_display', caption: 'Rank', expandAll: true, allowDragAndDrop: false }];
    }
  };

  /**
   * Only re-render when benchmark mode changes. Metric/timing UI updates are
   * relegated to MetricsPanel / BenchmarkToolbar and must not reach PivotView.
   */
  shouldComponentUpdate(_nextProps: {}, nextState: PerformanceState): boolean {
    return nextState.scrollMode !== this.state.scrollMode;
  }

  render() {
    const { scrollMode } = this.state;

    return (
      <div className="app-body" >
        <BenchmarkToolbar
          ref={this.toolbarRef}
          scrollMode={scrollMode}
          scrollModeItems={this.scrollModeItems}
          onModeChange={this.handleModeChange}
          onLoad={this.handleLoad}
          onReset={this.resetMetrics}
        />
        <div className='outer-content'>
          <div className='pivot-performance-container'>
            <PivotViewComponent
              id='PivotView'
              ref={this.pivotRef}
              dataSourceSettings={this.dataSourceSettings}
              width={'100%'}
              height={'100%'}
              showFieldList={true}
              exportAllPages={false}
              maxNodeLimitInMemberEditor={50}
              showGroupingBar={true}
              allowGrouping={true}
              enableVirtualization={scrollMode === 'virtual' || scrollMode === 'compression' || false}
              allowDataCompression={scrollMode === 'compression'}
              allowDeferLayoutUpdate={true}
              allowDrillThrough={true}
              enablePaging={scrollMode === 'paging'}
              pageSettings={scrollMode === 'paging' ? {
                rowPageSize: 10,
                columnPageSize: 6,
                currentColumnPage: 1,
                currentRowPage: 1
              } : {}}
              pagerSettings={scrollMode === 'paging' ? {
                position: 'Bottom',
                enableCompactView: false,
                showColumnPager: true,
                showRowPager: true,
                columnPageSizes: [3, 6, 9, 12],
                rowPageSizes: [10, 50, 100, 200],
                isInversed: false,
                showColumnPageSize: true,
                showRowPageSize: true
              } : {}}
              gridSettings={this.gridSettings}
              allowExcelExport={true}
              allowNumberFormatting={true}
              allowConditionalFormatting={true}
              allowPdfExport={true}
              showToolbar={true}
              allowCalculatedField={true}
              displayOption={this.displayOption}
              toolbar={this.toolbarOptions}
              dataBound={this.onDataBound}
              actionBegin={this.actionBegin}
              actionComplete={this.actionComplete}
              memberFiltering={this.memberFiltering}
              memberEditorOpen={this.memberEditorOpen}
              enginePopulating={this.enginePopulating}
              created={this.created}
              load={this.load}
              chartSettings={this.chartSettings}
              enableFieldSearching={true}
            >
              <Inject services={[
                FieldList, CalculatedField, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting,
                GroupingBar, Grouping, VirtualScroll, DrillThrough, Pager
              ]} />
            </PivotViewComponent>
          </div>
          <MetricsPanel ref={this.metricsRef} />
        </div>
      </div>
    );
  }
}

/* ══════════════ Sub-Components ══════════════ */

function Section({ label, children }: {
  label: string; children: React.ReactNode;
}) {
  return (
    <div className="section section--primary">
      <div className="section-label section-label--primary">{label}</div>
      <div className="section-row">{children}</div>
    </div>
  );
}

function MiniCard({ label, value, unit }: {
  label: string; value: string; unit: string;
}) {
  return (
    <div className="mini-card mini-card--primary">
      <div className="mini-label">{label}</div>
      <div className='mini-values'>
        <div className="mini-value mini-value--primary">{value}</div>
        <div className="mini-unit mini-unit--muted">{unit}</div>
      </div>
    </div>
  );
}

function BigCard({ label, value, unit }: {
  label: string; value: string; unit: string;
}) {
  return (
    <div className="big-card">
      <div className="big-left">
        <span className="big-label">{label}</span>
      </div>
      <div className="big-right">
        <span className="big-value">{value}</span>
        <span className="big-chip">{unit}</span>
      </div>
    </div>
  );
}
