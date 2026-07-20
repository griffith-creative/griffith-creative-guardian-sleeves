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

// The product this site sells, by Shopify handle.
export const GUARDIAN_BLACK_HANDLE = 'guardian-sleeves-black';

// Fallback product data - rendered instantly for SEO / no-JS, then refreshed
// live from Shopify on the client so Shopify admin edits reflect on the site.
export const GUARDIAN_BLACK_FALLBACK = {
  title: 'Guardian Sleeves Black',
  price: '10.99',
  currency: 'USD',
  available: true,
  variantId: 'gid://shopify/ProductVariant/51129415565607',
};
