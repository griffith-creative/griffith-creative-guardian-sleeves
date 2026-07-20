// PDP behavior: refresh price/availability live from Shopify (so admin edits
// reflect without a redeploy) and drive the Buy button through the Cart API.
import { getProduct, createCheckout, isConfigured } from '../lib/shopify.js';

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
  const handle = buy.dataset.handle;

  // ─── Quantity stepper ───
  const qtyInput = document.getElementById('qty');
  const QTY_MIN = 1;
  const QTY_MAX = 99;
  const readQty = () => {
    const n = parseInt(qtyInput?.value, 10);
    return Math.min(QTY_MAX, Math.max(QTY_MIN, Number.isNaN(n) ? QTY_MIN : n));
  };
  const setQty = (n) => {
    if (qtyInput) qtyInput.value = String(Math.min(QTY_MAX, Math.max(QTY_MIN, n)));
  };
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

  // Refresh live product data (price, availability, current variant id).
  if (isConfigured() && handle) {
    getProduct(handle).then((p) => {
      if (!p) return;
      buy.dataset.variantId = p.variantId;
      if (priceEl) {
        const formatted = formatPrice(p.price, p.currency);
        if (formatted) priceEl.textContent = formatted;
      }
      if (!p.available) setSoldOut();
    });
  }

  buy.addEventListener('click', async () => {
    if (buy.disabled) return;

    if (!isConfigured()) {
      setStatus('Checkout is being set up. Please check back shortly.', false);
      return;
    }

    const variantId = buy.dataset.variantId;
    const label = buy.textContent;
    buy.disabled = true;
    buy.textContent = 'Loading…';
    setStatus('', true);

    try {
      const url = await createCheckout(variantId, readQty());
      window.location.href = url;
    } catch (err) {
      buy.disabled = false;
      buy.textContent = label;
      setStatus('Could not start checkout. Please try again in a moment.', false);
      console.error('Checkout error:', err);
    }
  });
}

initPDP();
document.addEventListener('astro:after-swap', initPDP);
