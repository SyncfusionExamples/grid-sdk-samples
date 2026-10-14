# Syncfusion Pivot Table Performance Benchmark (ASP.NET MVC)

## Overview

This ASP.NET MVC 5 sample benchmarks the Syncfusion Pivot Table against a generated dataset of one million university records. It helps evaluate how the component performs under different data-handling modes such as virtual scrolling, data compression, and paging.

The sample measures key interactions including initial load time, column and row sorting, filtering, grouping, drill-up and drill-down operations, and DOM rendering impact. You can switch benchmark modes and compare the resulting performance metrics in the panel.

## Key Features

- One million generated records for large-data performance tests
- Benchmark modes for virtual scrolling, data compression, and paging
- Side-by-side performance metrics for sorting, filtering, grouping, and drill operations
- Reset support to clear loaded data and metrics before rerunning a test
- ASP.NET MVC 5 setup using the Syncfusion `Html.EJS()` helper

## Run the sample

Open the solution in Visual Studio and run it (F5), or serve the site with IIS Express.

Open the local URL, choose a benchmark mode, and click **Load Data**. The sample includes several performance scenarios that render large datasets with different optimization strategies.

Use **Reset** to clear the loaded dataset and metrics before running another benchmark.

## Sample structure

- `Views/Home/Index.cshtml` — benchmark page with the `Html.EJS().PivotView()` helper, toolbar, and metrics panel
- `Scripts/performance-benchmark.js` — data generator, mode switching, Load/Reset, and timing logic
- `Content/performance-benchmark.css` — layout and styling for the benchmark panel and toolbar

## Related resources

- [Syncfusion Pivot Table documentation](https://help.syncfusion.com/aspnetmvc/pivot-table/overview)
- [Syncfusion ASP.NET MVC UI components](https://www.syncfusion.com/aspnet-mvc-ui-components)