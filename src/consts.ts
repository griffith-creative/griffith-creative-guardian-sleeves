// ─── Form submission endpoint (Formspree) ───
// Public by design. Create a form at https://formspree.io targeting the
// store inbox (e.g. hello@guardiansleeves.com) and paste its endpoint below.
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';

// ─── Shopify Storefront API ───
// The Storefront access token is PUBLIC by design (it ships in browser code).
// Generate it in Shopify admin: Settings → Apps → Develop apps → your app →
// Storefront API → Install → copy the "Storefront API access token".
export const SHOPIFY_DOMAIN = 'guardiansleeves.com';
export const SHOPIFY_API_VERSION = '2026-01';
export const SHOPIFY_STOREFRONT_TOKEN = 'b8367d54e68f8ad30ad0e816b09187dc';

// The store sells ONE Shopify product ("Guardian Sleeves") with a single
// "Color" option — every colorway is a variant of it, not its own product.
// data/products.ts maps each color to its variant id; the PDP refreshes price
// and availability live from Shopify so admin edits reflect without a redeploy.
export const PRODUCT_HANDLE = 'guardian-sleeves-black';
export const PRODUCT_OPTION_NAME = 'Color';
