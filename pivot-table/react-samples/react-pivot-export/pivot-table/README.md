# Dynamic Data Pivot Table POC

This sample connects a Syncfusion React Pivot Table to the .NET server-side pivot engine without a compile-time data-row model. The API can read a flat JSON array, CSV file, or SQLite query into runtime `ExpandoObject` records.

## Select a data source

Set `PivotDataSource:Type` in `PivotController/appsettings.json` to one of:

- `Json` — reads `JsonPath`.
- `Csv` — reads `CsvPath` using `CsvDelimiter`; the first row supplies field names and column types are inferred.
- `Database` — reads the configured SQLite `DatabasePath` using the fixed `Query`. The included database is created from `sales.sql` on first use.

All paths are relative to `PivotController/DataSource` and cannot escape that directory. Source locations and SQL are server-controlled; the browser cannot submit arbitrary paths, URLs, connection strings, or queries. Restart the API after changing the source type.

### CSV delimiter configuration

CSV parsing is not limited to commas. Configure one delimiter character in `PivotController/appsettings.json`:

```json
"PivotDataSource": {
  "Type": "Csv",
  "CsvPath": "sales.csv",
  "CsvDelimiter": ";"
}
```

Common values are `","` for comma, `";"` for semicolon, `"|"` for pipe, and `"\t"` for tab. Quoted fields may contain the configured delimiter. For example, `West;"Bike; Deluxe";12.50` is parsed as three values when the delimiter is `;`.

## Run the sample

```sh
cd PivotController
dotnet run
```

In another terminal:

```sh
cd pivot-table
npm install
npm run dev
```

The React app uses `http://localhost:5285/api/pivot/post` by default. Override it with `VITE_PIVOT_SERVICE_URL` when required.

The report intentionally starts empty. Open **Field List**, then drag any discovered fields into Rows, Columns, Values, or Filters. Grouping, filtering, virtualization, raw-data operations, and pivot Excel export continue through the same server endpoint.

## Verification

From the workspace root:

```sh
dotnet test PivotController.Tests/PivotController.Tests.csproj
cd pivot-table
npm run lint
npm run build
```
