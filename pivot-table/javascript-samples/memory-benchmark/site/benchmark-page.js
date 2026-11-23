(async () => {
    window.addEventListener('error', (event) => {
        window.__pivotBenchmarkError = { message: event.error ? event.error.message : event.message };
    });
    const params = new URLSearchParams(location.search);
    const release = params.get('release');
    const records = Number(params.get('records'));
    const packageNames = ['ej2-base', 'ej2-data', 'ej2-compression', 'ej2-file-utils', 'ej2-excel-export', 'ej2-pdf-export', 'ej2-buttons', 'ej2-inputs', 'ej2-lists', 'ej2-navigations', 'ej2-popups', 'ej2-grids', 'ej2-dropdowns', 'ej2-calendars', 'ej2-splitbuttons', 'ej2-querybuilder', 'ej2-svg-base', 'ej2-charts', 'ej2-pivotview'];
    const heap = () => performance.memory ? performance.memory.usedJSHeapSize : null;
    let peakHeap = heap() || 0;
    const sampling = setInterval(() => { peakHeap = Math.max(peakHeap, heap() || 0); }, 25);
    const loadScript = (name) => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `/.artifacts/${release}/node_modules/@syncfusion/${name}/dist/${name}.min.js`;
        script.onload = () => {
            resolve();
        };
        script.onerror = () => reject(new Error(`Unable to load ${name}`));
        document.head.appendChild(script);
    });
    const data = Array.from({ length: records }, (_, index) => ({
        id: `record-${index}`, orderNumber: `ORD-${String(index).padStart(7, '0')}`,
        customer: `Customer ${String(index).padStart(7, '0')}`,
        region: ['North', 'South', 'East', 'West'][index % 4],
        segment: ['Consumer', 'Corporate', 'Home Office'][index % 3], year: 2023 + (index % 3),
        quarter: `Q${(index % 4) + 1}`, sales: 100 + ((index * 7919) % 90000), quantity: (index % 20) + 1
    }));
    const preparedDataHeap = heap();
    try {
        for (const packageName of packageNames) await loadScript(packageName);
        if (!window.SyncfusionPivotview) {
            throw new Error('PivotView export unavailable.');
        }
        const { PivotView, VirtualScroll } = window.SyncfusionPivotview;
        PivotView.Inject(VirtualScroll);
        const startedAt = performance.now();
        let pivot;
        let sortStartedAt = null;
        pivot = new PivotView({
            dataSourceSettings: {
                dataSource: data,
                rows: [{ name: 'region' }, { name: 'segment' }],
                columns: [{ name: 'year' }, { name: 'quarter' }],
                values: [{ name: 'sales', type: 'Sum' }, { name: 'quantity', type: 'Sum' }]
            },
            enableVirtualization: true,
            virtualScrollSettings: { allowSinglePage: true },
            width: '1200px', height: '600px',
            dataBound: () => {
                if (sortStartedAt !== null && window.__pivotBenchmark) {
                    window.__pivotBenchmark.sortMs = performance.now() - sortStartedAt;
                    return;
                }
                clearInterval(sampling);
                peakHeap = Math.max(peakHeap, heap() || 0);
                window.__pivotBenchmark = {
                    release, records, preparedDataHeap, peakHeap, loadMs: performance.now() - startedAt,
                    renderedRows: document.querySelectorAll('#PivotView tr').length,
                    sortMs: null
                };
                window.__pivotBenchmarkSort = () => {
                    sortStartedAt = performance.now();
                    const sort = { name: 'region', order: 'Descending' };
                    pivot.dataSourceSettings.sortSettings = [sort];
                    pivot.lastSortInfo = sort;
                    pivot.updateDataSource();
                };
            }
        });
        pivot.appendTo('#PivotView');
    } catch (error) {
        clearInterval(sampling);
        window.__pivotBenchmarkError = { message: error.message, release, records };
    }
})();
