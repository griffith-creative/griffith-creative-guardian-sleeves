// Shared AJAX form handler for Formspree-backed forms.
// Keeps the user on the branded site and surfaces real success/failure
// (never a silent failure) via the [data-form-status] element.

export function initAjaxForm(formId, successMessage) {
  const form = document.getElementById(formId);
  if (!form || form.dataset.bound) return;
  form.dataset.bound = 'true';

  const status = form.querySelector('[data-form-status]');
  const button = form.querySelector('button[type="submit"]');
  const endpoint = form.dataset.endpoint;

  const setStatus = (msg, ok) => {
    if (!status) return;
    status.textContent = msg;
    status.classList.remove('hidden');
    status.style.color = ok ? 'var(--success)' : 'var(--warning)';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!endpoint || endpoint.includes('REPLACE_ME')) {
      setStatus('Form is not configured yet. Please email us directly for now.', false);
      return;
    }

    const originalLabel = button ? button.textContent : '';
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending…';
    }
    setStatus('', true);
    if (status) status.classList.add('hidden');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.reset();
        setStatus(successMessage, true);
      } else {
        let detail = '';
        try {
          const data = await res.json();
          detail = data?.errors?.map((x) => x.message).join(' ') || '';
        } catch {}
        setStatus(detail || 'Something went wrong sending your message. Please try again or email us directly.', false);
      }
    } catch {
      setStatus('Network error — please check your connection and try again.', false);
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    }
  });
}
