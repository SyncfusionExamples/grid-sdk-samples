# Pivot Table Performance Benchmark (JavaScript)

A vanilla JavaScript sample that measures how the [Syncfusion Pivot Table](https://www.syncfusion.com/javascript-components/pivot-table)
performs with large datasets. It generates synthetic sales data, populates the pivot engine,
and reports how long each stage takes, from 1,000 up to 250,000 records.

## Measured stages

| Stage | What it measures |
| ------------------- | ------------------------------------------------------------ |
| Data generation | Time to build the synthetic JSON dataset in the browser |
| Pivot population | Time to initialize the PivotView and link the dataset |
| Render (first paint) | Time until the pivot grid is rendered on screen |
| Records in view | Number of rows present in the pivot output |

Virtualization is enabled, so only the visible rows are rendered regardless of
how many records are processed.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (typically http://localhost:5173).

## Build

```bash
npm run build
```

The production bundle is emitted to `dist/` and served under the
`/pivot-performance-benchmark/` base path.

## Tech stack

- [Vite](https://vite.dev/) as the build tool
- `@syncfusion/ej2-pivotview` (PivotView, VirtualScroll, FieldList, GroupingBar)
