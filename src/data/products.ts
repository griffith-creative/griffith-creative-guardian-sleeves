// Guardian Sleeves colorway catalog.
// The store is a SINGLE Shopify product with a "Color" option (see consts.ts);
// each colorway below is one variant of it. `optionValue` must match the Color
// value in Shopify exactly — that string is how the PDP resolves the live
// variant (price/availability) on load. `variantId` is the fallback rendered
// for SEO/no-JS, then reconfirmed live. When Zachary adds a color in Shopify,
// add a row here with its exact Color value and variant id.
import { PRODUCT_HANDLE } from '../consts';

export { PRODUCT_HANDLE };

export interface Colorway {
  slug: string; // URL segment under /products/
  name: string; // display name
  colorName: string; // short color label for the selector
  optionValue: string; // exact Shopify "Color" option value for this variant
  swatch: string; // hex for swatch dots / selector (sampled from product photos)
  variantId: string; // Shopify variant id for Add to Cart
  price: string; // fallback price, rendered for SEO/no-JS then refreshed live
  live: boolean; // buyable (all colors are live variants today)
}

const V = (id: string) => `gid://shopify/ProductVariant/${id}`;

export const COLORWAYS: Colorway[] = [
  { slug: 'guardian-black',      name: 'Guardian Black',       colorName: 'Black',       optionValue: 'Black',       swatch: '#121313', variantId: V('51700666073383'), price: '10.99', live: true },
  { slug: 'guardian-white',      name: 'Guardian White',       colorName: 'White',       optionValue: 'White',       swatch: '#B2B1AF', variantId: V('51700666106151'), price: '10.99', live: true },
  { slug: 'guardian-red',        name: 'Guardian Red',         colorName: 'Red',         optionValue: 'Red',         swatch: '#7B4B4F', variantId: V('51700666138919'), price: '10.99', live: true },
  { slug: 'guardian-green',      name: 'Guardian Green',       colorName: 'Green',       optionValue: 'Green',       swatch: '#4B745A', variantId: V('51700666171687'), price: '10.99', live: true },
  { slug: 'guardian-blue',       name: 'Guardian Blue',        colorName: 'Blue',        optionValue: 'Blue',        swatch: '#373F71', variantId: V('51700666204455'), price: '10.99', live: true },
  { slug: 'guardian-orange',     name: 'Guardian Orange',      colorName: 'Orange',      optionValue: 'Orange',      swatch: '#D67262', variantId: V('51700666237223'), price: '10.99', live: true },
  { slug: 'guardian-purple',     name: 'Guardian Purple',      colorName: 'Purple',      optionValue: 'Purple',      swatch: '#665D91', variantId: V('51700666269991'), price: '10.99', live: true },
  { slug: 'guardian-pink',       name: 'Guardian Sakura Pink', colorName: 'Sakura Pink', optionValue: 'Sakura Pink', swatch: '#C8828D', variantId: V('51700666302759'), price: '10.99', live: true },
  { slug: 'guardian-light-blue', name: 'Guardian Lake Blue',   colorName: 'Lake Blue',   optionValue: 'Lake Blue',   swatch: '#8AA2D7', variantId: V('51700666335527'), price: '10.99', live: true },
  { slug: 'guardian-teal',       name: 'Guardian Mint',        colorName: 'Mint',        optionValue: 'Mint',        swatch: '#41857F', variantId: V('51700666368295'), price: '10.99', live: true },
  { slug: 'guardian-magenta',    name: 'Guardian Lilac',       colorName: 'Lilac',       optionValue: 'Lilac',       swatch: '#A98DCE', variantId: V('51700666401063'), price: '10.99', live: true },
];

// Product photos live at src/assets/images/products/<slug>/NN-<shot>.jpg and
// are globbed so adding a photo never requires touching code. Sorted by the
// numeric prefix: 01-front, 02-angle, 03-open.
const photoModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/products/*/*.{jpg,jpeg,png}',
  { eager: true }
);

export function photosFor(slug: string): ImageMetadata[] {
  return Object.keys(photoModules)
    .filter((path) => path.includes(`/products/${slug}/`))
    .sort()
    .map((path) => photoModules[path].default);
}

// Catalog card images: AI-cutout composites on a uniform studio backdrop
// (normalized box scale), separate from the authentic PDP gallery photos.
const cardModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/cards/*.{jpg,jpeg,png}',
  { eager: true }
);

export function cardFor(slug: string): ImageMetadata | undefined {
  const path = Object.keys(cardModules).find((p) => p.endsWith(`/${slug}.jpg`));
  return path ? cardModules[path].default : photosFor(slug)[0];
}
