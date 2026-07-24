// PDP behavior: refresh price/availability live from Shopify (so admin edits
// reflect without a redeploy) and drive the Buy button through the Cart API.
import { getVariants, isConfigured } from '../lib/shopify.js';
import { addToCart } from '../lib/cart.js';

function formatPrice(amount, currency) {
  const n = Number(amount);
  if (Number.isNaN(n)) return null;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

function initPDP() {
  const buy = document.getElementById('buy-now');
  if (!buy || buy.dataset.bound) return;
  buy.dataset.bound = 'true';

  const priceEl = document.getElementById('pdp-price');
  const statusEl = document.getElementById('pdp-status');
  const descEl = document.getElementById('pdp-description');
  const handle = buy.dataset.handle;
  const colorValue = buy.dataset.option;

  // ─── Quantity stepper ───
  const qtyInput = document.getElementById('qty');
  const QTY_MIN = 1;
  const QTY_MAX = 99;
  const readQty = () => {
    const n = parseInt(qtyInput?.value, 10);
    return Math.min(QTY_MAX, Math.max(QTY_MIN, Number.isNaN(n) ? QTY_MIN : n));
  };
  // Persist quantity across color switches (each color is its own page, so a
  // full nav would otherwise reset it to 1). Session-scoped.
  const QTY_KEY = 'guardian_qty';
  const setQty = (n) => {
    const clamped = Math.min(QTY_MAX, Math.max(QTY_MIN, n));
    if (qtyInput) qtyInput.value = String(clamped);
    try { sessionStorage.setItem(QTY_KEY, String(clamped)); } catch {}
  };
  try {
    const saved = parseInt(sessionStorage.getItem(QTY_KEY), 10);
    if (!Number.isNaN(saved)) setQty(saved);
  } catch {}
  document.getElementById('qty-minus')?.addEventListener('click', () => setQty(readQty() - 1));
  document.getElementById('qty-plus')?.addEventListener('click', () => setQty(readQty() + 1));
  qtyInput?.addEventListener('change', () => setQty(readQty()));

  const setStatus = (msg, ok) => {
    if (!statusEl) return;
    if (!msg) {
      statusEl.classList.add('hidden');
      return;
    }
    statusEl.textContent = msg;
    statusEl.classList.remove('hidden');
    statusEl.style.color = ok ? 'var(--success)' : 'var(--warning)';
  };

  const setSoldOut = () => {
    buy.disabled = true;
    buy.textContent = 'Sold Out';
  };

  // Refresh live data for this color's variant (price, availability, variant id)
  // so Shopify admin edits reflect without a redeploy.
  if (isConfigured() && handle && colorValue) {
    getVariants(handle).then((p) => {
      if (!p) return;
      const v = p.variants.find((x) => x.color === colorValue);
      if (!v) return;
      buy.dataset.variantId = v.variantId;
      if (priceEl) {
        const formatted = formatPrice(v.price, v.currency);
        if (formatted) priceEl.textContent = formatted;
      }
      // NB: intentionally do NOT overwrite the description here. The PDP renders
      // tailored per-color copy; the single generic Shopify description would
      // clobber all 11 with the same text. Price/availability still refresh live.
      if (!v.available) setSoldOut();
    });
  }

  buy.addEventListener('click', async () => {
    if (buy.disabled) return;

    if (!isConfigured()) {
      setStatus('The store is being set up. Please check back shortly.', false);
      return;
    }

    const variantId = buy.dataset.variantId;
    const label = buy.textContent;
    buy.disabled = true;
    buy.textContent = 'Adding…';
    setStatus('', true);

    try {
      await addToCart(variantId, readQty());
      buy.disabled = false;
      buy.textContent = label;
      document.dispatchEvent(new CustomEvent('cart:open'));
    } catch (err) {
      buy.disabled = false;
      buy.textContent = label;
      setStatus('Could not add to cart. Please try again in a moment.', false);
      console.error('Add to cart error:', err);
    }
  });
}

initPDP();
document.addEventListener('astro:after-swap', initPDP);
