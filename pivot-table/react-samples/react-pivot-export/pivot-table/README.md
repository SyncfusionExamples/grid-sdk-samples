# Syncfusion React Pivot Table – Server Mode

This sample demonstrates a Syncfusion React Pivot Table that connects to a
server-side pivot engine. It presents product sales by year and supports
interactive report configuration and Excel export.

## Core functionality

- Processes pivot operations through a server endpoint
- Displays `ProductID` in rows and `Year` in columns
- Aggregates units sold and sales amount
- Formats the sales amount as currency
- Supports field sorting
- Provides a grouping bar for rearranging report fields
- Provides a field list for configuring the report at runtime
- Uses virtualization to render large reports efficiently
- Adjusts grid column width for desktop and mobile devices
- Exports the complete report to Excel in pivot format

## Prerequisites

- Node.js and npm
- A compatible Syncfusion Pivot Table server endpoint
- A valid Syncfusion license for your environment

The server endpoint must support Syncfusion Pivot Table server-mode actions,
including pivot initialization, interactive data operations, and
`onPivotExcelExport`.

## Configure the server endpoint

Copy `.env.example` to `.env`, then set the URL of your Pivot Table service:

```text
VITE_PIVOT_SERVICE_URL=https://localhost:44350/api/pivot/post
```

If the environment variable is omitted, the sample uses the URL shown above.

## Run the sample

Install the dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Open the URL printed by Vite. Use the grouping bar or field list to modify the
report, and select the Excel icon in the toolbar to export it.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## License

This sample uses Syncfusion Essential Studio components. Register your
Syncfusion license as required by your organization and deployment model.
