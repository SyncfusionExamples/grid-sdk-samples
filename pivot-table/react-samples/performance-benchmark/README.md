# Syncfusion Pivot Table Performance Benchmark

## Overview

This standalone React sample benchmarks the Syncfusion Pivot Table against a generated dataset of one million university records. It helps evaluate how the component performs under different data-handling modes such as virtual scrolling, data compression, and paging.

The sample measures key interactions including initial load time, column and row sorting, filtering, grouping, drill-up and drill-down operations, and DOM rendering impact. You can switch benchmark modes and compare the resulting performance metrics in the panel.

## Key Features

- One million generated records for large-data performance tests
- Benchmark modes for virtual scrolling, data compression, and paging
- Side-by-side performance metrics for sorting, filtering, grouping, and drill operations
- Reset support to clear loaded data and metrics before rerunning a test
- React + TypeScript + Vite sample setup using Syncfusion Pivot Table components

## Run the sample

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, choose a benchmark mode, and click **Load Data**. The sample includes several performance scenarios that render large datasets with different optimization strategies.

Use **Reset** to clear the loaded dataset and metrics before running another benchmark.

To create a production build, run:

```bash
npm run build
```

## Sample structure

- `src/App.tsx` — benchmark UI, mode selection, and metrics logic
- `src/datasource.ts` — generated test data used for the performance scenarios
- `src/App.css` — layout and styling for the benchmark panel and toolbar

## Related resources

- [Syncfusion Pivot Table documentation](https://ej2.syncfusion.com/react/documentation/pivotview/getting-started)
- [Syncfusion React UI components](https://www.syncfusion.com/react-ui-components)
