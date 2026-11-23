'use strict';

const RELEASES = Object.freeze({
    vol2: { label: '2026 Vol. 2', version: '34.2.3' },
    vol3: { label: '2026 Vol. 3', version: '35.1.37' }
});

function createDataset(count) {
    if (!Number.isInteger(count) || count < 1) {
        throw new Error('Record count must be a positive integer.');
    }
    return Array.from({ length: count }, (_, index) => ({
        id: `record-${index}`,
        orderNumber: `ORD-${String(index).padStart(7, '0')}`,
        customer: `Customer ${String(index).padStart(7, '0')}`,
        region: ['North', 'South', 'East', 'West'][index % 4],
        segment: ['Consumer', 'Corporate', 'Home Office'][index % 3],
        year: 2023 + (index % 3),
        quarter: `Q${(index % 4) + 1}`,
        sales: 100 + ((index * 7919) % 90000),
        quantity: (index % 20) + 1
    }));
}

function median(values) {
    const sorted = [...values].sort((left, right) => left - right);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function roundedPercent(baseline, candidate) {
    return Number((((baseline - candidate) / baseline) * 100).toFixed(3));
}

function summarizeScenario(results) {
    const output = {};
    for (const release of ['vol2', 'vol3']) {
        const runs = results.filter((result) => result.release === release);
        output[release] = Object.fromEntries(['heapDeltaBytes', 'loadMs', 'sortMs'].map((metric) => [
            metric,
            median(runs.map((run) => run[metric]))
        ]));
    }
    output.improvementPercent = Object.fromEntries(['heapDeltaBytes', 'loadMs', 'sortMs'].map((metric) => [
        metric,
        roundedPercent(output.vol2[metric], output.vol3[metric])
    ]));
    return output;
}

module.exports = { RELEASES, createDataset, median, summarizeScenario };
