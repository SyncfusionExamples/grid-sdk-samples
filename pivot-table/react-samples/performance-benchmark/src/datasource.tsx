let universities: string[] = [
  'MIT', 'Stanford University', 'Harvard University', 'Oxford University',
  'Cambridge University', 'Caltech', 'UCL', 'ETH Zurich', 'Imperial College London'
];
let countries: string[] = [
  'United States', 'United Kingdom', 'Germany', 'Canada', 'Australia', 'India'
];
let cities: string[] = [
  'New York', 'London', 'Berlin', 'Toronto', 'Sydney', 'Chennai'
];
let regions: string[] = [
  'North America', 'Europe', 'Asia', 'Oceania'
];

let types: string[] = ['Public', 'Private'];
let research: string[] = ['Very High', 'High'];
let sizes: string[] = ['S', 'M', 'L', 'XL'];

let ratios: number[] = [3, 4, 5, 6, 7, 8, 9, 10];
let students: number[] = [1000, 2000, 3000, 5000, 8000, 12000];
let faculty: number[] = [500, 1000, 2000, 4000, 7000];

export const getPerformanceData: Function = (count: number, isDataCompression: boolean = false) => {
  let result: Object[] = [];
  let index = 1;

  for (let i = 0; i < count; i++) {
    let rankPadded: string | number;

    if (isDataCompression) {
      // Data compression format: padded strings cycling 1-1000
      const toString = index.toString();
      if (toString.length === 1) {
        rankPadded = "000" + index;
      } else if (toString.length === 2) {
        rankPadded = "00" + index;
      } else if (toString.length === 3) {
        rankPadded = "0" + index;
      } else {
        rankPadded = toString;
      }
      index = index >= 1000 ? 1 : index + 1;
    } else {
      // Normal format: padded strings with i+1
      const num = i + 1;
      const toString = num.toString();
      if (toString.length === 1) {
        rankPadded = "0000" + num;
      } else if (toString.length === 2) {
        rankPadded = "000" + num;
      } else if (toString.length === 3) {
        rankPadded = "00" + num;
      } else if (toString.length === 4) {
        rankPadded = "0" + num;
      } else {
        rankPadded = toString;
      }
    }

    const universityIdx = Math.floor(Math.random() * universities.length);
    const record: any = {
      rank_display: isDataCompression ? rankPadded : i + 1,
      university: universities[universityIdx],
      year: 2017,
      score: Number((100 - Math.random() * 60).toFixed(2)),
      country: countries[Math.floor(Math.random() * countries.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      type: types[Math.floor(Math.random() * types.length)],
      research_output: research[Math.floor(Math.random() * research.length)],
      student_faculty_ratio: ratios[Math.floor(Math.random() * ratios.length)],
      international_students: students[Math.floor(Math.random() * students.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      faculty_count: faculty[Math.floor(Math.random() * faculty.length)]
    };
    result.push(record);
  }
  return result;
};