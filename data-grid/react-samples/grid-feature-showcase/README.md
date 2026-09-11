# Advanced Order Management Grid

A React and Syncfusion EJ2 Data Grid application for exploring a large, feature-rich order dataset. The sample demonstrates stacked headers, filtering, column management, row pinning, and responsive grid sizing.

## Features

- Local generation of 1,000 deterministic order records with 40 fields
- Syncfusion React Data Grid with horizontal scrolling and infinite scrolling
- Stacked headers for Order, Customer, Shipping, and Financial fields
- Visible and hidden columns managed through the Column Chooser
- Column reordering and resizing
- Custom toolbar with Column Chooser and Restore Columns actions
- Restore the original column configuration, filters, and sorting
- Standalone global search using the Syncfusion TextBox
- Global search triggered by pressing Enter
- Clear icon that resets the global search with `grid.search('')`
- Filter bar with custom MultiSelect and date-range filter templates
- Column menu with sorting, autofit, and filter type selection
- Context-menu actions for freezing and unfreezing columns
- Automatic row pinning for critical orders with paid payment status
- Responsive viewport-based application layout

## Technology Stack

- React 19
- Syncfusion EJ2 React Grid
- Syncfusion EJ2 React Inputs, Dropdowns, and Calendars
- Vite
- Azure App Service or IIS-compatible static hosting

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Create a production build

```bash
npm run build
```

The production output is generated in the `dist` directory.

### Preview the production build

```bash
npm run preview
```

## Azure Hosting

The Vite configuration uses the `/grid-feature-showcase/` base path:

```js
base: '/grid-feature-showcase/'
```

Deploy the contents of the `dist` directory to the matching application path. The `public/web.config` file is copied into `dist` during the build and configures:

- MIME types for JSON, WebAssembly, fonts, SVG, and web manifests
- Static and dynamic compression
- SPA fallback to `index.html`
- Base-path rewriting for real asset files

For a root-domain deployment where the application is not hosted under a subpath, change the Vite base to `/` before building.

## Project Structure

- [src/components/Grid.jsx](src/components/Grid.jsx) - Grid configuration, columns, filters, search, menus, and toolbar actions
- [src/components/datasource.jsx](src/components/datasource.jsx) - Deterministic order data generator and 40-field dataset
- [src/App.jsx](src/App.jsx) - Application shell and page layout
- [src/App.css](src/App.css) - Application and responsive layout styles
- [public/web.config](public/web.config) - IIS/Azure hosting configuration
- [vite.config.js](vite.config.js) - Vite build and deployment base path

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production bundle |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview the production bundle |
