# Pivot Table performance benchmark (JavaScript)

This sample measures how the Syncfusion JavaScript Pivot Table (`@syncfusion/ej2-pivotview`)
performs with progressively larger datasets. It is a plain JavaScript + Vite project — no
TypeScript, no server, and no framework wrappers.

## What it measures

Running the benchmark generates a reproducible synthetic sales dataset client-side, feeds it to
the pivot engine, and times each stage:

| Metric | Description |
| --- | --- |
| Data generation | Time to build the flat array of records with a seeded PRNG. |
| Pivot population | Time for the pivot engine to refresh with the new `dataSourceSettings.dataSource`. |
| Render (first paint) | Time from engine refresh to the first `dataBound` paint of the virtualized grid. |
| Records in view | Visible rows rendered by virtual scrolling (not the total record count). |

Record counts range from 1,000 to 250,000. Virtualization is enabled for all runs, so only the
visible slice of the report is rendered in the DOM.

## Run the sample

```sh
npm install
npm run dev
```

Open the printed Vite URL, pick a record count, and click **Run benchmark**.

## Build

```sh
npm run build
npm run preview
```

## Notes

- Data is generated with a linear congruential PRNG (seeded at 42) so every run at the same
  record count produces identical data and comparable timings.
- The pivot report is fixed (Country/Product rows, Year/Quarter columns, Units Sold and Sold
  Amount values). Use the built-in **Grouping Bar** or **Field List** to rearrange fields and see
  how different report shapes affect performance.
- `refresh(true)` re-runs the full engine population; timings therefore include the aggregation
  stage, not incremental updates.
