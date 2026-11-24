import {
  CalculatedField,
  DrillThrough,
  FieldList,
  GroupingBar,
  Inject,
  PivotViewComponent,
} from '@syncfusion/ej2-react-pivotview';

const sales = [
  { country: 'France', product: 'Bikes', year: 'FY 2025', sold: 31, amount: 52824 },
  { country: 'France', product: 'Accessories', year: 'FY 2025', sold: 51, amount: 86904 },
  { country: 'Germany', product: 'Bikes', year: 'FY 2025', sold: 42, amount: 71400 },
  { country: 'Germany', product: 'Accessories', year: 'FY 2026', sold: 36, amount: 61200 },
];

const dataSourceSettings = {
  dataSource: sales,
  rows: [{ name: 'country', caption: 'Country' }],
  columns: [{ name: 'year', caption: 'Fiscal year' }],
  values: [
    { name: 'amount', caption: 'Revenue' },
    { name: 'sold', caption: 'Units sold' },
    { name: 'averagePrice', caption: 'Average price', type: 'CalculatedField' },
  ],
  filters: [{ name: 'product', caption: 'Product' }],
  calculatedFieldSettings: [
    { name: 'averagePrice', formula: '"Sum(amount)"/"Sum(sold)"' },
  ],
  formatSettings: [
    { name: 'amount', format: 'C0' },
    { name: 'averagePrice', format: 'C2' },
  ],
};

function restrictFieldDrop(args) {
  if (args.fieldName === 'amount' && args.dropAxis !== 'values') args.cancel = true;
}

export default function App() {
  return (
    <PivotViewComponent
      id="sales-pivot"
      height={420}
      dataSourceSettings={dataSourceSettings}
      showFieldList
      showGroupingBar
      allowCalculatedField
      allowDrillThrough
      fieldDrop={restrictFieldDrop}
    >
      <Inject services={[FieldList, GroupingBar, CalculatedField, DrillThrough]} />
    </PivotViewComponent>
  );
}
