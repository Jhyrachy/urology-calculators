/**
 * app.js — PWA router + calculator registry
 * Calculator modules export: { meta, calculate, interpret }
 *   meta.id, meta.name, meta.category, meta.inputs, meta.outputs,
 *   meta.references, meta.disclaimer, meta.isDIY, meta.isCommercial
 */
import * as psaDt     from './calculators/psa-doubling-time.js';
import * as briganti  from './calculators/briganti.js';
import * as gandaglia from './calculators/gandaglia.js';
import * as espl      from './calculators/epsi.js';
import * as phi       from './calculators/phi.js';
import * as cpsa      from './calculators/cpsa.js';
import * as psaDens   from './calculators/psa-density.js';
import * as psaVel    from './calculators/psa-velocity.js';
import * as nlr       from './calculators/nlr.js';
import * as plr       from './calculators/plr.js';
import * as pni       from './calculators/pni.js';
import * as capraS   from './calculators/capra-s.js';
import * as fpsa      from './calculators/fpsa.js';
import * as egfr      from './calculators/egfr.js';
import * as renalNeph from './calculators/renal-nephrometry.js';
import * as nmibc     from './calculators/nmibc-risk.js';
import * as eauRisk   from './calculators/eau-risk-groups.js';
import * as eauBcr    from './calculators/eau-bcr-risk.js';
import * as erspc     from './calculators/erspc-risk-calculator.js';
import * as pcptrc    from './calculators/pcptrc-20.js';

import { render as renderScreening }   from './flowcharts/pc-screening.js';
import { render as renderAS }          from './flowcharts/pc-active-surveillance.js';
import { render as renderBCR }         from './flowcharts/pc-bcr-followup.js';
import { render as renderADT }         from './flowcharts/pc-adt-monitoring.js';

const FLOWCHARTS = [
  { id: 'pc-screening',    name: 'Screening PCa',        shortDesc: 'Screening e PSA opportunistic',     icon: '🔍', render: renderScreening },
  { id: 'pc-as',           name: 'Active Surveillance',  shortDesc: 'Criteri, protocollo e trigger',      icon: '👁',  render: renderAS          },
  { id: 'pc-bcr',          name: 'Follow-up post-RP/RT', shortDesc: 'BCR e monitoraggio post-trattamento', icon: '📉', render: renderBCR         },
  { id: 'pc-adt',          name: 'Monitoraggio ADT',      shortDesc: 'Follow-up durante terapia androgenica', icon: '💉', render: renderADT         },
];

const CALCULATORS = [
  psaDt, briganti, gandaglia, espl, phi, cpsa, psaDens, psaVel,
  nlr, plr, pni, capraS, fpsa, egfr, renalNeph, nmibc, eauRisk, eauBcr,
  erspc, pcptrc
];

// ---- PWA init ----
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// ---- DOM refs ----
const appEl    = document.getElementById('app');
const detailEl = document.getElementById('calc-detail');
const searchEl = document.getElementById('search');

// ---- Render home (card grid) ----
function renderHome(filter = '') {
  appEl.classList.remove('hidden');
  detailEl.classList.add('hidden');
  detailEl.innerHTML = '';

  const q = filter.toLowerCase().trim();
  const filtered = q
    ? CALCULATORS.filter(c =>
        c.meta.name.toLowerCase().includes(q) ||
        c.meta.category.toLowerCase().includes(q) ||
        c.meta.shortName.toLowerCase().includes(q)
      )
    : CALCULATORS;

  const fcHtml = FLOWCHARTS.length && !q ? `
    <section>
      <h3 class="section-title">📊 Flowchart — EAU 2026 Prostate Cancer</h3>
      <div class="flowcharts-grid">
        ${FLOWCHARTS.map(fc => `
          <div class="fc-card" role="button" tabindex="0"
               onclick="window._openFlowchart('${fc.id}')"
               onkeydown="event.key==='Enter'&&window._openFlowchart('${fc.id}')">
            <div class="fc-card-icon">${fc.icon}</div>
            <div class="fc-card-title">${fc.name}</div>
            <div class="fc-card-sub">${fc.shortDesc}</div>
            <span class="fc-card-badge">EAU 2026 · PCa</span>
          </div>
        `).join('')}
      </div>
    </section>
    <hr style="border-color:var(--border);margin:0.5rem 0">
  ` : '';

  appEl.innerHTML = fcHtml + (filtered.length
    ? filtered.map(c => `
      <article class="card" role="button" tabindex="0"
               onclick="window._openCalc('${c.meta.id}')"
               onkeydown="event.key==='Enter'&&window._openCalc('${c.meta.id}')">
        <span class="card-category">${c.meta.category}</span>
        <h2>${c.meta.name}</h2>
        <p>${c.meta.isDIY === false ? '🔒 ' : c.meta.isCommercial ? '🧪 ' : '🧮 '}${c.meta.disclaimer || c.meta.outputs?.map(o=>o.label).join(', ') || 'Calculator'}</p>
        ${c.meta.isDIY === false ? '<span class="tag closed">NOT DIY — formula closed</span>' : ''}
        ${c.meta.isCommercial ? '<span class="tag commercial">Commercial test</span>' : ''}
      </article>`).join('')
    : '<p class="no-results">No calculators match your search.</p>';
}

// ---- Render result (flexible) ----
function renderResultBox(result, calc) {
  if (!result || result.error) {
    return `<div class="result-box danger">
      <div class="result-label">Error</div>
      <div class="result-value">${result?.error || 'Invalid input'}</div>
    </div>`;
  }
  const outputs = calc.meta.outputs || [];
  const entries = Object.entries(result);
  if (entries.length === 1 && entries[0][0] === 'result') {
    return `<div class="result-box success">
      <div class="result-label">${calc.meta.outputs?.[0]?.label || 'Result'}</div>
      <div class="result-value">${entries[0][1]}</div>
      ${calc.interpret ? `<div class="result-note">${calc.interpret(entries[0][1])}</div>` : ''}
    </div>`;
  }
  const rows = entries.map(([k, v]) => {
    const label = outputs.find(o => o.id === k)?.label || k;
    return `<div class="result-row"><span class="result-label">${label}</span><span class="result-value">${v}</span></div>`;
  }).join('');
  return `<div class="result-box success">${rows}</div>`;
}

// ---- Render calculator detail ----
function renderDetail(id) {
  const c = CALCULATORS.find(x => x.meta.id === id);
  if (!c) return;

  appEl.classList.add('hidden');
  detailEl.classList.remove('hidden');

  const inputsHtml = c.meta.inputs.map(inp => {
    if (inp.type === 'select') {
      const opts = inp.options.map(o => `<option value="${o}">${o}</option>`).join('');
      return `<div class="form-group">
        <label for="inp-${inp.id}">${inp.label}</label>
        <select id="inp-${inp.id}" data-id="${inp.id}">${opts}</select>
      </div>`;
    }
    if (inp.type === 'checkbox') {
      return `<div class="form-group checkbox-group">
        <input type="checkbox" id="inp-${inp.id}" data-id="${inp.id}">
        <label for="inp-${inp.id}">${inp.label}</label>
      </div>`;
    }
    if (inp.type === 'info') {
      return `<div class="info-banner">${inp.value}</div>`;
    }
    return `<div class="form-group">
      <label for="inp-${inp.id}">${inp.label}</label>
      <input type="${inp.type || 'number'}" id="inp-${inp.id}" data-id="${inp.id}"
             placeholder="${inp.placeholder || ''}" step="any" min="${inp.min || 0}">
    </div>`;
  }).join('');

  const refs = c.meta.references || [];
  const refsHtml = refs.length
    ? refs.map(r => `<li>${r}</li>`).join('')
    : '<li>No external references</li>';

  detailEl.innerHTML = `
    <button class="back-btn" onclick="window._back()">← Back</button>
    <div class="calc-header">
      <p class="category">${c.meta.category}</p>
      <h2>${c.meta.name}</h2>
    </div>

    ${c.meta.disclaimer ? `<div class="info-banner disclaimer">⚠️ ${c.meta.disclaimer}</div>` : ''}

    <div id="calc-form">
      ${inputsHtml}
      <button class="calc-btn" id="calc-run">Calculate</button>
    </div>

    <div id="calc-result"></div>

    <div class="info-section">
      <div class="info-box">
        <h3>📚 References (EAU 2026)</h3>
        <ul>${refsHtml}</ul>
      </div>
      ${c.meta.isDIY === false ? `
      <div class="info-box warning">
        <h3>🔒 Not DIY</h3>
        <p>This tool requires a commercial laboratory assay or proprietary nomogram coefficients that cannot be reproduced here.</p>
        ${c.meta.outputs?.find(o => o.value && (o.value.startsWith('http') || o.label.toLowerCase().includes('resource'))) ? `<a class="ext-btn" href="${c.meta.outputs.find(o => o.value && (o.value.startsWith('http') || o.label.toLowerCase().includes('resource'))).value}" target="_blank" rel="noopener">Open official calculator ↗</a>` : ''}
      </div>` : ''}
    </div>
  `;

  document.getElementById('calc-run').addEventListener('click', () => {
    const vals = {};
    let ok = true;
    for (const inp of c.meta.inputs) {
      if (inp.type === 'info') continue;
      const el = document.getElementById('inp-' + inp.id);
      if (!el) continue;
      if (inp.type === 'checkbox') {
        vals[inp.id] = el.checked;
      } else if (inp.type === 'select') {
        vals[inp.id] = el.value;
      } else {
        const v = parseFloat(el.value);
        if (isNaN(v) && inp.required !== false) {
          ok = false; el.style.borderColor = 'var(--danger)';
        } else {
          vals[inp.id] = v;
          el.style.borderColor = '';
        }
      }
    }
    if (!ok) {
      document.getElementById('calc-result').innerHTML = `<div class="result-box danger"><div class="result-label">Error</div><div class="result-value">Fill in all required fields</div></div>`;
      return;
    }
    try {
      const result = c.calculate(vals);
      document.getElementById('calc-result').innerHTML = renderResultBox(result, c);
    } catch (e) {
      document.getElementById('calc-result').innerHTML = `<div class="result-box danger"><div class="result-label">Error</div><div class="result-value">${e.message}</div></div>`;
    }
  });
}

// ---- Expose globals ----
window._openCalc = (id) => {
  history.pushState({ calc: id }, '', `#${id}`);
  renderDetail(id);
  window.scrollTo(0, 0);
};
window._openFlowchart = (id) => {
  const fc = FLOWCHARTS.find(f => f.id === id);
  if (!fc) return;
  appEl.classList.add('hidden');
  detailEl.classList.remove('hidden');
  detailEl.innerHTML = '<div id="fc-container"></div>';
  fc.render(document.getElementById('fc-container'));
  history.pushState({ flowchart: id }, '', `#flowchart-' + id);
  window.scrollTo(0, 0);
};
window._back = () => {
  if (history.length > 1) {
    history.back();
  } else {
    history.pushState({}, '', '/');
    renderHome(searchEl.value);
    window.scrollTo(0, 0);
  }
};

// ---- Router ----
window.addEventListener('popstate', (e) => {
  if (e.state?.calc) renderDetail(e.state.calc);
  else if (e.state?.flowchart) {
    window._openFlowchart(e.state.flowchart);
  } else renderHome(searchEl.value);
});

if (location.hash) {
  const hash = location.hash.slice(1);
  if (hash.startsWith('flowchart-')) {
    window._openFlowchart(hash.replace('flowchart-', ''));
  } else {
    renderDetail(hash);
  }
} else {
  renderHome();
}

searchEl.addEventListener('input', (e) => renderHome(e.target.value));
