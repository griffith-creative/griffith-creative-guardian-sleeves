// Persistent cart on top of the Storefront Cart API.
// Cart id is kept in localStorage; the hosted checkout is reached via
// cart.checkoutUrl. Subscribers are notified on every change so the UI
// (drawer + nav badge) can re-render.

import { storefront, isConfigured } from './shopify.js';

const STORAGE_KEY = 'guardian_cart_id';
const listeners = new Set();
let current = null;

const CART_FIELDS = /* GraphQL */ `
  id
  checkoutUrl
  totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 50) {
    nodes {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id
          title
          image { url altText }
          price { amount currencyCode }
          product { title handle }
        }
      }
    }
  }
`;

const QUERY_CART = `query Cart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`;
const CREATE = `mutation Create($lines: [CartLineInput!]!) { cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { message } } }`;
const ADD = `mutation Add($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`;
const UPDATE = `mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } } }`;
const REMOVE = `mutation Remove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } } }`;

function getCartId() {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}
function setCartId(id) {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function emit(cart) {
  current = cart || null;
  listeners.forEach((fn) => fn(current));
}

function unwrap(result) {
  if (result?.userErrors?.length) throw new Error(result.userErrors.map((e) => e.message).join('; '));
  return result?.cart || null;
}

export function onCartChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export function getCurrent() {
  return current;
}

// Load the saved cart (if any). A null result means no cart or a stale one
// (e.g. checkout already completed) — we clear the id so a fresh cart is made.
export async function loadCart() {
  const id = getCartId();
  if (!id || !isConfigured()) { emit(null); return null; }
  try {
    const data = await storefront(QUERY_CART, { id });
    if (!data?.cart) { setCartId(null); emit(null); return null; }
    emit(data.cart);
    return data.cart;
  } catch {
    emit(current);
    return current;
  }
}

export async function addToCart(variantId, quantity = 1) {
  const id = getCartId();
  let cart;
  if (!id) {
    cart = unwrap((await storefront(CREATE, { lines: [{ merchandiseId: variantId, quantity }] })).cartCreate);
  } else {
    try {
      cart = unwrap((await storefront(ADD, { cartId: id, lines: [{ merchandiseId: variantId, quantity }] })).cartLinesAdd);
    } catch {
      // Saved cart is stale (completed/expired) — start a fresh one.
      setCartId(null);
      cart = unwrap((await storefront(CREATE, { lines: [{ merchandiseId: variantId, quantity }] })).cartCreate);
    }
  }
  if (!cart) throw new Error('Could not add to cart');
  setCartId(cart.id);
  emit(cart);
  return cart;
}

export async function setLineQuantity(lineId, quantity) {
  const id = getCartId();
  if (!id) return null;
  if (quantity <= 0) return removeLine(lineId);
  const cart = unwrap((await storefront(UPDATE, { cartId: id, lines: [{ id: lineId, quantity }] })).cartLinesUpdate);
  setCartId(cart?.id || null);
  emit(cart);
  return cart;
}

export async function removeLine(lineId) {
  const id = getCartId();
  if (!id) return null;
  const cart = unwrap((await storefront(REMOVE, { cartId: id, lineIds: [lineId] })).cartLinesRemove);
  setCartId(cart?.id || null);
  emit(cart);
  return cart;
}
