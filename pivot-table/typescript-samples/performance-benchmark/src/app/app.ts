import { select, Browser } from '@syncfusion/ej2-base';
import { PivotView, FieldList, CalculatedField, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting, GroupingBar, Grouping, VirtualScroll, DrillThrough, Pager, IDataOptions, PivotActionCompleteEventArgs, LoadEventArgs } from '@syncfusion/ej2-pivotview';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Button } from '@syncfusion/ej2-buttons';
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

// University data - with rank_display (normal)
const UniversityData: any[] = getPerformanceData(1000000, false);

// University data with data compression format
const UniversityDataCompressed: any[] = getPerformanceData(1000000, true);

let pivotObj: PivotView;
let metrics: MetricsData = Object.assign({}, EMPTY_METRICS);
let isInit: boolean = true;
let loaded: boolean = false;
let initialLoadTime: number = 0;
let pendingActionType: string = '';
let actionStartTime: number = 0;
let scrollMode: string = 'virtual';

let toolbarLoaded: boolean = false;

let dataSourceSettings: IDataOptions = {
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

let scrollModeItems: { [key: string]: Object }[] = [
    { text: 'Virtual Scroll', value: 'virtual' },
    { text: 'Data Compression', value: 'compression' },
    { text: 'Paging', value: 'paging' }
];

let pageSettings: Object = {
    rowPageSize: 10,
    columnPageSize: 6,
    currentColumnPage: 1,
    currentRowPage: 1
};

let pagerSettings: Object = {
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

function formatSeconds(milliseconds: number): string {
    return milliseconds > 0 ? (milliseconds / 1000).toFixed(3) : '—';
}

function resetMetricsDisplay(): void {
    metrics = Object.assign({}, EMPTY_METRICS);
    renderMetrics();
}

function renderMetrics(): void {
    (document.getElementById('metric-initial-load') as HTMLElement).textContent = formatSeconds(metrics.initialLoadTime);
    (document.getElementById('metric-column-sort') as HTMLElement).textContent = formatSeconds(metrics.columnsSortingTime);
    (document.getElementById('metric-row-sort') as HTMLElement).textContent = formatSeconds(metrics.rowsSortingTime);
    (document.getElementById('metric-column-filter') as HTMLElement).textContent = formatSeconds(metrics.filteringTimeColumn);
    (document.getElementById('metric-row-filter') as HTMLElement).textContent = formatSeconds(metrics.filteringTimeRow);
    (document.getElementById('metric-column-clear') as HTMLElement).textContent = formatSeconds(metrics.clearFilteringTimeColumn);
    (document.getElementById('metric-row-clear') as HTMLElement).textContent = formatSeconds(metrics.clearFilteringTimeRow);
    (document.getElementById('metric-group-applied') as HTMLElement).textContent = formatSeconds(metrics.groupingTime);
    (document.getElementById('metric-group-removed') as HTMLElement).textContent = formatSeconds(metrics.ungroupingTime);
    (document.getElementById('metric-drill-down') as HTMLElement).textContent = formatSeconds(metrics.drillDownTime);
    (document.getElementById('metric-drill-up') as HTMLElement).textContent = formatSeconds(metrics.drillUpTime);
    (document.getElementById('metric-rows-in-dom') as HTMLElement).textContent = String(metrics.rowsInDOM);
    (document.getElementById('metric-total-dataset') as HTMLElement).textContent = metrics.totalDatasetRows.toLocaleString();
}

function setToolbarLoaded(state: boolean): void {
    toolbarLoaded = state;
    const loadBtn = document.getElementById('load-data-btn') as HTMLButtonElement;
    if (loadBtn) {
        loadBtn.disabled = state;
        loadBtn.textContent = state ? 'Loaded' : 'Load Data';
    }
}

function updateDOMMetrics(): void {
    if (!pivotObj || !pivotObj.element) return;
    metrics.rowsInDOM = pivotObj.element.querySelectorAll('tr.e-row').length;
    renderMetrics();
}

function setupContextMenuHandler(): void {
    const cEle = select('ul.e-contextmenu', document) as any;
    if (cEle && cEle['ej2_instances'] && cEle['ej2_instances'][0]) {
        const menu = cEle['ej2_instances'][0];
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
}

function resetMetrics(): void {
    if (isInit && !loaded) {
        resetMetricsDisplay();
        setToolbarLoaded(false);
        return;
    }
    // unbind data from pivot — preserve axis field config (rows/columns/values/filters)
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
    resetMetricsDisplay();
    setToolbarLoaded(false);
    loaded = false;
}

function handleLoad(): void {
    if (loaded || toolbarLoaded) return;
    const pivotData = scrollMode === 'compression' ? UniversityDataCompressed : UniversityData;

    // start timing BEFORE binding
    isInit = true;
    initialLoadTime = new Date().getTime();

    // bind directly to pivot instance
    if (pivotObj) {
        pivotObj.dataSourceSettings.dataSource = pivotData;
    }
    loaded = true;
    setToolbarLoaded(true);
    // Update total dataset rows on load
    metrics.totalDatasetRows = TOTAL_DATA_ROWS;
    renderMetrics();
}

function onDataBound(): void {
    if (((pivotObj?.dataSourceSettings.dataSource as any[])?.length ?? 0) > 0) {
        if (isInit && initialLoadTime) {
            metrics.initialLoadTime = new Date().getTime() - initialLoadTime;
            renderMetrics();
            setupContextMenuHandler();
            isInit = false;
            initialLoadTime = 0;
        }
    }
    // Do not clear pendingActionType / actionStartTime here — actionComplete
    // may run after dataBound for the same user action and needs those values.
    updateDOMMetrics();
}

function actionComplete(args: PivotActionCompleteEventArgs): void {
    if (!pendingActionType || !actionStartTime) {
        return;
    }
    const time = new Date().getTime() - actionStartTime;
    const type = pendingActionType;
    pendingActionType = '';
    actionStartTime = 0;

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
    renderMetrics();
}

function actionBegin(args: any): void {
    const trackable = ['Sort field', 'Drill down', 'Drill up'];
    if (trackable.includes(args.actionName)) {
        actionStartTime = new Date().getTime();
        if (args.actionName === 'Sort field') {
            pendingActionType = args.actionName + ' - ' + args.fieldInfo.axis;
        } else {
            pendingActionType = args.actionName;
        }
    }
}

function memberFiltering(args: any): void {
    const fieldName = args.filterSettings.name;
    const columns = args.dataSourceSettings.columns.map((c: any) => c.name);
    const rows = args.dataSourceSettings.rows.map((c: any) => c.name);
    if (columns.includes(fieldName)) {
        pendingActionType = "Member filtering - column";
    } else if (rows.includes(fieldName)) {
        pendingActionType = "Member filtering - row";
    }
}

function memberEditorOpen(args: any): void {
    const fieldName = args.fieldName;
    const columns = (pivotObj?.dataSourceSettings.columns || []).map((c: any) => c.name);
    const rows = (pivotObj?.dataSourceSettings.rows || []).map((c: any) => c.name);
    if (columns.includes(fieldName)) {
        pendingActionType = "Member editor open - column";
    } else if (rows.includes(fieldName)) {
        pendingActionType = "Member editor open - row";
    }
}

function enginePopulating(): void {
    const trackableActions = [
        "Member editor open - row",
        "Member editor open - column",
        "Member filtering - row",
        "Member filtering - column",
        "Grouping field",
        "Ungrouping field"
    ];
    if (trackableActions.includes(pendingActionType)) {
        actionStartTime = new Date().getTime();
    }
}

function applyScrollMode(): void {
    const mode = scrollMode;
    pivotObj.enableVirtualization = mode === 'virtual' || mode === 'compression';
    pivotObj.allowDataCompression = mode === 'compression';
    pivotObj.enablePaging = mode === 'paging';
    pivotObj.pageSettings = mode === 'paging' ? pageSettings as any : {};
    pivotObj.pagerSettings = mode === 'paging' ? pagerSettings as any : {};
}

function onModeChange(args: any): void {
    const mode = args.value as string;
    if (mode !== scrollMode) {
        resetMetrics();
        scrollMode = mode;
        applyScrollMode();
        pivotObj.refresh();
    }
}

function onLoad(args: LoadEventArgs): void {
    if (Browser.isDevice) {
        args.dataSourceSettings.rows = [{ name: 'rank_display', caption: 'Rank', expandAll: true, allowDragAndDrop: false }];
    }
}

/* ══════════════ Render sample layout ══════════════ */

function renderLayout(): void {
    const container = document.createElement('div');
    container.className = 'app-body';
    container.innerHTML = `
        <div class="top-toolbar">
            <div class="toolbar-group">
                <div class="toolbar-column">
                    <span class="toolbar-label">Benchmark Mode</span>
                    <input type="text" id="mode-dropdown" />
                </div>
            </div>
            <div class="vertical-separator" aria-hidden="true"></div>
            <div class="toolbar-actions">
                <button id="load-data-btn">Load Data</button>
                <button id="reset-btn" class="reset-button">Reset</button>
            </div>
        </div>
        <div class="outer-content">
            <div class="pivot-performance-container">
                <div id="PivotView"></div>
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
                            <span class="big-value" id="metric-initial-load">—</span>
                            <span class="big-chip">s</span>
                        </div>
                    </div>
                    <div class="section section--primary">
                        <div class="section-label section-label--primary">Sorting</div>
                        <div class="section-row">
                            <div class="mini-card mini-card--primary">
                                <div class="mini-label">Column Sort</div>
                                <div class="mini-values">
                                    <div class="mini-value mini-value--primary" id="metric-column-sort">—</div>
                                    <div class="mini-unit mini-unit--muted">s</div>
                                </div>
                            </div>
                            <div class="mini-card mini-card--primary">
                                <div class="mini-label">Row Sort</div>
                                <div class="mini-values">
                                    <div class="mini-value mini-value--primary" id="metric-row-sort">—</div>
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
                                    <div class="mini-value mini-value--primary" id="metric-column-filter">—</div>
                                    <div class="mini-unit mini-unit--muted">s</div>
                                </div>
                            </div>
                            <div class="mini-card mini-card--primary">
                                <div class="mini-label">Row Filter</div>
                                <div class="mini-values">
                                    <div class="mini-value mini-value--primary" id="metric-row-filter">—</div>
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
                                    <div class="mini-value mini-value--primary" id="metric-column-clear">—</div>
                                    <div class="mini-unit mini-unit--muted">s</div>
                                </div>
                            </div>
                            <div class="mini-card mini-card--primary">
                                <div class="mini-label">Row Clear</div>
                                <div class="mini-values">
                                    <div class="mini-value mini-value--primary" id="metric-row-clear">—</div>
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
                                    <div class="mini-value mini-value--primary" id="metric-group-applied">—</div>
                                    <div class="mini-unit mini-unit--muted">s</div>
                                </div>
                            </div>
                            <div class="mini-card mini-card--primary">
                                <div class="mini-label">Removed Group</div>
                                <div class="mini-values">
                                    <div class="mini-value mini-value--primary" id="metric-group-removed">—</div>
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
                                    <div class="mini-value mini-value--primary" id="metric-drill-down">—</div>
                                    <div class="mini-unit mini-unit--muted">s</div>
                                </div>
                            </div>
                            <div class="mini-card mini-card--primary">
                                <div class="mini-label">Drill Up</div>
                                <div class="mini-values">
                                    <div class="mini-value mini-value--primary" id="metric-drill-up">—</div>
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
                                    <div class="mini-value mini-value--primary" id="metric-rows-in-dom">0</div>
                                    <div class="mini-unit mini-unit--muted">rows</div>
                                </div>
                            </div>
                            <div class="mini-card mini-card--primary">
                                <div class="mini-label">Total Dataset</div>
                                <div class="mini-values">
                                    <div class="mini-value mini-value--primary" id="metric-total-dataset">0</div>
                                    <div class="mini-unit mini-unit--muted">rows</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);
}

renderLayout();

/* ══════════════ Initialize components ══════════════ */

let modeDropDown: DropDownList = new DropDownList({
    dataSource: scrollModeItems,
    fields: { text: 'text', value: 'value' },
    value: 'virtual',
    width: 150,
    change: onModeChange
});
modeDropDown.appendTo('#mode-dropdown');

let loadBtn: Button = new Button({ isPrimary: true }, '#load-data-btn');
loadBtn.element.addEventListener('click', handleLoad);
let resetBtn: Button = new Button({ cssClass: 'reset-button' }, '#reset-btn');
resetBtn.element.addEventListener('click', resetMetrics);

pivotObj = new PivotView({
    id: 'PivotView',
    dataSourceSettings: dataSourceSettings,
    width: '100%',
    height: '100%',
    showFieldList: true,
    exportAllPages: false,
    maxNodeLimitInMemberEditor: 50,
    showGroupingBar: true,
    allowGrouping: true,
    enableVirtualization: true,
    allowDeferLayoutUpdate: true,
    allowDrillThrough: true,
    gridSettings: {
        columnWidth: 120,
        rowHeight: 36
    },
    allowExcelExport: true,
    allowNumberFormatting: true,
    allowConditionalFormatting: true,
    allowPdfExport: true,
    showToolbar: true,
    allowCalculatedField: true,
    displayOption: { view: 'Both' },
    toolbar: ['Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList'],
    chartSettings: { title: 'Top Universities Analysis' },
    enableFieldSearching: true,
    dataBound: onDataBound,
    actionBegin: actionBegin,
    actionComplete: actionComplete,
    memberFiltering: memberFiltering,
    memberEditorOpen: memberEditorOpen,
    enginePopulating: enginePopulating,
    created: () => { initialLoadTime = new Date().getTime(); },
    load: onLoad
});
pivotObj.appendTo('#PivotView');
