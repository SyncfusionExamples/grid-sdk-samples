/**
 * Generates synthetic sales records for the pivot performance benchmark.
 *
 * Each record mirrors the shape of the classic Syncfusion pivot sales data:
 * country, product category, product name, year, quarter, and measures.
 */

const countries = [
  { name: 'Canada', products: ['Bikes', 'Cars', 'Trucks'] },
  { name: 'France', products: ['Bikes', 'Cars'] },
  { name: 'Germany', products: ['Bikes', 'Cars', 'Trucks'] },
  { name: 'India', products: ['Bikes', 'Cars', 'Trucks', 'Vans'] },
  { name: 'Italy', products: ['Bikes', 'Vans'] },
  { name: 'Japan', products: ['Bikes', 'Cars', 'Vans'] },
  { name: 'Mexico', products: ['Bikes', 'Cars'] },
  { name: 'Spain', products: ['Bikes', 'Trucks'] },
  { name: 'United Kingdom', products: ['Bikes', 'Cars', 'Trucks'] },
  { name: 'United States', products: ['Bikes', 'Cars', 'Trucks', 'Vans'] },
];

const years = ['FY 2015', 'FY 2016', 'FY 2017', 'FY 2018', 'FY 2019', 'FY 2020'];
const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
const productNames = {
  Bikes: ['Mountain Bikes', 'Road Bikes', 'Touring Bikes'],
  Cars: ['Convertible', 'Hatchback', 'Sedan'],
  Trucks: ['Delivery Trucks', 'Pickup Trucks'],
  Vans: ['Cargo Vans', 'Passenger Vans'],
};
const sellers = [
  'Adams', 'Clarke', 'Dodsworth', 'Jiang', 'Kumar',
  'Mitchell', 'Owens', 'Seo', 'Smith', 'Yang',
];

/**
 * Creates the given number of synthetic sales records.
 *
 * @param {number} recordCount - Number of records to generate.
 * @returns {Array<Object>} The generated flat dataset.
 */
export function generateSalesData(recordCount) {
  const data = new Array(recordCount);
  let seed = 42;
  const random = () => {
    // Simple linear congruential generator so runs are reproducible.
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  for (let i = 0; i < recordCount; i++) {
    const country = countries[Math.floor(random() * countries.length)];
    const product = country.products[Math.floor(random() * country.products.length)];
    const names = productNames[product];
    const year = years[Math.floor(random() * years.length)];
    data[i] = {
      country: country.name,
      product,
      product_name: names[Math.floor(random() * names.length)],
      date: `${year} ${quarters[Math.floor(random() * quarters.length)]}`,
      year,
      quarter: quarters[Math.floor(random() * quarters.length)],
      seller: sellers[Math.floor(random() * sellers.length)],
      sold: Math.round(random() * 90) + 1,
      amount: Math.round(random() * 9500) / 10 + 20,
    };
  }

  return data;
}
