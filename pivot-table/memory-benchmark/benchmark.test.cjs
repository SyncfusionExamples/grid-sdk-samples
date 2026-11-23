const test = require('node:test');
const assert = require('node:assert/strict');
const { RELEASES, createDataset, median, summarizeScenario } = require('./lib/benchmark.cjs');

test('pins the published 2026 Vol. 2 and Vol. 3 package versions', () => {
    assert.equal(RELEASES.vol2.version, '34.2.3');
    assert.equal(RELEASES.vol3.version, '35.1.37');
});

test('creates deterministic, fully unique records at the requested scale', () => {
    const first = createDataset(3);
    const second = createDataset(3);

    assert.deepEqual(first, second);
    assert.equal(new Set(first.map((record) => record.id)).size, 3);
    assert.equal(new Set(first.map((record) => record.orderNumber)).size, 3);
    assert.equal(new Set(first.map((record) => record.customer)).size, 3);
});

test('summarizes medians and Vol. 3 improvements consistently', () => {
    assert.equal(median([9, 3, 5, 1, 7]), 5);
    assert.deepEqual(summarizeScenario([
        { release: 'vol2', heapDeltaBytes: 100, loadMs: 50, sortMs: 30 },
        { release: 'vol2', heapDeltaBytes: 120, loadMs: 60, sortMs: 40 },
        { release: 'vol3', heapDeltaBytes: 75, loadMs: 40, sortMs: 20 },
        { release: 'vol3', heapDeltaBytes: 80, loadMs: 45, sortMs: 25 }
    ]), {
        vol2: { heapDeltaBytes: 110, loadMs: 55, sortMs: 35 },
        vol3: { heapDeltaBytes: 77.5, loadMs: 42.5, sortMs: 22.5 },
        improvementPercent: { heapDeltaBytes: 29.545, loadMs: 22.727, sortMs: 35.714 }
    });
});
