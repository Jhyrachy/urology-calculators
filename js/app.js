/**
 * app.js — PWA router + calculator registry
 * ===========================================
 * Each calculator is a plain JS module that exports:
 *   { id, name, category, tags, description, inputs[], calculate(), refs[] }
 *
 * Adding a new calculator? Just create a new file in js/calculators/
 * and import it below. That's it.
 */

// ---- Import all calculators ----
import * as psaDt       from './calculators/psa-doubling-time.js';
import * as briganti    from './calculators/briganti.js';
import * as gandaglia   from './calculators/gandaglia.js';
import * as espl        from './calculators/epsi.js';
import * as phi         from './calculators/phi.js';
import * as cpsa        from './calculators/cpsa.js';
import * as psaDensity  from './calculators/psa-density.js';
import * as psaVelocity from './calculators/psa-velocity.js';
import * as nlr         from './calculators/nlr.js';
import * as plr         from './calculators/plr.js';
import * as pni         from './calculators/pni.js';
import * as capsra      from './calculators/capsra.js';
import * as fpsa        from './calculators/fpsa.js';
import * as egfr        from './calculators/egfr.js';
import * as renalNeph   from './calculators/renal-nephrometry.js';
import * as nmibc       from './calculators/nmibc-risk.js';

const CALCULATORS = [psaDt, briganti, gandaglia, espl, phi, cpsa, psaDensity, psaVelocity, nlr, plr, pni, capsra, fpsa, egfr, renalNeph, nmibc];

// ---- PWA init ----
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// ---- DOM refs ----
const appEl      = document.getElementById('app');
const detailEl  = document.getElementById('calc-detail');
const searchEl  = document.getElementById('search');

// ---- Render home (card grid) ----
function renderHome(filter = '') {
  appEl.classList.remove('hidden');
  detailEl.classList.add('hidden');
  detailEl.innerHTML = '';

  const q = filter.toLowerCase().trim();
  const filtered = q
    ? CALCULATORS.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q)
      )
    : CALCULATORS;

  appEl.innerHTML = filtered.length
    ? filtered.map(c => `
      <article class="card" role="button" tabindex="0"
               aria-label="Open ${c.name}"
               onclick="window._openCalc('${c.id}')"
               onkeydown="event.key==='Enter'&&window._openCalc('${c.id}')">
        <span class="card-category">${c.category}</span>
        <h2>${c.name}</h2>
        <p>${c.description}</p>
        <div class="card-tags">
          ${c.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </article>`).join('')
    : '<p class="no-results">No calculators match your search.</p>';
}

// ---- Render calculator detail ----
function renderDetail(id) {
  const c = CALCULATORS.find(x => x.id === id);
  if (!c) return;

  appEl.classList.add('hidden');
  detailEl.classList.remove('hidden');

  // Build inputs HTML
  const inputsHtml = c.inputs.map(inp => {
    if (inp.type === 'select') {
      const opts = inp.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
      return `<div class="form-group">
        <label for="inp-${inp.id}">${inp.label}</label>
        <select id="inp-${inp.id}" data-id="${inp.id}">${opts}</select>
      </div>`;
    }
    return `<div class="form-group">
      <label for="inp-${inp.id}">${inp.label}</label>
      <input type="number" id="inp-${inp.id}" data-id="${inp.id}"
             placeholder="${inp.placeholder || ''}" step="any">
    </div>`;
  }).join('');

  detailEl.innerHTML = `
    <button class="back-btn" onclick="window._back()">← Back</button>
    <div class="calc-header">
      <p class="category">${c.category}</p>
      <h2>${c.name}</h2>
    </div>

    <div class="info-box" style="margin-bottom:1rem;">
      <p>${c.description}</p>
    </div>

    <div id="calc-form">
      ${inputsHtml}
      <button class="calc-btn" id="calc-run">Calculate</button>
    </div>

    <div id="calc-result"></div>

    <div class="info-section">
      <div class="info-box">
        <h3>📐 Formula</h3>
        <div class="formula-block">${c.formula}</div>
      </div>
      <div class="info-box">
        <h3>📖 How to use</h3>
        <p>${c.howToUse}</p>
      </div>
      <div class="info-box">
        <h3>📚 References</h3>
        <ul>${c.refs.map(r => `<li><a href="${r.url}" target="_blank" rel="noopener">${r.text}</a></li>`).join('')}</ul>
      </div>
    </div>
  `;

  // Wire up calculate button
  document.getElementById('calc-run').addEventListener('click', () => {
    const vals = {};
    let ok = true;
    for (const inp of c.inputs) {
      const el = document.getElementById('inp-' + inp.id);
      if (inp.type === 'select') {
        vals[inp.id] = el.value;
      } else {
        const v = parseFloat(el.value);
        if (isNaN(v)) { ok = false; el.style.borderColor = 'var(--danger)'; }
        else { vals[inp.id] = v; el.style.borderColor = ''; }
      }
    }
    if (!ok) {
      document.getElementById('calc-result').innerHTML =
        '<div class="result-box danger"><div class="result-label">Error</div><div class="result-value">Fill in all fields</div></div>';
      return;
    }
    try {
      const result = c.calculate(vals);
      document.getElementById('calc-result').innerHTML = c.renderResult(result);
    } catch (e) {
      document.getElementById('calc-result').innerHTML =
        `<div class="result-box danger"><div class="result-label">Error</div><div class="result-value">${e.message}</div></div>`;
    }
  });
}

// ---- Expose globals for onclick handlers ----
window._openCalc = (id) => {
  history.pushState({ calc: id }, '', `#${id}`);
  renderDetail(id);
  window.scrollTo(0, 0);
};
window._back = () => {
  history.pushState({}, '', '/');
  renderHome(searchEl.value);
  window.scrollTo(0, 0);
};

// ---- Router: handle browser back/forward + direct links ----
window.addEventListener('popstate', (e) => {
  if (e.state?.calc) renderDetail(e.state.calc);
  else renderHome(searchEl.value);
});

// Handle direct links (e.g. https://.../#briganti)
if (location.hash) {
  const id = location.hash.slice(1);
  renderDetail(id);
} else {
  renderHome();
}

// ---- Search ----
searchEl.addEventListener('input', (e) => renderHome(e.target.value));
