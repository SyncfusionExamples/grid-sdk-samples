# Large Data Set Grid Sample

A React application built with Syncfusion React Data Grid that demonstrates remote data binding, virtualization, and dynamic data-size selection using a DropDownList.

## Overview

This sample renders employee data from the Syncfusion remote UrlAdaptor service and lets you switch between multiple data ranges using a DropDownList.

When the selected value changes:

- the `dataCount` query parameter is updated
- the grid query is refreshed
- `grid.freezeRefresh()` is called to reload the grid

## Features

- Remote data binding using `DataManager` and `UrlAdaptor`
- Dynamic query parameter update
- DropDownList-driven data range selection
- Virtual scrolling
- DOM virtualization
- Sorting
- Filtering
- Selection support
- Custom column templates for employee avatar and status

## UI Behavior

### DropDownList

The DropDownList allows switching between these data ranges:

- 1,000 rows
- 10,000 rows
- 100,000 rows

### Grid

The grid displays the following columns:

- Employee ID
- Employee Name
- Designation
- Status
- Current Salary
- Location
- Address

The grid uses:

- `enableVirtualization`
- `enableDomVirtualization`
- `Sort`
- `Filter`
- `Selection`
- `VirtualScroll`
- `DomVirtualization`

## Styling

The grid parent container includes left and right spacing, plus top spacing for the dropdown section.

## Technology Stack

- React
- Syncfusion React Grid
- Syncfusion React DropDownList
- Syncfusion DataManager
- Vite

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the application

```bash
npm run dev
```

## Files

- [src/components/Grid.jsx](src/components/Grid.jsx) — main grid and dropdown implementation
- [src/App.jsx](src/App.jsx) — application routing and page mounting

## Data Source

The grid uses this remote endpoint:

- https://services.syncfusion.com/react/production/api/UrlDataSource

The selected row count is passed through the `dataCount` query parameter.
