# EJ2 PivotTable memory benchmark

Compare PivotTable 34.2.3 and 35.1.37 with identical synthetic datasets of 100,000 and 1 million records.

From this folder, use Node.js 18 or later and run:

```sh
npm install
npm run setup
npx playwright install chromium
npm test
npm run benchmark
```

For a quick smoke test, run `npm run benchmark -- --records=1000 --runs=1`. The runner uses installed Google Chrome on Windows when available. Set `PIVOT_BENCHMARK_BROWSER` to override the executable.

Results in `results/` include individual samples and medians. The heap metric is the highest observed page JavaScript heap through first data bind minus the reading after input data preparation. It includes EJ2 bundle initialization. Timer sampling can miss brief allocations. Sort timing measures a programmatic descending sort and rebind. The report uses virtual scrolling with `allowSinglePage: true`.
