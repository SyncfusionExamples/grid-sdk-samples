# Large Data Set Grid Sample

A React application built with Syncfusion React Data Grid that demonstrates task data display, paging, column reordering, column freezing, and row pinning.

## Overview

This sample renders task data from the local `taskData` collection in `src/components/data.js`.

## Features

- Local data binding using the task data collection
- Paging
- Column reordering by drag and drop
- Context-menu column freezing on the left or right
- Context-menu support for unfreezing columns
- Row pinning for open, critical tasks

## UI Behavior

### Grid

The grid displays these columns in order:

- Task ID
- Title
- Project
- Assignee
- Priority
- Status
- Created Date
- Due Date
- Progress

The `Tags` field is intentionally excluded from the grid columns.

The grid uses:

- `allowPaging`
- `allowReordering`
- `ContextMenu`
- `Freeze`
- `Reorder`
- `Page`

### Context Menu

The grid customizes the context menu with:

- `Freeze Left` with the `e-chevron-left-double` icon
- `Freeze Right` with the `e-chevron-right-double` icon
- `UnFreeze` with the `e-undo` icon
- Syncfusion `PinRow` and `UnpinRow` actions

The custom freeze actions target column headers only. When opened elsewhere, they are hidden. For an unfrozen column, `Freeze Left` and `Freeze Right` are shown; for a frozen column, those actions are replaced with `UnFreeze`. Selecting a freeze action updates the column's `freeze` setting and refreshes the grid columns.

Rows with `Status: "Open"` and `Priority: "Critical"` are pinned automatically.

## Styling

The grid parent container includes left and right spacing and top spacing. The grid height is set to `350px`.

## Technology Stack

- React
- Syncfusion React Grid
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

- [src/components/Grid.jsx](src/components/Grid.jsx) — main grid implementation
- [src/components/data.js](src/components/data.js) — local task data
- [src/App.jsx](src/App.jsx) — application routing and page mounting
