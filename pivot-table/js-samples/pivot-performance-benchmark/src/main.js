import { PivotView, FieldList, VirtualScroll, GroupingBar } from '@syncfusion/ej2-pivotview';
import '@syncfusion/ej2-tailwind3-theme/styles/tailwind3.css';
import { enableRipple } from '@syncfusion/ej2-base';
import { generateSalesData } from './dataGenerator.js';
import './styles.css';

enableRipple(true);

/** Whether a benchmark is currently running. */
let benchmarkRunning = false;

const statusEl = document.getElementById('status');
const metrics = {
  generation: document.getElementById('metric-generation'),
  population: document.getElementById('metric-population'),
  render: document.getElementById('metric-render'),
  cells: document.getElementById('metric-cells'),
};

/**
 * Updates the benchmark status message.
 *
 * @param {string} message - Message to display.
 */
function setStatus(message) {
  statusEl.textContent = message;
}

/**
 * Formats a duration in milliseconds for the results panel.
 *
 * @param {number} ms - Duration in milliseconds.
 * @returns {string} Formatted duration.
 */
function formatDuration(ms) {
  return `${ms.toLocaleString(undefined, { maximumFractionDigits: 0 })} ms`;
}

/**
 * Resets every metric back to the empty placeholder.
 */
function resetMetrics() {
  Object.values(metrics).forEach((el) => {
    el.textContent = '—';
  });
}

const pivot = new PivotView({
  id: 'PivotView',
  dataSourceSettings: {
    enableSorting: true,
    rows: [{ name: 'country' }, { name: 'product' }],
    columns: [{ name: 'year' }, { name: 'quarter' }],
    values: [
      { name: 'sold', caption: 'Units Sold', type: 'Sum' },
      { name: 'amount', caption: 'Sold Amount', type: 'Sum' },
    ],
    filters: [{ name: 'seller' }],
    formatSettings: [{ name: 'amount', format: 'C' }],
    filteredRecords: [],
  },
  width: '100%',
  height: '520',
  showGroupingBar: true,
  showFieldList: true,
  enableVirtualization: true,
  gridSettings: { columnWidth: 120 },
  dataBound: () => {
    if (!benchmarkRunning) {
      return;
    }
    benchmarkRunning = false;
    metrics.render.textContent = formatDuration(performance.now() - renderStart);
    const rowElements = pivot.element.querySelectorAll('.e-pivot-table .e-contenttr');
    metrics.cells.textContent = `${rowElements.length.toLocaleString()} visible rows`;
    setStatus('Benchmark complete.');
  },
});

/**
 * Timestamp captured immediately before the pivot table is refreshed for the
 * render measurement.
 */
let renderStart = 0;

pivot.appendTo('#PivotView');

document.getElementById('run-benchmark').addEventListener('click', () => {
  if (benchmarkRunning) {
    return;
  }
  benchmarkRunning = true;
  resetMetrics();
  setStatus('Generating data…');

  // Defer to the next frame so the status paints before heavy work starts.
  requestAnimationFrame(() => {
    setTimeout(() => {
      const generationStart = performance.now();
      const recordCount = Number(document.getElementById('record-count').value);
      const data = generateSalesData(recordCount);
      metrics.generation.textContent = formatDuration(performance.now() - generationStart);

      setStatus('Populating pivot engine…');
      const populationStart = performance.now();

      // Hand the fresh dataset to the pivot engine and trigger engine refresh.
      pivot.dataSourceSettings.dataSource = data;
      pivot.dataSourceSettings.filteredRecords = [];
      pivot.refresh(true);

      // Population covers the engine aggregation phase.
      metrics.population.textContent = formatDuration(performance.now() - populationStart);

      setStatus('Rendering pivot table…');
      renderStart = performance.now();
    }, 0);
  });
});
