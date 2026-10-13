# Syncfusion Pivot Table Performance Benchmark (ASP.NET MVC)

## Overview

This ASP.NET MVC sample benchmarks the Syncfusion Pivot Table against a generated dataset of one million university records. It helps evaluate how the component performs under different data-handling modes such as virtual scrolling, data compression, and paging.

The sample measures key interactions including initial load time, column and row sorting, filtering, grouping, drill-up and drill-down operations, and DOM rendering impact. You can switch benchmark modes and compare the resulting performance metrics in the panel.

## Key Features

- One million generated records for large-data performance tests
- Benchmark modes for virtual scrolling, data compression, and paging
- Side-by-side performance metrics for sorting, filtering, grouping, and drill operations
- Reset support to clear loaded data and metrics before rerunning a test
- ASP.NET MVC controller + Razor view sample using Syncfusion Pivot Table (Essential JS 2) components

## Run the sample

1. Copy the `Controllers`, `Views`, `Scripts/pivot`, and `Content` folders into an existing ASP.NET MVC 4+ project (or use this folder structure as-is in a new MVC project).
2. Build and run the project, then navigate to `/PerformanceBenchmark`.

Choose a benchmark mode, and click **Load Data**. The sample includes several performance scenarios that render large datasets with different optimization strategies.

Use **Reset** to clear the loaded dataset and metrics before running another benchmark.

## Sample structure

- `Controllers/PerformanceBenchmarkController.cs` — MVC controller serving the benchmark view
- `Views/PerformanceBenchmark/Index.cshtml` — page shell and CDN script references
- `Scripts/pivot/performance.js` — benchmark UI, mode selection, and metrics logic
- `Scripts/pivot/datasource.js` — generated test data used for the performance scenarios
- `Content/App.css` — layout and styling for the benchmark panel and toolbar

## Related resources

- [Syncfusion Pivot Table documentation](https://ej2.syncfusion.com/aspnetmvc/documentation/pivotview/getting-started)
- [Syncfusion ASP.NET MVC UI components](https://www.syncfusion.com/aspnet-mvc-ui-controls)
