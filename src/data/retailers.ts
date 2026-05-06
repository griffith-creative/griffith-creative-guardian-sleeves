/**
 * Placeholder retailer data for the Find Us page.
 *
 * Production swap: query Shopify Metaobjects (`retailer` definition) via
 * Storefront API at build time, returning the same shape as this array.
 *
 * The Mapbox token used on the map is read from `import.meta.env.PUBLIC_MAPBOX_TOKEN`.
 * That token is a development-only key — rotate it and add URL restrictions in
 * the Mapbox dashboard before public launch.
 */

export type Retailer = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
  url?: string;
  phone?: string;
};

export const retailers: Retailer[] = [
  {
    id: 'rwt-collective',
    name: 'RWT Collective',
    address: '11301 W Olympic Blvd #201',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90064',
    lat: 34.0383929,
    lng: -118.4421933,
  },
  {
    id: 'next-gen-games',
    name: 'Next-Gen Games',
    address: '5450 W Pico Blvd Unit 103',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90019',
    lat: 34.0485345,
    lng: -118.3574717,
  },
  {
    id: 'lucky-vault',
    name: 'Lucky Vault',
    address: '5170 Santa Monica Blvd',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90029',
    lat: 34.0905518,
    lng: -118.3026823,
  },
  {
    id: 'turn-zero-games',
    name: 'Turn Zero Games',
    address: '3959 Wilshire Blvd Ste A-9',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90010',
    lat: 34.0621008,
    lng: -118.3135865,
  },
  {
    id: 'grail-and-grade',
    name: 'Grail and Grade',
    address: '2180 Westwood Blvd Ste 1M',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90025',
    lat: 34.044543,
    lng: -118.4318335,
  },
  {
    id: 'lvlup-gaming-tcg',
    name: 'LVLUP GAMING TCG',
    address: '1356 E 41st St Ste A',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90011',
    lat: 34.0087307,
    lng: -118.2501497,
  },
  {
    id: 'its-gametime',
    name: "It's GameTime!",
    address: '3301 Motor Ave',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90034',
    lat: 34.0290241,
    lng: -118.4107888,
  },
  {
    id: 'otaku-vault',
    name: 'Otaku Vault',
    address: '330 E 2nd St Unit 201',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90012',
    lat: 34.0486445,
    lng: -118.241025,
  },
  {
    id: 'phantom-cards',
    name: 'Phantom Cards & Collectibles',
    address: '232 E 2nd St F',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90012',
    lat: 34.049037,
    lng: -118.242155,
  },
  {
    id: 'collector-legion',
    name: 'Collector Legion',
    address: '4451 Redondo Beach Blvd',
    city: 'Lawndale',
    state: 'CA',
    postalCode: '90260',
    lat: 33.8733834,
    lng: -118.3542532,
  },
];
