// Synthetic sales data generator used by the pivot performance benchmark.
// The cardinality of each field is bounded so that the pivot output stays
// readable while still exercising the engine with large record counts.

const REGIONS = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania']

const COUNTRIES = {
  'North America': ['United States', 'Canada', 'Mexico'],
  'South America': ['Brazil', 'Argentina', 'Chile'],
  Europe: ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain'],
  Asia: ['Japan', 'China', 'India', 'South Korea'],
  Africa: ['South Africa', 'Egypt', 'Nigeria'],
  Oceania: ['Australia', 'New Zealand'],
}

const CATEGORIES = ['Bikes', 'Cars', 'Components', 'Accessories', 'Clothing', 'Electronics']

const MODELS = {
  Bikes: ['Mountain-100', 'Road-250', 'Touring-3000'],
  Cars: ['Sedan-200', 'SUV-400', 'Convertible-500'],
  Components: ['Brakes', 'Gears', 'Frames', 'Wheels'],
  Accessories: ['Helmets', 'Bottles', 'Lights'],
  Clothing: ['Jerseys', 'Gloves', 'Shorts'],
  Electronics: ['GPS-100', 'Monitors', 'Sensors'],
}

const CHANNELS = ['Online', 'Retail', 'Wholesale']

const randomInt = (max) => Math.floor(Math.random() * max)

/**
 * Generates `count` synthetic sales records.
 *
 * @param {number} count Number of records to generate.
 * @returns {Array<Object>} Sales records with categorical and numeric fields.
 */
export function generateSalesData(count) {
  const data = new Array(count)

  for (let i = 0; i < count; i++) {
    const region = REGIONS[randomInt(REGIONS.length)]
    const countries = COUNTRIES[region]
    const country = countries[randomInt(countries.length)]
    const category = CATEGORIES[randomInt(CATEGORIES.length)]
    const models = MODELS[category]
    const model = models[randomInt(models.length)]
    const soldCount = 1 + randomInt(50)
    const unitPrice = 10 + randomInt(990)

    data[i] = {
      Year: 2020 + randomInt(6),
      Region: region,
      Country: country,
      'Product Category': category,
      'Product Model': model,
      Channel: CHANNELS[randomInt(CHANNELS.length)],
      'Sold Count': soldCount,
      Amount: soldCount * unitPrice,
    }
  }

  return data
}
