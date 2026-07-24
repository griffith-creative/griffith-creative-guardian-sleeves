// Shopify Storefront API client.
// Uses the Cart API (the Checkout API was removed April 2025): create a cart
// with a line, then hand off to Shopify's hosted checkout via cart.checkoutUrl.
// Works in the browser - the Storefront access token is public by design.

import {
  SHOPIFY_DOMAIN,
  SHOPIFY_API_VERSION,
  SHOPIFY_STOREFRONT_TOKEN,
} from '../consts';

const ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export function isConfigured() {
  return !!SHOPIFY_STOREFRONT_TOKEN && !SHOPIFY_STOREFRONT_TOKEN.includes('REPLACE_ME');
}

export async function storefront(query, variables = {}) {
  if (!isConfigured()) throw new Error('Shopify Storefront token not configured');

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`Storefront API HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data;
}

const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      title
      descriptionHtml
      variants(first: 30) {
        nodes {
          id
          availableForSale
          price { amount currencyCode }
          selectedOptions { name value }
        }
      }
    }
  }
`;

// Fetches the single Guardian product and returns its variants indexed by the
// "Color" option value, so a PDP can resolve its color to a live variant:
//   { descriptionHtml, variants: [{ color, variantId, price, currency, available }] }
// Returns null on any failure (callers fall back to the baked-in catalog data).
export async function getVariants(handle) {
  try {
    const data = await storefront(PRODUCT_QUERY, { handle });
    const p = data?.product;
    if (!p) return null;
    const variants = (p.variants?.nodes || []).map((v) => ({
      color: v.selectedOptions?.find((o) => o.name === 'Color')?.value ?? null,
      variantId: v.id,
      price: v.price.amount,
      currency: v.price.currencyCode,
      available: v.availableForSale,
    }));
    return { descriptionHtml: p.descriptionHtml, variants };
  } catch {
    return null;
  }
}

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { field message }
    }
  }
`;

// Creates a cart with the given variant and returns the hosted checkout URL.
// Throws on failure so callers can surface a real error (never a silent fail).
export async function createCheckout(variantId, quantity = 1) {
  const data = await storefront(CART_CREATE, {
    lines: [{ merchandiseId: variantId, quantity }],
  });
  const result = data?.cartCreate;
  if (result?.userErrors?.length) {
    throw new Error(result.userErrors.map((e) => e.message).join('; '));
  }
  const url = result?.cart?.checkoutUrl;
  if (!url) throw new Error('No checkout URL returned');
  return url;
}
