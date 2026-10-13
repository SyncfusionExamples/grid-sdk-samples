# Syncfusion Pivot Table Performance Benchmark (Core / Essential JS 2)

## Overview

This standalone Core (Essential JS 2) sample benchmarks the Syncfusion Pivot Table against a generated dataset of one million university records. It helps evaluate how the component performs under different data-handling modes such as virtual scrolling, data compression, and paging.

The sample measures key interactions including initial load time, column and row sorting, filtering, grouping, drill-up and drill-down operations, and DOM rendering impact. You can switch benchmark modes and compare the resulting performance metrics in the panel.

## Key Features

- One million generated records for large-data performance tests
- Benchmark modes for virtual scrolling, data compression, and paging
- Side-by-side performance metrics for sorting, filtering, grouping, and drill operations
- Reset support to clear loaded data and metrics before rerunning a test
- Plain HTML + JavaScript (Essential JS 2 CDN scripts) sample setup using Syncfusion Pivot Table components

## Run the sample

Open `index.html` directly in a modern browser (scripts are loaded from CDN), or serve the folder with any static web server.

Choose a benchmark mode, and click **Load Data**. The sample includes several performance scenarios that render large datasets with different optimization strategies.

Use **Reset** to clear the loaded dataset and metrics before running another benchmark.

## Sample structure

- `index.html` — page shell and CDN script references
- `src/performance.js` — benchmark UI, mode selection, and metrics logic
- `src/datasource.js` — generated test data used for the performance scenarios
- `src/App.css` — layout and styling for the benchmark panel and toolbar

## Related resources

- [Syncfusion Pivot Table documentation](https://ej2.syncfusion.com/documentation/pivotview/getting-started)
- [Syncfusion Essential JS 2 components](https://www.syncfusion.com/products/javascript)
