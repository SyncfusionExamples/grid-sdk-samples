import '@syncfusion/ej2-base/styles/material.css'
import '@syncfusion/ej2-pivotview/styles/material.css'
import '@syncfusion/ej2-buttons/styles/material.css'
import '@syncfusion/ej2-calendars/styles/material.css'
import '@syncfusion/ej2-dropdowns/styles/material.css'
import '@syncfusion/ej2-grids/styles/material.css'
import '@syncfusion/ej2-inputs/styles/material.css'
import '@syncfusion/ej2-lists/styles/material.css'
import '@syncfusion/ej2-navigations/styles/material.css'
import '@syncfusion/ej2-popups/styles/material.css'
import '@syncfusion/ej2-splitbuttons/styles/material.css'
import { PivotView, VirtualScroll, FieldList, GroupingBar } from '@syncfusion/ej2-pivotview'
import { generateSalesData } from './data.js'
import './styles.css'

PivotView.Inject(VirtualScroll, FieldList, GroupingBar)

let pivotInstance = null

const elements = {
  recordCount: document.getElementById('record-count'),
  runBenchmark: document.getElementById('run-benchmark'),
  status: document.getElementById('status'),
  metricGeneration: document.getElementById('metric-generation'),
  metricPopulation: document.getElementById('metric-population'),
  metricRender: document.getElementById('metric-render'),
  metricCells: document.getElementById('metric-cells'),
}

const formatTime = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(1)} ms`)

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value)

async function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

function createPivot(data) {
  if (pivotInstance) {
    pivotInstance.destroy()
    pivotInstance = null
    document.getElementById('PivotView').innerHTML = ''
  }

  pivotInstance = new PivotView({
    dataSource: {
      data,
      expandAll: false,
      enableSorting: true,
      formatSettings: [{ name: 'Amount', format: 'C0' }],
      rows: [{ name: 'Region' }, { name: 'Country' }],
      columns: [{ name: 'Product Category' }, { name: 'Product Model' }],
      values: [
        { name: 'Sold Count', type: 'Sum' },
        { name: 'Amount', type: 'Sum' },
      ],
      filters: [{ name: 'Year' }],
    },
    height: 520,
    width: '100%',
    enableVirtualization: true,
    showGroupingBar: true,
    showFieldList: true,
    allowResize: true,
    gridSettings: { columnWidth: 140 },
  })

  pivotInstance.appendTo('#PivotView')
}

function teardown() {
  if (pivotInstance) {
    pivotInstance.destroy()
    pivotInstance = null
    document.getElementById('PivotView').innerHTML = ''
  }
}

async function runBenchmark() {
  const recordCount = parseInt(elements.recordCount.value, 10)

  elements.runBenchmark.disabled = true
  elements.status.textContent = `Generating ${formatNumber(recordCount)} records...`
  elements.metricCells.textContent = '—'

  // Yield a frame so the status update paints before the main-thread work starts.
  await nextFrame()

  // Stage 1: data generation.
  const generationStart = performance.now()
  const data = generateSalesData(recordCount)
  const generationTime = performance.now() - generationStart

  elements.metricGeneration.textContent = formatTime(generationTime)
  elements.status.textContent = 'Populating pivot engine...'

  // Stage 2: engine population (link new data into the pivot engine).
  const populationStart = performance.now()
  await createPivot(data)
  const populationTime = performance.now() - populationStart

  elements.metricPopulation.textContent = formatTime(populationTime)
  elements.status.textContent = 'Rendering...'

  // Stage 3: first paint of the pivot view.
  const renderStart = performance.now()
  if (pivotInstance && pivotInstance.dataSource) {
    await pivotInstance.refreshData()
  }
  const renderTime = performance.now() - renderStart

  elements.metricRender.textContent = formatTime(renderTime)

  const totalRows = pivotInstance
    ? pivotInstance.pivotValues.filter((row) => Array.isArray(row)).length
    : 0
  elements.metricCells.textContent = formatNumber(totalRows)

  elements.status.textContent =
    `Completed for ${formatNumber(recordCount)} records — ` +
    `${formatTime(generationTime + populationTime + renderTime)} total.`
  elements.runBenchmark.disabled = false
}

elements.runBenchmark.addEventListener('click', () => {
  runBenchmark().catch((error) => {
    elements.status.textContent = `Benchmark failed: ${error.message}`
    elements.runBenchmark.disabled = false
  })
})

window.addEventListener('beforeunload', teardown)
