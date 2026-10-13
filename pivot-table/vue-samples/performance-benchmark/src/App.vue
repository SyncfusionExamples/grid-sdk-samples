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
            :change="onModeChange"
          ></ejs-dropdownlist>
        </div>
      </div>
      <div class="vertical-separator" aria-hidden="true"></div>
      <div class="toolbar-actions">
        <ejs-button :isPrimary="true" :disabled="loaded" @click="handleLoad">
          {{ loaded ? 'Loaded' : 'Load Data' }}
        </ejs-button>
        <ejs-button :cssClass="'reset-button'" @click="resetMetrics">Reset</ejs-button>
      </div>
    </div>
    <div class="outer-content">
      <div class="pivot-performance-container">
        <ejs-pivotview
          id="PivotView"
          ref="pivotRef"
          :dataSourceSettings="dataSourceSettings"
          :width="'100%'"
          :height="'100%'"
          :showFieldList="true"
          :exportAllPages="false"
          :maxNodeLimitInMemberEditor="50"
          :showGroupingBar="true"
          :allowGrouping="true"
          :enableVirtualization="enableVirtualization"
          :allowDataCompression="scrollMode === 'compression'"
          :allowDeferLayoutUpdate="true"
          :allowDrillThrough="true"
          :enablePaging="scrollMode === 'paging'"
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
          :chartSettings="chartSettings"
          :enableFieldSearching="true"
          :dataBound="onDataBound"
          :actionBegin="onActionBegin"
          :actionComplete="onActionComplete"
          :memberFiltering="onMemberFiltering"
          :memberEditorOpen="onMemberEditorOpen"
          :enginePopulating="onEnginePopulating"
          :created="onCreated"
          :load="onLoad"
        ></ejs-pivotview>
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

<script>
import { select, Browser } from '@syncfusion/ej2-base';
import {
  PivotViewComponent, FieldList, CalculatedField, Toolbar, GroupingBar,
  VirtualScroll, Pager, DrillThrough, Grouping, PDFExport, ExcelExport,
  ConditionalFormatting, NumberFormatting
} from '@syncfusion/ej2-vue-pivotview';
import { DropDownListComponent } from '@syncfusion/ej2-vue-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-vue-buttons';

import { getPerformanceData } from './datasource.js';
import './App.css';

const TOTAL_DATA_ROWS = 1000000;

// University data - with rank_display (normal)
const UniversityData = getPerformanceData(1000000, false);

// University data with data compression format
const UniversityDataCompressed = getPerformanceData(1000000, true);

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
  totalDatasetRows: 0
};

export default {
  components: {
    'ejs-pivotview': PivotViewComponent,
    'ejs-dropdownlist': DropDownListComponent,
    'ejs-button': ButtonComponent
  },
  data() {
    return {
      TOTAL_DATA_ROWS: TOTAL_DATA_ROWS,
      isInit: true,
      initialLoadTime: 0,
      loaded: false,
      pendingActionType: '',
      actionStartTime: 0,
      scrollMode: 'virtual',
      metrics: { ...EMPTY_METRICS },
      scrollModeItems: [
        { text: 'Virtual Scroll', value: 'virtual' },
        { text: 'Data Compression', value: 'compression' },
        { text: 'Paging', value: 'paging' }
      ],
      toolbarOptions: ['Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList'],
      chartSettings: {
        title: 'Top Universities Analysis'
      },
      displayOption: {
        view: 'Both'
      },
      gridSettings: {
        columnWidth: 120,
        rowHeight: 36
      },
      dataSourceSettings: {
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
      }
    };
  },
  computed: {
    enableVirtualization() {
      return this.scrollMode === 'virtual' || this.scrollMode === 'compression' || false;
    },
    pageSettings() {
      return this.scrollMode === 'paging' ? {
        rowPageSize: 10,
        columnPageSize: 6,
        currentColumnPage: 1,
        currentRowPage: 1
      } : {};
    },
    pagerSettings() {
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
  },
  methods: {
    formatSeconds(milliseconds) {
      return milliseconds > 0 ? (milliseconds / 1000).toFixed(3) : '—';
    },
    updateMetrics(partial) {
      this.metrics = { ...this.metrics, ...partial };
    },
    resetMetricsObject() {
      this.metrics = { ...EMPTY_METRICS };
    },
    updateDOMMetrics() {
      const pivot = this.$refs.pivotRef;
      if (!pivot || !pivot.ej2Instances || !pivot.ej2Instances.element) return;
      const rowsInDOM = pivot.ej2Instances.element.querySelectorAll('tr.e-row').length;
      this.updateMetrics({ rowsInDOM: rowsInDOM });
    },
    setupContextMenuHandler() {
      const cEle = select('ul.e-contextmenu', document);
      if (cEle && cEle['ej2_instances'] && cEle['ej2_instances'][0]) {
        const menu = cEle['ej2_instances'][0];
        const originalSelect = menu.select && menu.select.bind(menu);
        menu.select = (args) => {
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
    },
    onCreated() {
      this.initialLoadTime = new Date().getTime();
    },
    onActionBegin(args) {
      const trackable = ['Sort field', 'Drill down', 'Drill up'];
      if (trackable.includes(args.actionName)) {
        this.actionStartTime = new Date().getTime();
        if (args.actionName === 'Sort field') {
          this.pendingActionType = args.actionName + ' - ' + args.fieldInfo.axis;
        } else {
          this.pendingActionType = args.actionName;
        }
      }
    },
    onMemberFiltering(args) {
      const fieldName = args.filterSettings.name;
      const columns = args.dataSourceSettings.columns.map((c) => c.name);
      const rows = args.dataSourceSettings.rows.map((c) => c.name);
      if (columns.includes(fieldName)) {
        this.pendingActionType = 'Member filtering - column';
      } else if (rows.includes(fieldName)) {
        this.pendingActionType = 'Member filtering - row';
      }
    },
    onMemberEditorOpen(args) {
      const pivot = this.$refs.pivotRef.ej2Instances;
      const fieldName = args.fieldName;
      const columns = pivot.dataSourceSettings.columns.map((c) => c.name);
      const rows = pivot.dataSourceSettings.rows.map((c) => c.name);
      if (columns.includes(fieldName)) {
        this.pendingActionType = 'Member editor open - column';
      } else if (rows.includes(fieldName)) {
        this.pendingActionType = 'Member editor open - row';
      }
    },
    onEnginePopulating() {
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
    },
    onModeChange(e) {
      const mode = e.value;
      if (mode !== this.scrollMode) {
        this.resetMetrics();
        this.scrollMode = mode;
        this.$refs.pivotRef.ej2Instances.refresh();
      }
    },
    resetMetrics() {
      if (this.isInit && !this.loaded) {
        this.resetMetricsObject();
        this.loaded = false;
        return;
      }
      const pivot = this.$refs.pivotRef.ej2Instances;
      // unbind data from pivot — preserve axis field config (rows/columns/values/filters)
      pivot.setProperties({
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
      pivot.refresh();
      this.resetMetricsObject();
      this.loaded = false;
    },
    handleLoad() {
      if (this.loaded) return;
      const pivotData = this.scrollMode === 'compression' ? UniversityDataCompressed : UniversityData;

      // start timing BEFORE binding
      this.isInit = true;
      this.initialLoadTime = new Date().getTime();

      // bind directly to pivot instance
      const pivot = this.$refs.pivotRef.ej2Instances;
      pivot.dataSourceSettings.dataSource = pivotData;
      this.loaded = true;
      // Update total dataset rows on load
      this.updateMetrics({ totalDatasetRows: TOTAL_DATA_ROWS });
    },
    onDataBound() {
      const pivot = this.$refs.pivotRef.ej2Instances;
      if ((pivot.dataSourceSettings.dataSource || []).length > 0) {
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
    },
    onActionComplete() {
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
    },
    onLoad(args) {
      if (Browser.isDevice) {
        args.dataSourceSettings.rows = [{ name: 'rank_display', caption: 'Rank', expandAll: true, allowDragAndDrop: false }];
      }
    }
  },
  provide: {
    pivotview: [
      FieldList, CalculatedField, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting,
      GroupingBar, Grouping, VirtualScroll, DrillThrough, Pager
    ]
  }
};
</script>
