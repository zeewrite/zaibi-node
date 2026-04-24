const { faker, en, en_US, en_GB, en_CA, en_AU, base } = require('@faker-js/faker');
const { Faker } = require('@faker-js/faker');

const usFaker = new Faker({ locale: [en_US, en, base] });
const gbFaker = new Faker({ locale: [en_GB, en, base] });
const caFaker = new Faker({ locale: [en_CA, en, base] });
const auFaker = new Faker({ locale: [en_AU, en, base] });

const SUPPORTED_COUNTRIES = [
  { code: 'USA', name: 'United States', aliases: ['US', 'U.S.', 'U.S.A.', 'UNITEDSTATES'] },
  { code: 'UK', name: 'United Kingdom', aliases: ['GB', 'GBR', 'UNITEDKINGDOM', 'BRITAIN'] },
  { code: 'CA', name: 'Canada', aliases: ['CAN', 'CANADA'] },
  { code: 'AU', name: 'Australia', aliases: ['AUS', 'AUSTRALIA'] },
];

const UK_COUNTIES = [
  'Greater London', 'West Midlands', 'Greater Manchester', 'Merseyside',
  'West Yorkshire', 'South Yorkshire', 'Tyne and Wear', 'Kent', 'Essex',
  'Surrey', 'Hampshire', 'Lancashire', 'Cheshire', 'Devon', 'Oxfordshire',
];

const UK_CITIES = [
  'London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Sheffield',
  'Bristol', 'Newcastle upon Tyne', 'Nottingham', 'Leicester', 'Coventry',
  'Brighton', 'Oxford', 'Cambridge', 'Edinburgh', 'Glasgow', 'Cardiff', 'Belfast',
];

const UK_STREET_TYPES = [
  'Street', 'Road', 'Lane', 'Avenue', 'Close', 'Crescent', 'Court', 'Drive',
  'Gardens', 'Place', 'Square', 'Way', 'Terrace', 'Grove', 'Walk',
];

const CA_PROVINCES = [
  { code: 'ON', name: 'Ontario' },
  { code: 'QC', name: 'Quebec' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'AB', name: 'Alberta' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'YT', name: 'Yukon' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
];

const CA_CITIES_BY_PROVINCE = {
  ON: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London', 'Kitchener'],
  QC: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Sherbrooke'],
  BC: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Kelowna'],
  AB: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'],
  MB: ['Winnipeg', 'Brandon', 'Steinbach'],
  SK: ['Saskatoon', 'Regina', 'Prince Albert'],
  NS: ['Halifax', 'Dartmouth', 'Sydney'],
  NB: ['Moncton', 'Saint John', 'Fredericton'],
  NL: ['St. John\u2019s', 'Mount Pearl'],
  PE: ['Charlottetown', 'Summerside'],
  YT: ['Whitehorse'],
  NT: ['Yellowknife'],
  NU: ['Iqaluit'],
};

const AU_STATES = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'SA', name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NT', name: 'Northern Territory' },
];

const AU_CITIES_BY_STATE = {
  NSW: ['Sydney', 'Newcastle', 'Wollongong', 'Parramatta'],
  VIC: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
  QLD: ['Brisbane', 'Gold Coast', 'Townsville', 'Cairns'],
  WA: ['Perth', 'Fremantle', 'Bunbury'],
  SA: ['Adelaide', 'Mount Gambier'],
  TAS: ['Hobart', 'Launceston'],
  ACT: ['Canberra'],
  NT: ['Darwin', 'Alice Springs'],
};

function pad(num, length) {
  return String(num).padStart(length, '0');
}

function randomUkPostcode(f) {
  const area = f.helpers.arrayElement([
    'E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC',
    'B', 'M', 'L', 'LS', 'S', 'NE', 'BS', 'OX', 'CB', 'BN', 'EH', 'G', 'CF', 'BT',
  ]);
  const district = f.number.int({ min: 1, max: 20 });
  const space = ' ';
  const sector = f.number.int({ min: 0, max: 9 });
  const unit = `${f.string.alpha({ length: 1, casing: 'upper' })}${f.string.alpha({ length: 1, casing: 'upper' })}`;
  return `${area}${district}${space}${sector}${unit}`;
}

function randomCaPostalCode(f) {
  const letters = 'ABCEGHJKLMNPRSTVXY';
  const l = () => letters[f.number.int({ min: 0, max: letters.length - 1 })];
  const d = () => f.number.int({ min: 0, max: 9 });
  return `${l()}${d()}${l()} ${d()}${l()}${d()}`;
}

function randomUkPhone(f) {
  const area = f.helpers.arrayElement(['020', '0121', '0161', '0113', '0117', '0131', '0141']);
  const rest = `${pad(f.number.int({ min: 0, max: 9999 }), 4)} ${pad(f.number.int({ min: 0, max: 9999 }), 4)}`;
  return `+44 ${area.slice(1)} ${rest}`;
}

function randomAuPhone(f) {
  const area = f.helpers.arrayElement(['02', '03', '07', '08']);
  return `+61 ${area.slice(1)} ${pad(f.number.int({ min: 0, max: 9999 }), 4)} ${pad(f.number.int({ min: 0, max: 9999 }), 4)}`;
}

function randomCaPhone(f) {
  const area = f.helpers.arrayElement([
    '416', '647', '437', '905', '289', '613', '343', '514', '438', '450',
    '604', '778', '236', '403', '587', '825', '204', '431', '306', '639',
    '902', '782', '506', '709', '867',
  ]);
  const mid = pad(f.number.int({ min: 200, max: 999 }), 3);
  const end = pad(f.number.int({ min: 0, max: 9999 }), 4);
  return `+1 (${area}) ${mid}-${end}`;
}

function randomUsPhone(f) {
  const area = pad(f.number.int({ min: 201, max: 989 }), 3);
  const mid = pad(f.number.int({ min: 200, max: 999 }), 3);
  const end = pad(f.number.int({ min: 0, max: 9999 }), 4);
  return `+1 (${area}) ${mid}-${end}`;
}

function generateUsa() {
  const f = usFaker;
  return {
    country: 'USA',
    fullName: f.person.fullName(),
    streetAddress: `${f.number.int({ min: 10, max: 9999 })} ${f.location.street()}`,
    city: f.location.city(),
    state: f.location.state({ abbreviated: true }),
    zipCode: f.location.zipCode('#####'),
    phoneNumber: randomUsPhone(f),
  };
}

function generateUk() {
  const f = gbFaker;
  const houseNumber = f.number.int({ min: 1, max: 250 });
  const streetName = f.person.lastName();
  const streetType = f.helpers.arrayElement(UK_STREET_TYPES);
  return {
    country: 'UK',
    fullName: f.person.fullName(),
    streetAddress: `${houseNumber} ${streetName} ${streetType}`,
    city: f.helpers.arrayElement(UK_CITIES),
    state: f.helpers.arrayElement(UK_COUNTIES),
    zipCode: randomUkPostcode(f),
    phoneNumber: randomUkPhone(f),
  };
}

function generateCanada() {
  const f = caFaker;
  const province = f.helpers.arrayElement(CA_PROVINCES);
  const cities = CA_CITIES_BY_PROVINCE[province.code] || ['Toronto'];
  return {
    country: 'CA',
    fullName: f.person.fullName(),
    streetAddress: `${f.number.int({ min: 10, max: 9999 })} ${f.person.lastName()} ${f.helpers.arrayElement(['St', 'Ave', 'Blvd', 'Rd', 'Dr', 'Way'])}`,
    city: f.helpers.arrayElement(cities),
    state: `${province.name} (${province.code})`,
    zipCode: randomCaPostalCode(f),
    phoneNumber: randomCaPhone(f),
  };
}

function generateAustralia() {
  const f = auFaker;
  const state = f.helpers.arrayElement(AU_STATES);
  const cities = AU_CITIES_BY_STATE[state.code] || ['Sydney'];
  const postcode = pad(f.number.int({ min: 200, max: 9999 }), 4);
  return {
    country: 'AU',
    fullName: f.person.fullName(),
    streetAddress: `${f.number.int({ min: 1, max: 500 })} ${f.person.lastName()} ${f.helpers.arrayElement(['Street', 'Road', 'Avenue', 'Crescent', 'Drive', 'Lane', 'Parade'])}`,
    city: f.helpers.arrayElement(cities),
    state: `${state.name} (${state.code})`,
    zipCode: postcode,
    phoneNumber: randomAuPhone(f),
  };
}

function generateAddress(countryCode) {
  switch (countryCode) {
    case 'USA': return generateUsa();
    case 'UK': return generateUk();
    case 'CA': return generateCanada();
    case 'AU': return generateAustralia();
    default:
      throw new Error(`Unsupported country code: ${countryCode}`);
  }
}

module.exports = {
  SUPPORTED_COUNTRIES,
  generateAddress,
};
