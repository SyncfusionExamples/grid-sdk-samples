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

        var record = {
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
        };
        result.push(record);
    }
    return result;
}

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

// University data - with rank_display (normal)
var UniversityData = getPerformanceData(1000000, false);

// University data with data compression format
var UniversityDataCompressed = getPerformanceData(1000000, true);

var metrics = Object.assign({}, EMPTY_METRICS);
var isInit = true;
var loaded = false;
var initialLoadTime = 0;
var pendingActionType = '';
var actionStartTime = 0;
var scrollMode = 'virtual';
var pivotObj;

var scrollModeItems = [
    { text: 'Virtual Scroll', value: 'virtual' },
    { text: 'Data Compression', value: 'compression' },
    { text: 'Paging', value: 'paging' }
];

var pageSettings = {
    rowPageSize: 10,
    columnPageSize: 6,
    currentColumnPage: 1,
    currentRowPage: 1
};

var pagerSettings = {
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

function formatSeconds(milliseconds) {
    return milliseconds > 0 ? (milliseconds / 1000).toFixed(3) : '—';
}

function resetMetricsDisplay() {
    metrics = Object.assign({}, EMPTY_METRICS);
    renderMetrics();
}

function renderMetrics() {
    document.getElementById('metric-initial-load').textContent = formatSeconds(metrics.initialLoadTime);
    document.getElementById('metric-column-sort').textContent = formatSeconds(metrics.columnsSortingTime);
    document.getElementById('metric-row-sort').textContent = formatSeconds(metrics.rowsSortingTime);
    document.getElementById('metric-column-filter').textContent = formatSeconds(metrics.filteringTimeColumn);
    document.getElementById('metric-row-filter').textContent = formatSeconds(metrics.filteringTimeRow);
    document.getElementById('metric-column-clear').textContent = formatSeconds(metrics.clearFilteringTimeColumn);
    document.getElementById('metric-row-clear').textContent = formatSeconds(metrics.clearFilteringTimeRow);
    document.getElementById('metric-group-applied').textContent = formatSeconds(metrics.groupingTime);
    document.getElementById('metric-group-removed').textContent = formatSeconds(metrics.ungroupingTime);
    document.getElementById('metric-drill-down').textContent = formatSeconds(metrics.drillDownTime);
    document.getElementById('metric-drill-up').textContent = formatSeconds(metrics.drillUpTime);
    document.getElementById('metric-rows-in-dom').textContent = String(metrics.rowsInDOM);
    document.getElementById('metric-total-dataset').textContent = metrics.totalDatasetRows.toLocaleString();
}

function setToolbarLoaded(state) {
    var loadBtn = document.getElementById('load-data-btn');
    loadBtn.disabled = state;
    loadBtn.textContent = state ? 'Loaded' : 'Load Data';
}

function updateDOMMetrics() {
    if (!pivotObj || !pivotObj.element) return;
    metrics.rowsInDOM = pivotObj.element.querySelectorAll('tr.e-row').length;
    renderMetrics();
}

function setupContextMenuHandler() {
    var cEle = ej.base.select('ul.e-contextmenu', document);
    if (cEle && cEle['ej2_instances'] && cEle['ej2_instances'][0]) {
        var menu = cEle['ej2_instances'][0];
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

function resetMetrics() {
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
    if (pivotObj) {
        pivotObj.refresh();
    }
    resetMetricsDisplay();
    setToolbarLoaded(false);
    loaded = false;
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
    loaded = true;
    setToolbarLoaded(true);
    // Update total dataset rows on load
    metrics.totalDatasetRows = TOTAL_DATA_ROWS;
    renderMetrics();
}

function onDataBound() {
    if (pivotObj && pivotObj.dataSourceSettings.dataSource && pivotObj.dataSourceSettings.dataSource.length > 0) {
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
    renderMetrics();
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
    var columns = pivotObj ? pivotObj.dataSourceSettings.columns.map(function (c) { return c.name; }) : [];
    var rows = pivotObj ? pivotObj.dataSourceSettings.rows.map(function (c) { return c.name; }) : [];
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

function applyScrollMode() {
    var mode = scrollMode;
    pivotObj.enableVirtualization = mode === 'virtual' || mode === 'compression';
    pivotObj.allowDataCompression = mode === 'compression';
    pivotObj.enablePaging = mode === 'paging';
    pivotObj.pageSettings = mode === 'paging' ? pageSettings : {};
    pivotObj.pagerSettings = mode === 'paging' ? pagerSettings : {};
}

function onModeChange(args) {
    var mode = args.value;
    if (mode !== scrollMode) {
        resetMetrics();
        scrollMode = mode;
        applyScrollMode();
        pivotObj.refresh();
    }
}

function onLoad(args) {
    if (ej.base.Browser.isDevice) {
        args.dataSourceSettings.rows = [{ name: 'rank_display', caption: 'Rank', expandAll: true, allowDragAndDrop: false }];
    }
}

pivotObj = new ej.pivotview.PivotView({
    id: 'PivotView',
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
    },
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
    created: function () { initialLoadTime = new Date().getTime(); },
    load: onLoad
});
pivotObj.appendTo('#PivotView');

var modeDropDown = new ej.dropdowns.DropDownList({
    dataSource: scrollModeItems,
    fields: { text: 'text', value: 'value' },
    value: 'virtual',
    width: 150,
    change: onModeChange
});
modeDropDown.appendTo('#mode-dropdown');

var loadButtonEle = document.getElementById('load-data-btn');
loadButtonEle.addEventListener('click', handleLoad);
document.getElementById('reset-btn').addEventListener('click', resetMetrics);
