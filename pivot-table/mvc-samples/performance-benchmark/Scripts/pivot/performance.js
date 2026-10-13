var ej = ej2_base; // global namespace aliasing done by CDN builds (window.ej2.*)

/**
 * Core (Essential JS 2) performance benchmark sample.
 * Mirrors the React performance-benchmark sample: 1M university records,
 * virtual scroll / data compression / paging modes, and a metrics panel.
 */
(function () {
  var TOTAL_DATA_ROWS = 1000000;

  // University data - with rank_display (normal)
  var UniversityData = window.getPerformanceData(1000000, false);

  // University data with data compression format
  var UniversityDataCompressed = window.getPerformanceData(1000000, true);

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

  function formatSeconds(milliseconds) {
    return milliseconds > 0 ? (milliseconds / 1000).toFixed(3) : '—';
  }

  var ej = window.ej2 || {};
  var pivotNS = window.ej2 && window.ej2.pivotview ? window.ej2.pivotview : window.ej2_pivotview;
  var baseNS = window.ej2 && window.ej2.base ? window.ej2.base : window.ej2_base;
  var dataNS = window.ej2 && window.ej2.data ? window.ej2.data : window.ej2_data;
  var buttonsNS = window.ej2 && window.ej2.buttons ? window.ej2.buttons : window.ej2_buttons;
  var dropdownsNS = window.ej2 && window.ej2.dropdowns ? window.ej2.dropdowns : window.ej2_dropdowns;

  var PivotView = pivotNS.PivotView;
  PivotView.Inject(
    pivotNS.FieldList, pivotNS.CalculatedField, pivotNS.Toolbar, pivotNS.PDFExport, pivotNS.ExcelExport,
    pivotNS.ConditionalFormatting, pivotNS.NumberFormatting, pivotNS.GroupingBar, pivotNS.Grouping,
    pivotNS.VirtualScroll, pivotNS.DrillThrough, pivotNS.Pager
  );

  function Section(label) {
    var section = document.createElement('div');
    section.className = 'section section--primary';
    section.innerHTML = '<div class="section-label section-label--primary">' + label + '</div>' +
      '<div class="section-row"></div>';
    return section;
  }

  function MiniCard(label, unit) {
    var card = document.createElement('div');
    card.className = 'mini-card mini-card--primary';
    card.innerHTML = '<div class="mini-label">' + label + '</div>' +
      '<div class="mini-values">' +
      '<div class="mini-value mini-value--primary"></div>' +
      '<div class="mini-unit mini-unit--muted">' + unit + '</div>' +
      '</div>';
    card.setValue = function (value) {
      card.querySelector('.mini-value').textContent = value;
    };
    return card;
  }

  function BigCard(label, unit) {
    var card = document.createElement('div');
    card.className = 'big-card';
    card.innerHTML = '<div class="big-left"><span class="big-label">' + label + '</span></div>' +
      '<div class="big-right"><span class="big-value"></span><span class="big-chip">' + unit + '</span></div>';
    card.setValue = function (value) {
      card.querySelector('.big-value').textContent = value;
    };
    return card;
  }

  var metricsCards = {};

  function updateMetrics(partial) {
    Object.keys(partial).forEach(function (key) {
      var card = metricsCards[key];
      if (!card) return;
      var value = partial[key];
      if (key === 'rowsInDOM') {
        card.setValue(String(value));
      } else if (key === 'totalDatasetRows') {
        card.setValue(value.toLocaleString());
      } else {
        card.setValue(formatSeconds(value));
      }
    });
  }

  function resetMetricsPanel() {
    Object.keys(EMPTY_METRICS).forEach(function (key) {
      var card = metricsCards[key];
      if (key === 'rowsInDOM' || key === 'totalDatasetRows') {
        card.setValue('0');
      } else {
        card.setValue('—');
      }
    });
  }

  var isInit = true;
  var initialLoadTime = 0;
  var loaded = false;
  var pendingActionType = '';
  var actionStartTime = 0;
  var scrollMode = 'virtual';

  document.addEventListener('DOMContentLoaded', function () {
    var appBody = document.createElement('div');
    appBody.className = 'app-body';
    document.getElementById('root').appendChild(appBody);

    // ── Toolbar ──
    var topToolbar = document.createElement('div');
    topToolbar.className = 'top-toolbar';

    var toolbarGroup = document.createElement('div');
    toolbarGroup.className = 'toolbar-group';
    var toolbarColumn = document.createElement('div');
    toolbarColumn.className = 'toolbar-column';
    toolbarColumn.innerHTML = '<span class="toolbar-label">Benchmark Mode</span>';
    var modeWrapper = document.createElement('input');
    toolbarColumn.appendChild(modeWrapper);
    toolbarGroup.appendChild(toolbarColumn);

    var separator = document.createElement('div');
    separator.className = 'vertical-separator';
    separator.setAttribute('aria-hidden', 'true');

    var toolbarActions = document.createElement('div');
    toolbarActions.className = 'toolbar-actions';
    var loadWrapper = document.createElement('button');
    var resetWrapper = document.createElement('button');
    toolbarActions.appendChild(loadWrapper);
    toolbarActions.appendChild(resetWrapper);

    topToolbar.appendChild(toolbarGroup);
    topToolbar.appendChild(separator);
    topToolbar.appendChild(toolbarActions);
    appBody.appendChild(topToolbar);

    // ── Content: pivot + metrics panel ──
    var outerContent = document.createElement('div');
    outerContent.className = 'outer-content';
    var pivotContainer = document.createElement('div');
    pivotContainer.className = 'pivot-performance-container';
    var pivotHost = document.createElement('div');
    pivotHost.id = 'PivotView';
    pivotContainer.appendChild(pivotHost);
    outerContent.appendChild(pivotContainer);

    var panel = document.createElement('div');
    panel.className = 'panel';
    var head = document.createElement('div');
    head.className = 'panel-head';
    head.innerHTML = '<span class="panel-head-text">Performance Metrics</span>';
    panel.appendChild(head);

    var body = document.createElement('div');
    body.className = 'metrics-body metrics-body--full';

    var initialLoad = BigCard('Initial Load Time', 's');
    metricsCards.initialLoadTime = initialLoad;
    body.appendChild(initialLoad);

    var addSection = function (label, entries) {
      var section = Section(label);
      var row = section.querySelector('.section-row');
      entries.forEach(function (entry) {
        var card = MiniCard(entry[1], entry[2]);
        metricsCards[entry[0]] = card;
        row.appendChild(card);
      });
      body.appendChild(section);
    };

    addSection('Sorting', [
      ['columnsSortingTime', 'Column Sort', 's'],
      ['rowsSortingTime', 'Row Sort', 's']
    ]);
    addSection('Filtering', [
      ['filteringTimeColumn', 'Column Filter', 's'],
      ['filteringTimeRow', 'Row Filter', 's']
    ]);
    addSection('Clear Filtering', [
      ['clearFilteringTimeColumn', 'Column Clear', 's'],
      ['clearFilteringTimeRow', 'Row Clear', 's']
    ]);
    addSection('Grouping', [
      ['groupingTime', 'Applied Group', 's'],
      ['ungroupingTime', 'Removed Group', 's']
    ]);
    addSection('Drill', [
      ['drillDownTime', 'Drill Down', 's'],
      ['drillUpTime', 'Drill Up', 's']
    ]);
    addSection('DOM Insights', [
      ['rowsInDOM', 'Rows in DOM', 'rows'],
      ['totalDatasetRows', 'Total Dataset', 'rows']
    ]);

    panel.appendChild(body);
    outerContent.appendChild(panel);
    appBody.appendChild(outerContent);

    // ── Controls ──
    var scrollModeItems = [
      { text: 'Virtual Scroll', value: 'virtual' },
      { text: 'Data Compression', value: 'compression' },
      { text: 'Paging', value: 'paging' }
    ];

    var modeDropdown = new dropdownsNS.DropDownList({
      dataSource: scrollModeItems,
      fields: { text: 'text', value: 'value' },
      value: 'virtual',
      width: 150,
      change: function (e) {
        var mode = e.value;
        if (mode !== scrollMode) {
          handleModeChange(mode);
        }
      }
    });
    modeDropdown.appendTo(modeWrapper);

    var loadButton = new buttonsNS.Button({ cssClass: 'e-primary', isPrimary: true, disabled: false });
    loadButton.appendTo(loadWrapper);
    loadWrapper.querySelector('.e-btn-content').textContent = 'Load Data';

    var resetButton = new buttonsNS.Button({ cssClass: 'reset-button' });
    resetButton.appendTo(resetWrapper);
    resetWrapper.querySelector('.e-btn-content').textContent = 'Reset';

    function setLoaded(value) {
      loaded = value;
      loadButton.disabled = value;
      loadWrapper.disabled = value;
      loadWrapper.querySelector('.e-btn-content').textContent = value ? 'Loaded' : 'Load Data';
    }

    var toolbarOptions = ['Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList'];

    var dataSourceSettings = {
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

    var pivot = new PivotView({
      width: '100%',
      height: '100%',
      showFieldList: true,
      exportAllPages: false,
      maxNodeLimitInMemberEditor: 50,
      showGroupingBar: true,
      allowGrouping: true,
      enableVirtualization: true,
      allowDataCompression: false,
      allowDeferLayoutUpdate: true,
      allowDrillThrough: true,
      enablePaging: false,
      pageSettings: {},
      pagerSettings: {},
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
      toolbar: toolbarOptions,
      chartSettings: { title: 'Top Universities Analysis' },
      enableFieldSearching: true,
      dataSourceSettings: dataSourceSettings
    });

    function updateDOMMetrics() {
      if (!pivot.element) return;
      var rowsInDOM = pivot.element.querySelectorAll('tr.e-row').length;
      updateMetrics({ rowsInDOM: rowsInDOM });
    }

    function setupContextMenuHandler() {
      var cEle = baseNS.select('ul.e-contextmenu', document);
      if (cEle && cEle['ej2_instances'] && cEle['ej2_instances'][0]) {
        var menu = cEle['ej2_instances'][0];
        var originalSelect = menu.select && menu.select.bind(menu);
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

    pivot.created = function () {
      initialLoadTime = new Date().getTime();
    };

    pivot.actionBegin = function (args) {
      var trackable = ['Sort field', 'Drill down', 'Drill up'];
      if (trackable.indexOf(args.actionName) !== -1) {
        actionStartTime = new Date().getTime();
        if (args.actionName === 'Sort field') {
          pendingActionType = args.actionName + ' - ' + args.fieldInfo.axis;
        } else {
          pendingActionType = args.actionName;
        }
      }
    };

    pivot.memberFiltering = function (args) {
      var fieldName = args.filterSettings.name;
      var columns = args.dataSourceSettings.columns.map(function (c) { return c.name; });
      var rows = args.dataSourceSettings.rows.map(function (c) { return c.name; });
      if (columns.indexOf(fieldName) !== -1) {
        pendingActionType = 'Member filtering - column';
      } else if (rows.indexOf(fieldName) !== -1) {
        pendingActionType = 'Member filtering - row';
      }
    };

    pivot.memberEditorOpen = function (args) {
      var fieldName = args.fieldName;
      var columns = pivot.dataSourceSettings.columns.map(function (c) { return c.name; });
      var rows = pivot.dataSourceSettings.rows.map(function (c) { return c.name; });
      if (columns.indexOf(fieldName) !== -1) {
        pendingActionType = 'Member editor open - column';
      } else if (rows.indexOf(fieldName) !== -1) {
        pendingActionType = 'Member editor open - row';
      }
    };

    pivot.enginePopulating = function () {
      var trackableActions = [
        'Member editor open - row',
        'Member editor open - column',
        'Member filtering - row',
        'Member filtering - column',
        'Grouping field',
        'Ungrouping field'
      ];
      if (trackableActions.indexOf(pendingActionType) !== -1) {
        actionStartTime = new Date().getTime();
      }
    };

    function handleModeChange(mode) {
      resetMetrics();
      scrollMode = mode;
      pivot.setProperties({
        enableVirtualization: mode === 'virtual' || mode === 'compression' || false,
        allowDataCompression: mode === 'compression',
        enablePaging: mode === 'paging',
        pageSettings: mode === 'paging' ? {
          rowPageSize: 10,
          columnPageSize: 6,
          currentColumnPage: 1,
          currentRowPage: 1
        } : {},
        pagerSettings: mode === 'paging' ? {
          position: 'Bottom',
          enableCompactView: false,
          showColumnPager: true,
          showRowPager: true,
          columnPageSizes: [3, 6, 9, 12],
          rowPageSizes: [10, 50, 100, 200],
          isInversed: false,
          showColumnPageSize: true,
          showRowPageSize: true
        } : {}
      });
      pivot.refresh();
    }

    function resetMetrics() {
      if (isInit && !loaded) {
        resetMetricsPanel();
        setLoaded(false);
        return;
      }
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
      isInit = true;
      initialLoadTime = 0;
      pendingActionType = '';
      actionStartTime = 0;
      pivot.refresh();
      resetMetricsPanel();
      setLoaded(false);
    }

    function handleLoad() {
      if (loaded) return;
      var pivotData = scrollMode === 'compression' ? UniversityDataCompressed : UniversityData;

      // start timing BEFORE binding
      isInit = true;
      initialLoadTime = new Date().getTime();

      // bind directly to pivot instance
      pivot.dataSourceSettings.dataSource = pivotData;
      setLoaded(true);
      // Update total dataset rows on load
      updateMetrics({ totalDatasetRows: TOTAL_DATA_ROWS });
    }

    pivot.dataBound = function () {
      if ((pivot.dataSourceSettings.dataSource || []).length > 0) {
        if (isInit && initialLoadTime) {
          var loadTime = new Date().getTime() - initialLoadTime;
          updateMetrics({ initialLoadTime: loadTime });
          setupContextMenuHandler();
          isInit = false;
          initialLoadTime = 0;
        }
      }
      // Do not clear pendingActionType / actionStartTime here — actionComplete
      // may run after dataBound for the same user action and needs those values.
      updateDOMMetrics();
    };

    pivot.actionComplete = function () {
      if (!pendingActionType || !actionStartTime) {
        return;
      }
      var time = new Date().getTime() - actionStartTime;
      var type = pendingActionType;
      pendingActionType = '';
      actionStartTime = 0;

      if (type === 'Sort field - columns') {
        updateMetrics({ columnsSortingTime: time });
      } else if (type === 'Sort field - rows') {
        updateMetrics({ rowsSortingTime: time });
      } else if (type === 'Member filtering - column') {
        updateMetrics({ filteringTimeColumn: time });
      } else if (type === 'Member filtering - row') {
        updateMetrics({ filteringTimeRow: time });
      } else if (type === 'Member editor open - column') {
        updateMetrics({ clearFilteringTimeColumn: time });
      } else if (type === 'Member editor open - row') {
        updateMetrics({ clearFilteringTimeRow: time });
      } else if (type === 'Grouping field') {
        updateMetrics({ groupingTime: time });
      } else if (type === 'Ungrouping field') {
        updateMetrics({ ungroupingTime: time });
      } else if (type === 'Drill down') {
        updateMetrics({ drillDownTime: time });
      } else if (type === 'Drill up') {
        updateMetrics({ drillUpTime: time });
      }
    };

    pivot.load = function (args) {
      if (baseNS.Browser.isDevice) {
        args.dataSourceSettings.rows = [{ name: 'rank_display', caption: 'Rank', expandAll: true, allowDragAndDrop: false }];
      }
    };

    loadWrapper.addEventListener('click', handleLoad);
    resetWrapper.addEventListener('click', resetMetrics);

    pivot.appendTo(pivotHost);
  });
})();
