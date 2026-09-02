# React Syncfusion Data Grid Sample

A comprehensive React application built with **Syncfusion React Data Grid** and **React Router** that demonstrates advanced grid capabilities, Excel import, selected-records views, and responsive layouts.

## Overview

The **Order Tracking Status Grid** provides an interactive interface for managing and tracking customer orders across different stages of fulfillment.

The application consists of:

- **Orders Grid** - Displays all orders and their complete status.
- **Order Pending Grid** - Displays pending orders with virtual scrolling.
- **Order Delivered Grid** - Displays delivered orders with paging and row reordering.
- **Adaptive Grid View** - Mobile-friendly grid layout optimized for smaller screens.
- **Update Grid View** - Advanced grid page with Excel binding, selected-record details, and bulk update support.

All grids remain synchronized, ensuring status updates are reflected consistently throughout the application.

The application uses React Router for navigation and Syncfusion Tailwind 3 theming for visual styling.

---

## Technology Stack

### Dependencies

- **React** (v19.2.8)
- **React Router** (v8.3.0)
- **Syncfusion EJ2 React Components**:
  - Data Grids
  - Buttons
  - Calendars (DatePicker)
  - Dropdowns
  - Inputs (TextBox, NumericTextBox, Uploader)
  - Popups (Dialog)
  - Navigations (Accordion)
  - Query Builder
- **Tailwind CSS Theme** (@syncfusion/ej2-tailwind3-theme v34.2.2)
- **XLSX** (v0.18.5) - For Excel file handling

### Build Tools

- **Vite** (v8.2.2) - Fast build tool and dev server
- **React Plugin** (@vitejs/plugin-react)
- **Oxlint** - Fast JavaScript linter

---

## Features

### Grid Component

The Grid component displays comprehensive order tracking data with the following capabilities:

#### Data Display Features

- **Multi-Column Layout** - Displays customer names, order dates, shipping dates, and more
- **Stacked Headers** - Groups related columns under shared headers
- **Column Templates** - Custom header templates with icons
- **Column Freezing** - Freeze important columns for easier navigation
- **Column Reordering** - Drag columns to reorder them
- **Column Resizing** - Adjust column widths dynamically
- **Column Menu** - Right-click column menu for quick actions
- **Column Chooser** - Show/hide columns as needed

#### Data Interaction Features

- **Sorting** - Single and multi-column sorting
- **Filtering** - Filter data by multiple criteria
- **Grouping** - Group data by specific columns
- **Infinite Scrolling** - Seamless data loading for large datasets
- **Virtual Scrolling** - Efficient rendering of large data sets
- **Pagination** - Page-based data navigation
- **Selection** - Select rows for bulk operations
- **Row Drag and Drop** - Reorder rows by dragging
- **Context Menu** - Right-click menu for row actions
- **Adaptive UI** - Mobile-friendly editing and layout behavior

#### Editing & Export Features

- **Inline Editing** - Edit cell values directly in the grid
- **Dialog Editing** - Responsive editing mode on mobile devices
- **Toolbar Actions** - Quick actions via toolbar buttons
- **Excel Export** - Export grid data to Excel format
- **PDF Export** - Export grid data to PDF format

### Advanced Features

#### Bind from Excel

The application supports binding grid data from external Excel files:
- Upload Excel files directly through the UI
- Parse multi-sheet Excel workbooks using the XLSX library
- Replace the current grid data source with imported Excel data
- Restore the default sample data when no file is selected
- Clear pinned rows and internal row indexes before rebinding

**Use Case**: Quickly import customer orders or other data sets from Excel files into the grid for analysis and management.

#### View Selected Records

View and manage selected grid records in an isolated view:
- Display only the selected rows in a separate dialog window
- Preserve the main grid column configuration in the selected-records grid
- Show selected row details in a side panel on larger screens
- Use an accordion layout to group editable fields by category
- Keep selected record values synchronized across updates

**Use Case**: Focus on a subset of records for detailed review, bulk updates, or reporting without affecting the main grid view.

#### Bulk Update Operations

Apply changes to multiple selected records simultaneously:
- Select one or more rows in the grid
- Update a chosen field using dropdown, date, number, or text controls
- Apply the change to all selected records at once


**Use Case**: Quickly update order status, shipping details, payment information, or other fields for multiple records in one operation.

#### Custom Filtering

Advanced filtering options with custom templates:
- **Date Filtering** - Filter by specific dates using a date picker
- **Dropdown Filtering** - Pre-defined value filters for status fields
- **Filter Bar Operators** - Advanced comparison operators for filtering
- **Clear All Filters** - Reset all active filters with one click
- **Dynamic Filter Templates** - Custom filter UI for specific column types

**Use Case**: Quickly narrow down data to find specific orders by date range, status, or other criteria.

#### Dynamic Row Height Customization

Adjust row heights for better visibility:
- **Small** - Compact row height for maximum data density
- **Medium** - Balanced row height for comfortable reading
- **Large** - Relaxed row height for enhanced visibility
- Responsive row heights based on content

**Use Case**: Switch between compact and relaxed views depending on viewing preferences and screen size.

### Adaptive Page

Mobile-responsive grid layout optimized for smaller screens with adaptive UI components and touch-friendly interactions.

---

## Getting Started

### Installation

1. Navigate to the project directory:
   ```bash
   cd react-poc-sample
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

#### Production Build

Build the application for production:

```bash
npm run build
```

The built files will be output to the `dist` folder.

#### Preview Built Application

Preview the production build locally:

```bash
npm run preview
```

### Code Quality

Run the linter to check code quality:

```bash
npm run lint
```

---

## Key Components

### App Component

The main application component that sets up React Router and provides the overall layout structure with:
- Navigation bar at the top
- Main content area with route handling
- Routes for Home, Grid, and Adaptive pages

### Grid Component

Comprehensive demonstration of Syncfusion Grid capabilities with:
- Rich data set with multiple columns
- Decorated header templates with icons
- Status-based visual configurations
- Export and editing capabilities

### UpdateGrid Component

Advanced grid workflow page featuring:
- Excel binding through file upload and workbook parsing
- A selected-records dialog for focused review
- A side panel that shows editable selected-row details
- Accordion-based field grouping for quick editing
- Bulk updates across selected rows
- Responsive dialog behavior for mobile and desktop layouts

#### Accordion Implementation

The `updateGrid` page uses the Syncfusion Accordion component to organize selected-row fields into logical groups and make the editing panel easier to scan.

**How it works:**

1. **Collect grid columns dynamically**
   - The component reads the current grid columns from `gridRef.current.getColumns()`.
   - It filters out invalid columns, primary-key columns, and non-editable columns.
   - This keeps the accordion in sync with the actual grid definition.

2. **Group fields into sections**
   - Columns are grouped by field name into categories such as:
     - **Order**
     - **Shipping**
     - **Customer**
     - **General**
   - The grouping logic uses field-name patterns to decide where each column belongs.

3. **Build field controls by type**
   - Each field is rendered with a control that matches its edit type:
     - `DropDownListComponent` for dropdown fields
     - `NumericTextBoxComponent` for numeric fields
     - `DatePickerComponent` for date fields
     - `TextBoxComponent` for text fields
   - Labels are shown beside the inputs to keep the layout compact and readable.

4. **Render accordion items**
   - Each group becomes an accordion section.
   - The section content is generated from the grouped fields.
   - All sections are expanded by default so users can review data immediately.

5. **Sync the selected record state**
   - When a row is selected, the component merges selected-record values into a single `selectedRowData` object.
   - If values differ across multiple selected rows, the field is shown as empty.
   - When a field changes, the bulk update logic applies the value back to the selected record(s).

**Result:**
The accordion acts as a structured editor for the selected records panel, helping users update related fields without navigating a flat list of inputs.

### Adaptive Component

Mobile-optimized grid view featuring:
- Mobile device preview styling
- Responsive grid layout
- Touch-friendly controls
- Device-frame styling for demonstration

---

## Routing

The application uses React Router with the following routes:

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page |
| `/home` | Home | Same as home page |
| `/grid` | Grid | Main grid demonstration |
| `/adaptive` | Adaptive | Mobile-responsive view |
| `*` | Navigate to `/` | Catch-all redirect |

---

## Configuration

### Vite Configuration

The Vite configuration includes:
- React plugin support
- Custom base path for production builds (`/CustomDemos/868499/`)
- History API fallback for client-side routing
- Development server with middleware mode disabled

### Syncfusion License

Ensure your Syncfusion license is properly configured. The application uses Syncfusion v34.2.2 components.

---

## Styling

The application uses:
- **Syncfusion Tailwind 3 Theme** - Modern, customizable component styling
- **Custom CSS** - Additional styling in `App.css`, `Home.css`, and `Navbar.css`
- **Flexbox & Responsive Design** - Mobile-friendly layouts

---

## Browser Support

Works with all modern browsers that support:
- ES6+ JavaScript
- CSS3
- React 19.x
- React Router 8.x

---

## Notes

- The grid data is loaded from `data/virtualData.jsx`
- Export functionality requires the XLSX library for Excel support
- The application uses Syncfusion's data management APIs for querying and filtering
- Mobile view is simulated in the Adaptive component with device frame styling

---

## Next Steps

To extend this application, consider:
- Adding backend API integration for data fetching
- Implementing authentication and user management
- Adding more grid examples and use cases
- Customizing themes and branding
- Adding more export formats (CSV, JSON)
- Implementing real-time data updates

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
http://localhost:5173
```

---

## Demo Reference

https://ej2.syncfusion.com/react/demos/#/tailwind3/grid/overview

## Documentation

- https://help.syncfusion.com/grid-sdk/react/data-grid/filtering/filtering
- https://help.syncfusion.com/grid-sdk/react/data-grid/sorting
- https://help.syncfusion.com/grid-sdk/react/data-grid/columns/column-menu
- https://help.syncfusion.com/grid-sdk/react/data-grid/row/row-drag-and-drop
