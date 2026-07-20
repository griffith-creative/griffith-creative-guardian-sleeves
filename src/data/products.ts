// Guardian Sleeves colorway catalog.
// `live` marks colorways that exist as Shopify products today. Coming-soon
// colorways still carry their expected handle - the PDP probes it on load and
// enables Add to Cart automatically once the product appears in Shopify,
// no redeploy needed. When Zachary adds a color, verify the handle matches.
import { GUARDIAN_BLACK_HANDLE, GUARDIAN_BLACK_FALLBACK } from '../consts';

export interface Colorway {
  slug: string; // URL segment under /products/
  name: string; // display name
  colorName: string; // short color label for the selector
  swatch: string; // hex for swatch dots / selector
  handle: string; // Shopify product handle (expected, for coming-soon colors)
  live: boolean; // product exists in Shopify and is buyable
  price: string; // fallback price, rendered for SEO/no-JS then refreshed live
  variantId?: string; // fallback variant id (live products only)
}

export const COLORWAYS: Colorway[] = [
  {
    slug: 'guardian-black',
    name: 'Guardian Black',
    colorName: 'Black',
    swatch: '#0A0A0A',
    handle: GUARDIAN_BLACK_HANDLE,
    live: true,
    price: GUARDIAN_BLACK_FALLBACK.price,
    variantId: GUARDIAN_BLACK_FALLBACK.variantId,
  },
  { slug: 'guardian-white', name: 'Guardian White', colorName: 'White', swatch: '#EDEDEB', handle: 'guardian-sleeves-white', live: false, price: GUARDIAN_BLACK_FALLBACK.price },
  { slug: 'guardian-red', name: 'Guardian Red', colorName: 'Red', swatch: '#8F1D1F', handle: 'guardian-sleeves-red', live: false, price: GUARDIAN_BLACK_FALLBACK.price },
  { slug: 'guardian-orange', name: 'Guardian Orange', colorName: 'Orange', swatch: '#C24A2A', handle: 'guardian-sleeves-orange', live: false, price: GUARDIAN_BLACK_FALLBACK.price },
  { slug: 'guardian-pink', name: 'Guardian Pink', colorName: 'Pink', swatch: '#D48F9D', handle: 'guardian-sleeves-pink', live: false, price: GUARDIAN_BLACK_FALLBACK.price },
  { slug: 'guardian-magenta', name: 'Guardian Magenta', colorName: 'Magenta', swatch: '#9B7FB8', handle: 'guardian-sleeves-magenta', live: false, price: GUARDIAN_BLACK_FALLBACK.price },
  { slug: 'guardian-purple', name: 'Guardian Purple', colorName: 'Purple', swatch: '#6B5BA8', handle: 'guardian-sleeves-purple', live: false, price: GUARDIAN_BLACK_FALLBACK.price },
  { slug: 'guardian-blue', name: 'Guardian Blue', colorName: 'Blue', swatch: '#2F3E8F', handle: 'guardian-sleeves-blue', live: false, price: GUARDIAN_BLACK_FALLBACK.price },
  { slug: 'guardian-light-blue', name: 'Guardian Light Blue', colorName: 'Light Blue', swatch: '#8FA9D6', handle: 'guardian-sleeves-light-blue', live: false, price: GUARDIAN_BLACK_FALLBACK.price },
  { slug: 'guardian-teal', name: 'Guardian Teal', colorName: 'Teal', swatch: '#3FA69E', handle: 'guardian-sleeves-teal', live: false, price: GUARDIAN_BLACK_FALLBACK.price },
  { slug: 'guardian-green', name: 'Guardian Green', colorName: 'Green', swatch: '#3C7D52', handle: 'guardian-sleeves-green', live: false, price: GUARDIAN_BLACK_FALLBACK.price },
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
