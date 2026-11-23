'use strict';

const { createServer } = require('node:http');
const { mkdirSync, existsSync, readFileSync, writeFileSync } = require('node:fs');
const { join, normalize } = require('node:path');
const os = require('node:os');
const { RELEASES, summarizeScenario } = require('../lib/benchmark.cjs');

const root = join(__dirname, '..');
const runs = Number(process.argv.find((arg) => arg.startsWith('--runs='))?.split('=')[1] || 5);
const recordCounts = (process.argv.find((arg) => arg.startsWith('--records='))?.split('=')[1] || '100000,1000000').split(',').map(Number);
const selectedReleases = (process.argv.find((arg) => arg.startsWith('--releases='))?.split('=')[1] || 'vol2,vol3').split(',');
const timeoutMs = Number(process.argv.find((arg) => arg.startsWith('--timeout-ms='))?.split('=')[1] || 300000);

function contentType(file) {
    if (file.endsWith('.html')) return 'text/html';
    if (file.endsWith('.js')) return 'text/javascript';
    return 'application/octet-stream';
}

function startServer() {
    const server = createServer((request, response) => {
        const urlPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const file = normalize(join(root, urlPath === '/' ? 'site/index.html' : urlPath));
        if (!file.startsWith(root) || !existsSync(file)) {
            response.writeHead(404).end();
            return;
        }
        response.writeHead(200, { 'Content-Type': contentType(file), 'Cache-Control': 'no-store' });
        response.end(readFileSync(file));
    });
    return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function benchmarkRun(browser, endpoint, release, records, iteration) {
    const pageErrors = [];
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    page.on('pageerror', (error) => pageErrors.push(error.message));
    try {
        await page.goto(`${endpoint}/?release=${release}&records=${records}`, { waitUntil: 'load', timeout: 120000 });
        await page.waitForFunction(() => window.__pivotBenchmark || window.__pivotBenchmarkError, { timeout: timeoutMs });
        const failure = await page.evaluate(() => window.__pivotBenchmarkError || null);
        if (failure) throw new Error(failure.message);
        await page.evaluate(() => window.__pivotBenchmarkSort());
        await page.waitForFunction(() => window.__pivotBenchmark && window.__pivotBenchmark.sortMs !== null, { timeout: timeoutMs });
        const metric = await page.evaluate(() => window.__pivotBenchmark);
        return {
            release, releaseVersion: RELEASES[release].version, records, iteration,
            heapDeltaBytes: metric.peakHeap - metric.preparedDataHeap,
            peakHeapBytes: metric.peakHeap,
            preparedDataHeapBytes: metric.preparedDataHeap,
            loadMs: metric.loadMs,
            sortMs: metric.sortMs,
            renderedRows: metric.renderedRows,
            status: 'passed'
        };
    } catch (error) {
        return { release, releaseVersion: RELEASES[release].version, records, iteration, status: 'failed', error: [error.message, ...pageErrors].join(' | ') };
    } finally {
        await context.close();
    }
}

function renderSummary(results) {
    const lines = ['| Records | Metric | Vol. 2 | Vol. 3 | Improvement |', '| ---: | --- | ---: | ---: | ---: |'];
    for (const records of recordCounts) {
        const scenario = results.filter((result) => result.records === records && result.status === 'passed');
        if (scenario.length !== runs * selectedReleases.length) continue;
        const summary = summarizeScenario(scenario);
        for (const [metric, label] of [['heapDeltaBytes', 'Peak JS heap delta (bytes)'], ['loadMs', 'Initial render (ms)'], ['sortMs', 'Sort (ms)']]) {
            lines.push(`| ${records.toLocaleString()} | ${label} | ${summary.vol2[metric].toFixed(2)} | ${summary.vol3[metric].toFixed(2)} | ${summary.improvementPercent[metric].toFixed(3)}% |`);
        }
    }
    return lines.join('\n');
}

async function main() {
    for (const release of selectedReleases) {
        if (!RELEASES[release]) throw new Error(`Unknown release: ${release}`);
        if (!existsSync(join(root, '.artifacts', release, 'node_modules', '@syncfusion', 'ej2-pivotview'))) {
            throw new Error(`Missing ${release} artifacts. Run npm --prefix benchmarks/pivot-memory run install-releases first.`);
        }
    }
    const { chromium } = require('playwright');
    const server = await startServer();
    const address = server.address();
    const endpoint = `http://127.0.0.1:${address.port}`;
    const chromePath = process.env.PIVOT_BENCHMARK_BROWSER || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const browser = await chromium.launch({
        headless: true,
        executablePath: existsSync(chromePath) ? chromePath : undefined,
        args: ['--js-flags=--expose-gc']
    });
    const results = [];
    try {
        for (const records of recordCounts) {
            for (const release of selectedReleases) {
                for (let iteration = 1; iteration <= runs; iteration++) {
                    const result = await benchmarkRun(browser, endpoint, release, records, iteration);
                    results.push(result);
                    console.log(`${release} ${records} run ${iteration}: ${result.status}`);
                }
            }
        }
    } finally {
        await browser.close();
        await new Promise((resolve) => server.close(resolve));
    }
    const resultDirectory = join(root, 'results');
    mkdirSync(resultDirectory, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const report = {
        generatedAt: new Date().toISOString(),
        environment: { platform: process.platform, release: os.release(), cpu: os.cpus()[0].model, memoryBytes: os.totalmem() },
        releases: RELEASES, runs, recordCounts, results, summaryMarkdown: renderSummary(results)
    };
    const destination = join(resultDirectory, `${stamp}.json`);
    writeFileSync(destination, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`\n${report.summaryMarkdown}\n\nRaw results: ${destination}`);
}

main().catch((error) => { console.error(error.stack); process.exitCode = 1; });
