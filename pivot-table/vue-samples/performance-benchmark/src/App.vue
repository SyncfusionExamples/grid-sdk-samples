<template>
  <div class="app-body">
    <div class="top-toolbar">
      <div class="toolbar-group">
        <div class="toolbar-column">
          <span class="toolbar-label">Benchmark Mode</span>
          <ejs-dropdownlist
            :dataSource="scrollModeItems"
            :fields="{ text: 'text', value: 'value' }"
            :value="scrollMode"
            :width="150"
            :change="handleModeChange"
          />
        </div>
      </div>

      <div class="vertical-separator" aria-hidden="true" />

      <div class="toolbar-actions">
        <ejs-button
          :cssClass="'e-primary'"
          :disabled="loaded"
          @click="handleLoad"
        >
          {{ loaded ? 'Loaded' : 'Load Data' }}
        </ejs-button>
        <ejs-button :cssClass="'reset-button'" @click="handleReset">
          Reset
        </ejs-button>
      </div>
    </div>

    <div class="outer-content">
      <div class="pivot-performance-container">
        <ejs-pivotview
          id="PivotView"
          ref="pivotRef"
          :dataSourceSettings="dataSourceSettings"
          width="100%"
          height="100%"
          :showFieldList="true"
          :exportAllPages="false"
          :maxNodeLimitInMemberEditor="50"
          :showGroupingBar="true"
          :allowGrouping="true"
          :enableVirtualization="enableVirtualization"
          :allowDataCompression="allowDataCompression"
          :allowDeferLayoutUpdate="true"
          :allowDrillThrough="true"
          :enablePaging="enablePaging"
          :pageSettings="pageSettings"
          :pagerSettings="pagerSettings"
          :gridSettings="gridSettings"
          :allowExcelExport="true"
          :allowNumberFormatting="true"
          :allowConditionalFormatting="true"
          :allowPdfExport="true"
          :showToolbar="true"
          :allowCalculatedField="true"
          :displayOption="displayOption"
          :toolbar="toolbarOptions"
          :dataBound="onDataBound"
          :actionBegin="actionBegin"
          :actionComplete="actionComplete"
          :memberFiltering="memberFiltering"
          :memberEditorOpen="memberEditorOpen"
          :enginePopulating="enginePopulating"
          :created="onCreated"
          :load="onLoad"
          :chartSettings="chartSettings"
          :enableFieldSearching="true"
        >
          <e-fieldlist></e-fieldlist>
          <e-calculatedfield></e-calculatedfield>
          <e-toolbar></e-toolbar>
          <e-pdfexport></e-pdfexport>
          <e-excelexport></e-excelexport>
          <e-conditionalformatting></e-conditionalformatting>
          <e-numberformatting></e-numberformatting>
          <e-groupingbar></e-groupingbar>
          <e-grouping></e-grouping>
          <e-virtualscroll></e-virtualscroll>
          <e-drillthrough></e-drillthrough>
          <e-pager></e-pager>
        </ejs-pivotview>
      </div>

      <div class="panel">
        <div class="panel-head">
          <span class="panel-head-text">Performance Metrics</span>
        </div>
        <div class="metrics-body metrics-body--full">
          <div class="big-card">
            <div class="big-left">
              <span class="big-label">Initial Load Time</span>
            </div>
            <div class="big-right">
              <span class="big-value">{{ formatSeconds(metrics.initialLoadTime) }}</span>
              <span class="big-chip">s</span>
            </div>
          </div>

          <div class="section section--primary">
            <div class="section-label section-label--primary">Sorting</div>
            <div class="section-row">
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Column Sort</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ formatSeconds(metrics.columnsSortingTime) }}</div>
                  <div class="mini-unit mini-unit--muted">s</div>
                </div>
              </div>
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Row Sort</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ formatSeconds(metrics.rowsSortingTime) }}</div>
                  <div class="mini-unit mini-unit--muted">s</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section section--primary">
            <div class="section-label section-label--primary">Filtering</div>
            <div class="section-row">
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Column Filter</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ formatSeconds(metrics.filteringTimeColumn) }}</div>
                  <div class="mini-unit mini-unit--muted">s</div>
                </div>
              </div>
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Row Filter</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ formatSeconds(metrics.filteringTimeRow) }}</div>
                  <div class="mini-unit mini-unit--muted">s</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section section--primary">
            <div class="section-label section-label--primary">Clear Filtering</div>
            <div class="section-row">
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Column Clear</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ formatSeconds(metrics.clearFilteringTimeColumn) }}</div>
                  <div class="mini-unit mini-unit--muted">s</div>
                </div>
              </div>
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Row Clear</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ formatSeconds(metrics.clearFilteringTimeRow) }}</div>
                  <div class="mini-unit mini-unit--muted">s</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section section--primary">
            <div class="section-label section-label--primary">Grouping</div>
            <div class="section-row">
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Applied Group</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ formatSeconds(metrics.groupingTime) }}</div>
                  <div class="mini-unit mini-unit--muted">s</div>
                </div>
              </div>
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Removed Group</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ formatSeconds(metrics.ungroupingTime) }}</div>
                  <div class="mini-unit mini-unit--muted">s</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section section--primary">
            <div class="section-label section-label--primary">Drill</div>
            <div class="section-row">
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Drill Down</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ formatSeconds(metrics.drillDownTime) }}</div>
                  <div class="mini-unit mini-unit--muted">s</div>
                </div>
              </div>
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Drill Up</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ formatSeconds(metrics.drillUpTime) }}</div>
                  <div class="mini-unit mini-unit--muted">s</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section section--primary">
            <div class="section-label section-label--primary">DOM Insights</div>
            <div class="section-row">
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Rows in DOM</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ metrics.rowsInDOM }}</div>
                  <div class="mini-unit mini-unit--muted">rows</div>
                </div>
              </div>
              <div class="mini-card mini-card--primary">
                <div class="mini-label">Total Dataset</div>
                <div class="mini-values">
                  <div class="mini-value mini-value--primary">{{ metrics.totalDatasetRows.toLocaleString() }}</div>
                  <div class="mini-unit mini-unit--muted">rows</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { select, Browser } from '@syncfusion/ej2-base';
// Plugins (PivotViewPlugin, DropDownListPlugin, ButtonPlugin) are registered
// globally in main.ts; the pivot modules used by <e-*> elements are wired up
// through them.

import { getPerformanceData } from './datasource';
import './App.css';

const TOTAL_DATA_ROWS = 1000000;

const EMPTY_METRICS = {
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

/** University data - with rank_display (normal) */
const UniversityData: any[] = getPerformanceData(TOTAL_DATA_ROWS, false);

/** University data with data compression format */
const UniversityDataCompressed: any[] = getPerformanceData(TOTAL_DATA_ROWS, true);

export default defineComponent({
  name: 'Performance',

  components: {},

  setup() {
    const pivotRef = ref<{ pivotview: { [key: string]: any } | null } | null>(null);

    const scrollMode = ref<'virtual' | 'compression' | 'paging'>('virtual');
    const loaded = ref(false);

    /** Reactive metrics — updates re-render ONLY the metrics panel. */
    const metrics = reactive({ ...EMPTY_METRICS });

    // Synchronous cross-handler timing
    let pendingActionType = '';
    let actionStartTime = 0;
    let isInit = true;
    let initialLoadTime = 0;

    const scrollModeItems = [
      { text: 'Virtual Scroll', value: 'virtual' },
      { text: 'Data Compression', value: 'compression' },
      { text: 'Paging', value: 'paging' },
    ];

    const toolbarOptions: any = [
      'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList'
    ];

    const chartSettings = {
      title: 'Top Universities Analysis'
    };
    const displayOption = {
      view: 'Both'
    };
    const gridSettings = {
      columnWidth: 120,
      rowHeight: 36
    };

    const dataSourceSettings: any = {
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

    const enableVirtualization = computed(() =>
      scrollMode.value === 'virtual' || scrollMode.value === 'compression'
    );
    const allowDataCompression = computed(() => scrollMode.value === 'compression');
    const enablePaging = computed(() => scrollMode.value === 'paging');

    const pageSettings = computed(() => scrollMode.value === 'paging' ? {
      rowPageSize: 10,
      columnPageSize: 6,
      currentColumnPage: 1,
      currentRowPage: 1
    } : {});

    const pagerSettings = computed(() => scrollMode.value === 'paging' ? {
      position: 'Bottom',
      enableCompactView: false,
      showColumnPager: true,
      showRowPager: true,
      columnPageSizes: [3, 6, 9, 12],
      rowPageSizes: [10, 50, 100, 200],
      isInversed: false,
      showColumnPageSize: true,
      showRowPageSize: true
    } : {});

    const pivotInstance = (): any => {
      const inst = pivotRef.value;
      if (!inst) return null;
      if (inst.pivotview) return inst.pivotview;
      return inst as any;
    };

    const formatSeconds = (milliseconds: number): string =>
      milliseconds > 0 ? (milliseconds / 1000).toFixed(3) : '—';

    const updateDOMMetrics = () => {
      const pivotObj = pivotInstance();
      if (!pivotObj?.element) return;
      const rowsInDOM = pivotObj.element.querySelectorAll('tr.e-row').length;
      metrics.rowsInDOM = rowsInDOM;
    };

    const setupContextMenuHandler = (): void => {
      const cEle = select('ul.e-contextmenu', document);
      const anyEle = cEle as any;
      if (anyEle && anyEle['ej2_instances'] && anyEle['ej2_instances'][0]) {
        const menu = anyEle['ej2_instances'][0];
        const originalSelect = menu.select?.bind(menu);
        menu.select = function (args: any): void {
          if (args.element.textContent === 'Group') {
            pendingActionType = 'Grouping field';
          } else if (args.element.textContent === 'Ungroup') {
            pendingActionType = 'Ungrouping field';
          }
          if (originalSelect) {
            originalSelect(args);
          }
        };
      }
    };

    const onCreated = (): void => {
      initialLoadTime = Date.now();
    };

    const actionBegin = (args: any): void => {
      const trackable = ['Sort field', 'Drill down', 'Drill up'];
      if (trackable.includes(args.actionName)) {
        actionStartTime = Date.now();
        if (args.actionName === 'Sort field') {
          pendingActionType = args.actionName + ' - ' + args.fieldInfo.axis;
        } else {
          pendingActionType = args.actionName;
        }
      }
    };

    const memberFiltering = (args: any): void => {
      const fieldName = args.filterSettings.name;
      const columns = args.dataSourceSettings.columns.map((c: any) => c.name);
      const rows = args.dataSourceSettings.rows.map((c: any) => c.name);
      if (columns.includes(fieldName)) {
        pendingActionType = "Member filtering - column";
      } else if (rows.includes(fieldName)) {
        pendingActionType = "Member filtering - row";
      }
    };

    const memberEditorOpen = (args: any): void => {
      const fieldName = args.fieldName;
      const pivotObj = pivotInstance();
      if (!pivotObj) return;
      const columns = pivotObj.dataSourceSettings.columns.map((c: any) => c.name);
      const rows = pivotObj.dataSourceSettings.rows.map((c: any) => c.name);
      if (columns.includes(fieldName)) {
        pendingActionType = "Member editor open - column";
      } else if (rows.includes(fieldName)) {
        pendingActionType = "Member editor open - row";
      }
    };

    const enginePopulating = (): void => {
      const trackableActions = [
        "Member editor open - row",
        "Member editor open - column",
        "Member filtering - row",
        "Member filtering - column",
        "Grouping field",
        "Ungrouping field"
      ];
      if (trackableActions.includes(pendingActionType)) {
        actionStartTime = Date.now();
        // pending type already set — no extra state churn
      }
    };

    const handleModeChange = (e: any): void => {
      const mode = e.value as 'virtual' | 'compression' | 'paging';
      if (mode && mode !== scrollMode.value) {
        scrollMode.value = mode;
        resetMetrics();
        pivotInstance()?.refresh();
      }
    };

    const handleLoad = (): void => {
      if (loaded.value) return;
      const pivotData = scrollMode.value === 'compression' ? UniversityDataCompressed : UniversityData;

      // start timing BEFORE binding
      isInit = true;
      initialLoadTime = Date.now();

      const pivotObj = pivotInstance();
      if (pivotObj) {
        pivotObj.dataSourceSettings.dataSource = pivotData;
      }
      loaded.value = true;
      metrics.totalDatasetRows = TOTAL_DATA_ROWS;
    };

    const resetMetrics = (): void => {
      if (isInit && !loaded.value) {
        Object.assign(metrics, { ...EMPTY_METRICS });
        loaded.value = false;
        return;
      }
      // unbind data from pivot — preserve axis field config (rows/columns/values/filters)
      const pivotObj = pivotInstance();
      if (pivotObj) {
        pivotObj.setProperties({
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
      isInit = true;
      initialLoadTime = 0;
      pendingActionType = '';
      actionStartTime = 0;
      pivotObj?.refresh();
      Object.assign(metrics, { ...EMPTY_METRICS });
      loaded.value = false;
    };

    const onDataBound = (): void => {
      const pivotObj = pivotInstance();
      const ds = pivotObj?.dataSourceSettings?.dataSource;
      if (ds && ((ds as any).length ?? 0) > 0) {
        if (isInit && initialLoadTime) {
          const loadTime = Date.now() - initialLoadTime;
          metrics.initialLoadTime = loadTime;
          setupContextMenuHandler();
          isInit = false;
          initialLoadTime = 0;
        }
      }
      // Do not clear pendingActionType / actionStartTime here — actionComplete
      // may run after dataBound for the same user action and needs those values.
      updateDOMMetrics();
    };

    const actionComplete = (_args: any): void => {
      if (!pendingActionType || !actionStartTime) {
        return;
      }
      const time = Date.now() - actionStartTime;
      const type = pendingActionType;
      pendingActionType = '';
      actionStartTime = 0;

      // Reactive metrics update only — PivotView is not re-rendered
      if (type === 'Sort field - columns') {
        metrics.columnsSortingTime = time;
      } else if (type === 'Sort field - rows') {
        metrics.rowsSortingTime = time;
      } else if (type === 'Member filtering - column') {
        metrics.filteringTimeColumn = time;
      } else if (type === 'Member filtering - row') {
        metrics.filteringTimeRow = time;
      } else if (type === 'Member editor open - column') {
        metrics.clearFilteringTimeColumn = time;
      } else if (type === 'Member editor open - row') {
        metrics.clearFilteringTimeRow = time;
      } else if (type === 'Grouping field') {
        metrics.groupingTime = time;
      } else if (type === 'Ungrouping field') {
        metrics.ungroupingTime = time;
      } else if (type === 'Drill down') {
        metrics.drillDownTime = time;
      } else if (type === 'Drill up') {
        metrics.drillUpTime = time;
      }
    };

    const onLoad = (args: any): void => {
      if (Browser.isDevice) {
        args.dataSourceSettings.rows = [{ name: 'rank_display', caption: 'Rank', expandAll: true, allowDragAndDrop: false }];
      }
    };

    return {
      // refs / template state
      pivotRef,
      scrollMode,
      loaded,
      metrics,
      scrollModeItems,

      // pivot configuration (stable objects)
      dataSourceSettings,
      toolbarOptions,
      chartSettings,
      displayOption,
      gridSettings,

      // computed mode flags
      enableVirtualization,
      allowDataCompression,
      enablePaging,
      pageSettings,
      pagerSettings,

      // handlers
      formatSeconds,
      handleModeChange,
      handleLoad,
      handleReset: resetMetrics,
      onDataBound,
      actionBegin,
      actionComplete,
      memberFiltering,
      memberEditorOpen,
      enginePopulating,
      onCreated,
      onLoad,
    };
  },
});
</script>
