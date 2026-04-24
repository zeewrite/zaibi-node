(function () {
  'use strict';

  const form = document.getElementById('generator-form');
  const countrySelect = document.getElementById('country');
  const countInput = document.getElementById('count');
  const generateBtn = document.getElementById('generate-btn');
  const statusEl = document.getElementById('status');
  const resultsEl = document.getElementById('results');
  const template = document.getElementById('address-card-template');
  const themeToggle = document.getElementById('theme-toggle');

  const THEME_KEY = 'rag-theme';
  const PREFERS_DARK = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = themeToggle.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '\u2600' : '\u263D';
    }
    themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
    );
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const theme = saved || (PREFERS_DARK ? 'dark' : 'light');
    applyTheme(theme);
  }

  themeToggle.addEventListener('click', function () {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  initTheme();

  function setStatus(message, isError) {
    statusEl.textContent = message || '';
    statusEl.classList.toggle('error', Boolean(isError));
  }

  function clearResults() {
    resultsEl.replaceChildren();
  }

  function formatAddressText(addr) {
    return [
      addr.fullName,
      addr.streetAddress,
      addr.city + ', ' + addr.state + ' ' + addr.zipCode,
      addr.phoneNumber,
    ].join('\n');
  }

  function renderAddress(addr, countryLabel) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector('.card-badge').textContent = countryLabel;
    const fields = ['fullName', 'streetAddress', 'city', 'state', 'zipCode', 'phoneNumber'];
    fields.forEach(function (field) {
      const el = node.querySelector('[data-field="' + field + '"]');
      if (el) {
        el.textContent = addr[field];
      }
    });

    const copyBtn = node.querySelector('.copy-button');
    copyBtn.addEventListener('click', async function () {
      const text = formatAddressText(addr);
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          fallbackCopy(text);
        }
        copyBtn.classList.add('copied');
        copyBtn.querySelector('.copy-label').textContent = 'Copied!';
        setTimeout(function () {
          copyBtn.classList.remove('copied');
          copyBtn.querySelector('.copy-label').textContent = 'Copy';
        }, 1500);
      } catch (err) {
        copyBtn.querySelector('.copy-label').textContent = 'Failed';
        setTimeout(function () {
          copyBtn.querySelector('.copy-label').textContent = 'Copy';
        }, 1500);
      }
    });

    return node;
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  async function generate(event) {
    event.preventDefault();

    const country = countrySelect.value;
    const countRaw = parseInt(countInput.value, 10);
    const count = Number.isFinite(countRaw) ? countRaw : 1;

    if (count < 1 || count > 50) {
      setStatus('Count must be between 1 and 50.', true);
      return;
    }

    generateBtn.disabled = true;
    setStatus('Generating...');

    try {
      const url = '/generate-address?country=' + encodeURIComponent(country)
        + '&count=' + encodeURIComponent(String(count));
      const res = await fetch(url);
      const payload = await res.json().catch(function () { return null; });

      if (!res.ok) {
        const msg = (payload && payload.message) || 'Request failed with status ' + res.status;
        setStatus(msg, true);
        return;
      }

      if (!payload || !Array.isArray(payload.addresses)) {
        setStatus('Unexpected response from server.', true);
        return;
      }

      clearResults();
      const label = payload.countryName + ' (' + payload.country + ')';
      payload.addresses.forEach(function (addr) {
        resultsEl.appendChild(renderAddress(addr, label));
      });
      setStatus(
        'Generated ' + payload.count + ' address' + (payload.count === 1 ? '' : 'es') + '.',
      );
    } catch (err) {
      console.error(err);
      setStatus('Network error: ' + (err && err.message ? err.message : 'unknown'), true);
    } finally {
      generateBtn.disabled = false;
    }
  }

  form.addEventListener('submit', generate);
})();
