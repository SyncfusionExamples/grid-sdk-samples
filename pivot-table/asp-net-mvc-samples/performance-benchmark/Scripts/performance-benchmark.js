// Syncfusion Pivot Table performance benchmark sample logic

var TOTAL_DATA_ROWS = 1000000;

var EMPTY_METRICS = {
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

var universities = [
    'MIT', 'Stanford University', 'Harvard University', 'Oxford University',
    'Cambridge University', 'Caltech', 'UCL', 'ETH Zurich', 'Imperial College London'
];
var countries = [
    'United States', 'United Kingdom', 'Germany', 'Canada', 'Australia', 'India'
];
var cities = [
    'New York', 'London', 'Berlin', 'Toronto', 'Sydney', 'Chennai'
];
var regions = [
    'North America', 'Europe', 'Asia', 'Oceania'
];

var types = ['Public', 'Private'];
var research = ['Very High', 'High'];
var sizes = ['S', 'M', 'L', 'XL'];

var ratios = [3, 4, 5, 6, 7, 8, 9, 10];
var students = [1000, 2000, 3000, 5000, 8000, 12000];
var faculty = [500, 1000, 2000, 4000, 7000];

function getPerformanceData(count, isDataCompression) {
    isDataCompression = isDataCompression || false;
    var result = [];
    var index = 1;

    for (var i = 0; i < count; i++) {
        var rankPadded;

        if (isDataCompression) {
            // Data compression format: padded strings cycling 1-1000
            var toString = index.toString();
            if (toString.length === 1) {
                rankPadded = "000" + index;
            } else if (toString.length === 2) {
                rankPadded = "00" + index;
            } else if (toString.length === 3) {
                rankPadded = "0" + index;
            } else {
                rankPadded = toString;
            }
            index = index >= 1000 ? 1 : index + 1;
        } else {
            // Normal format: padded strings with i+1
            var num = i + 1;
            var toString = num.toString();
            if (toString.length === 1) {
                rankPadded = "0000" + num;
            } else if (toString.length === 2) {
                rankPadded = "000" + num;
            } else if (toString.length === 3) {
                rankPadded = "00" + num;
            } else if (toString.length === 4) {
                rankPadded = "0" + num;
            } else {
                rankPadded = toString;
            }
        }

        result.push({
            rank_display: isDataCompression ? rankPadded : i + 1,
            university: universities[Math.floor(Math.random() * universities.length)],
            year: 2017,
            score: Number((100 - Math.random() * 60).toFixed(2)),
            country: countries[Math.floor(Math.random() * countries.length)],
            city: cities[Math.floor(Math.random() * cities.length)],
            region: regions[Math.floor(Math.random() * regions.length)],
            type: types[Math.floor(Math.random() * types.length)],
            research_output: research[Math.floor(Math.random() * research.length)],
            student_faculty_ratio: ratios[Math.floor(Math.random() * ratios.length)],
            international_students: students[Math.floor(Math.random() * students.length)],
            size: sizes[Math.floor(Math.random() * sizes.length)],
            faculty_count: faculty[Math.floor(Math.random() * faculty.length)]
        });
    }
    return result;
}

// University data - with rank_display (normal)
var UniversityData = getPerformanceData(1000000, false);

// University data with data compression format
var UniversityDataCompressed = getPerformanceData(1000000, true);

var pivotObj;
var metrics = Object.assign({}, EMPTY_METRICS);
var isInit = true;
var loaded = false;
var initialLoadTime = 0;
var pendingActionType = '';
var actionStartTime = 0;
var scrollMode = 'virtual';

var scrollModeItems = [
    { text: 'Virtual Scroll', value: 'virtual' },
    { text: 'Data Compression', value: 'compression' },
    { text: 'Paging', value: 'paging' }
];

function formatSeconds(milliseconds) {
    return milliseconds > 0 ? (milliseconds / 1000).toFixed(3) : '\u2014';
}

function updateMetricsDisplay() {
    var el = document.getElementById('metric-initial-load');
    if (el) el.textContent = formatSeconds(metrics.initialLoadTime);
    el = document.getElementById('metric-column-sort');
    if (el) el.textContent = formatSeconds(metrics.columnsSortingTime);
    el = document.getElementById('metric-row-sort');
    if (el) el.textContent = formatSeconds(metrics.rowsSortingTime);
    el = document.getElementById('metric-column-filter');
    if (el) el.textContent = formatSeconds(metrics.filteringTimeColumn);
    el = document.getElementById('metric-row-filter');
    if (el) el.textContent = formatSeconds(metrics.filteringTimeRow);
    el = document.getElementById('metric-column-clear');
    if (el) el.textContent = formatSeconds(metrics.clearFilteringTimeColumn);
    el = document.getElementById('metric-row-clear');
    if (el) el.textContent = formatSeconds(metrics.clearFilteringTimeRow);
    el = document.getElementById('metric-group');
    if (el) el.textContent = formatSeconds(metrics.groupingTime);
    el = document.getElementById('metric-ungroup');
    if (el) el.textContent = formatSeconds(metrics.ungroupingTime);
    el = document.getElementById('metric-drill-down');
    if (el) el.textContent = formatSeconds(metrics.drillDownTime);
    el = document.getElementById('metric-drill-up');
    if (el) el.textContent = formatSeconds(metrics.drillUpTime);
    el = document.getElementById('metric-rows-in-dom');
    if (el) el.textContent = String(metrics.rowsInDOM);
    el = document.getElementById('metric-total-dataset');
    if (el) el.textContent = metrics.totalDatasetRows.toLocaleString();
}

function resetMetricsDisplay() {
    metrics = Object.assign({}, EMPTY_METRICS);
    updateMetricsDisplay();
}

function updateDOMMetrics() {
    if (!pivotObj || !pivotObj.element) return;
    metrics.rowsInDOM = pivotObj.element.querySelectorAll('tr.e-row').length;
    updateMetricsDisplay();
}

function setupContextMenuHandler() {
    var menuEle = document.querySelector('ul.e-contextmenu');
    if (menuEle && menuEle.ej2_instances && menuEle.ej2_instances[0]) {
        var menu = menuEle.ej2_instances[0];
        var originalSelect = menu.select ? menu.select.bind(menu) : null;
        menu.select = function (args) {
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

function onDataBound() {
    if (pivotObj.dataSourceSettings.dataSource && pivotObj.dataSourceSettings.dataSource.length > 0) {
        if (isInit && initialLoadTime) {
            metrics.initialLoadTime = new Date().getTime() - initialLoadTime;
            setupContextMenuHandler();
            isInit = false;
            initialLoadTime = 0;
        }
    }
    // Do not clear pendingActionType / actionStartTime here — actionComplete
    // may run after dataBound for the same user action and needs those values.
    updateDOMMetrics();
}

function actionBegin(args) {
    var trackable = ['Sort field', 'Drill down', 'Drill up'];
    if (trackable.indexOf(args.actionName) !== -1) {
        actionStartTime = new Date().getTime();
        if (args.actionName === 'Sort field') {
            pendingActionType = args.actionName + ' - ' + args.fieldInfo.axis;
        } else {
            pendingActionType = args.actionName;
        }
    }
}

function actionComplete(args) {
    if (!pendingActionType || !actionStartTime) {
        return;
    }
    var time = new Date().getTime() - actionStartTime;
    var type = pendingActionType;
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
    updateMetricsDisplay();
}

function memberFiltering(args) {
    var fieldName = args.filterSettings.name;
    var columns = args.dataSourceSettings.columns.map(function (c) { return c.name; });
    var rows = args.dataSourceSettings.rows.map(function (c) { return c.name; });
    if (columns.indexOf(fieldName) !== -1) {
        pendingActionType = "Member filtering - column";
    } else if (rows.indexOf(fieldName) !== -1) {
        pendingActionType = "Member filtering - row";
    }
}

function memberEditorOpen(args) {
    var fieldName = args.fieldName;
    var columns = pivotObj.dataSourceSettings.columns.map(function (c) { return c.name; });
    var rows = pivotObj.dataSourceSettings.rows.map(function (c) { return c.name; });
    if (columns.indexOf(fieldName) !== -1) {
        pendingActionType = "Member editor open - column";
    } else if (rows.indexOf(fieldName) !== -1) {
        pendingActionType = "Member editor open - row";
    }
}

function enginePopulating() {
    var trackableActions = [
        "Member editor open - row",
        "Member editor open - column",
        "Member filtering - row",
        "Member filtering - column",
        "Grouping field",
        "Ungrouping field"
    ];
    if (trackableActions.indexOf(pendingActionType) !== -1) {
        actionStartTime = new Date().getTime();
    }
}

function onLoad(args) {
    if (ej.base.Browser.isDevice) {
        args.dataSourceSettings.rows = [{ name: 'rank_display', caption: 'Rank', expandAll: true, allowDragAndDrop: false }];
    }
}

function setLoaded(state) {
    loaded = state;
    var loadBtn = document.getElementById('load-btn');
    if (loadBtn) {
        loadBtn.disabled = state;
        loadBtn.textContent = state ? 'Loaded' : 'Load Data';
    }
}

function handleLoad() {
    if (loaded) return;
    var pivotData = scrollMode === 'compression' ? UniversityDataCompressed : UniversityData;

    // start timing BEFORE binding
    isInit = true;
    initialLoadTime = new Date().getTime();

    // bind directly to pivot instance
    if (pivotObj) {
        pivotObj.dataSourceSettings.dataSource = pivotData;
    }
    setLoaded(true);
    // Update total dataset rows on load
    metrics.totalDatasetRows = TOTAL_DATA_ROWS;
    updateMetricsDisplay();
}

function resetMetrics() {
    if (isInit && !loaded) {
        resetMetricsDisplay();
        setLoaded(false);
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
    pivotObj.refresh();
    resetMetricsDisplay();
    setLoaded(false);
}

function applyMode() {
    // reconfigure pivot for the current benchmark mode
    pivotObj.enableVirtualization = scrollMode === 'virtual' || scrollMode === 'compression';
    pivotObj.allowDataCompression = scrollMode === 'compression';
    pivotObj.enablePaging = scrollMode === 'paging';
    if (scrollMode === 'paging') {
        pivotObj.pageSettings = {
            rowPageSize: 10, columnPageSize: 6, currentColumnPage: 1, currentRowPage: 1
        };
        pivotObj.pagerSettings = {
            position: 'Bottom', enableCompactView: false, showColumnPager: true,
            showRowPager: true, columnPageSizes: [3, 6, 9, 12], rowPageSizes: [10, 50, 100, 200],
            isInversed: false, showColumnPageSize: true, showRowPageSize: true
        };
    } else {
        pivotObj.pageSettings = {};
        pivotObj.pagerSettings = {};
    }
}

function onModeChange(e) {
    var mode = e.value;
    if (mode !== scrollMode) {
        scrollMode = mode;
        resetMetrics();
        applyMode();
        pivotObj.refresh();
    }
}

function initPerformanceBenchmark() {
    pivotObj = document.getElementById('PivotView').ej2_instances[0];
    if (!pivotObj) return;

    pivotObj.dataBound = onDataBound;
    pivotObj.actionBegin = actionBegin;
    pivotObj.actionComplete = actionComplete;
    pivotObj.memberFiltering = memberFiltering;
    pivotObj.memberEditorOpen = memberEditorOpen;
    pivotObj.enginePopulating = enginePopulating;
    pivotObj.load = onLoad;
    pivotObj.created = function () { initialLoadTime = new Date().getTime(); };

    // Benchmark mode dropdown
    var modeDropdown = new ej.dropdowns.DropDownList({
        dataSource: scrollModeItems,
        fields: { text: 'text', value: 'value' },
        value: scrollMode,
        width: 150,
        change: onModeChange
    });
    modeDropdown.appendTo('#mode-dropdown');

    // Load / Reset buttons
    var loadBtn = new ej.buttons.Button({ isPrimary: true }, '#load-btn');
    document.getElementById('load-btn').addEventListener('click', handleLoad);
    document.getElementById('reset-btn').addEventListener('click', resetMetrics);

    updateMetricsDisplay();
}

document.addEventListener('DOMContentLoaded', initPerformanceBenchmark);
