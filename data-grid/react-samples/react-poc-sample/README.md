# Order Tracking Status Grid

A React application built with **Syncfusion React Data Grid** that demonstrates order tracking and status management using multiple synchronized grids. The application showcases advanced grid capabilities including sorting, filtering, grouping, drag-and-drop, row reordering, exporting, adaptive layouts, and dynamic row height customization.

## Overview

The **Order Tracking Status Grid** provides an interactive interface for managing and tracking customer orders across different stages of fulfillment.

The application consists of:

- **Orders Grid** - Displays all orders and their complete status.
- **Order Pending Grid** - Displays pending orders with virtual scrolling.
- **Order Delivered Grid** - Displays delivered orders with paging and row reordering.
- **Adaptive Grid View** - Mobile-friendly grid layout optimized for smaller screens.

All grids remain synchronized, ensuring status updates are reflected consistently throughout the application.

---

## Features

### Orders Grid

The Orders Grid displays all available orders and their current status.

#### Enabled Features

- Sorting
- Multi-column Sorting
- Filtering
- Grouping
- Infinite Scrolling
- Inline Editing
- Excel Export
- PDF Export
- Compact Grid Layout
- Column Menu Support

#### Sorting

The **Name** column is sorted in ascending order by default.

For multi-column sorting:

1. Hold the **Ctrl** key.
2. Click the **Order ID** column header.
3. Multiple columns will be sorted simultaneously.

#### Column Menu

Each column includes a menu with options such as:

- Sort Ascending
- Sort Descending
- Filter
- AutoFit
- AutoFit All Columns

Examples:

- Selecting **AutoFit** on the **Status** column resizes the column according to its content width.
- Selecting **AutoFit All Columns** automatically adjusts all columns for optimal visibility.

---

### Dynamic Row Height

The application supports dynamic row height customization to improve readability and user experience.

#### Toolbar Options

- Small
- Normal
- Large

When a user selects a mode, the row height updates instantly across the grid without requiring a page refresh.

---

### Order Pending Grid

#### Features

- Virtual Scrolling
- Drag and Drop Integration
- Export Support
- Real-time Synchronization

---

### Order Delivered Grid

#### Features

- Paging
- Row Reordering
- Export Support
- Drag and Drop Integration
- Real-time Synchronization

---

### Drag and Drop Order Management

1. Select an order from the **Order Pending Grid**.
2. Drag the order into the **Order Delivered Grid**.
3. The order status automatically changes:

```text
Pending → Delivered
```

4. All grids are refreshed and synchronized automatically.

---

### Adaptive Grid

The Adaptive Grid provides an optimized mobile experience.

#### Features

- Responsive Design
- Compact Layout
- Mobile-Friendly User Interface
- Status Editing Support

---

## Technology Stack

- React
- Syncfusion React Data Grid (EJ2)
- Tailwind Theme Support

---

## Getting Started

### Installation

```bash
npm install
```

### Run the Application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Demo Reference

https://ej2.syncfusion.com/react/demos/#/tailwind3/grid/overview

## Documentation

- https://help.syncfusion.com/grid-sdk/react/data-grid/filtering/filtering
- https://help.syncfusion.com/grid-sdk/react/data-grid/sorting
- https://help.syncfusion.com/grid-sdk/react/data-grid/columns/column-menu
- https://help.syncfusion.com/grid-sdk/react/data-grid/row/row-drag-and-drop
