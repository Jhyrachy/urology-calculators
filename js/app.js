/**
 * app.js — PWA router + calculator registry
 * Calculator modules export: { meta, calculate, interpret }
 *   meta.id, meta.name, meta.category, meta.inputs, meta.outputs,
 *   meta.references, meta.disclaimer, meta.isDIY, meta.isCommercial, meta.formula
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

const TOPICS = [
  {
    id: 'prostate-risk', name: 'Prostate Cancer — Risk Stratification', icon: '🎗️',
    calcIds: ['eau-risk-groups', 'eau-bcr-risk', 'capra-s']
  },
  {
    id: 'prostate-kinetics', name: 'Prostate Cancer — PSA Kinetics', icon: '📈',
    calcIds: ['psa-doubling-time', 'psa-velocity']
  },
  {
    id: 'prostate-biomarkers', name: 'Prostate Cancer — Serum Biomarkers', icon: '🧪',
    calcIds: ['fpsa', 'phi', 'cpsa']
  },
  {
    id: 'prostate-nomograms', name: 'Prostate Cancer — Nomograms', icon: '📐',
    calcIds: ['erspc-risk-calculator', 'pcptrc-20', 'briganti', 'gandaglia']
  },
  {
    id: 'hematology', name: 'Biomarkers & Hematology', icon: '🩸',
    calcIds: ['nlr', 'plr', 'pni']
  },
  {
    id: 'bladder', name: 'Bladder Cancer', icon: '💧',
    calcIds: ['nmibc-risk', 'epsi']
  },
  {
    id: 'renal', name: 'Renal Cancer & Function', icon: '🫘',
    calcIds: ['renal-nephrometry', 'egfr', 'psa-density']
  },
];

const FORMULAS = {
  'eau-risk-groups': {
    text: 'Risk Group = f(ISUP Grade Group, PSA, cT stage)',
    vars: [
      { sym: 'Low Risk', desc: 'GG1 AND PSA<10 AND cT1-2' },
      { sym: 'Fav. Int.', desc: 'GG2 AND PSA<10 AND cT1-2' },
      { sym: 'Unfav. Int.', desc: 'GG2 AND PSA 10-20 AND cT1-2\nOR GG3 AND PSA<10 AND cT1-2' },
      { sym: 'High Risk', desc: 'GG3 AND PSA 10-20 AND cT1-2\nOR GG4-5 OR PSA>20' }
    ]
  },
  'eau-bcr-risk': {
    text: 'BCR Risk Group = f(PSA, ISUP GG, time to recurrence, surgical margins, nodal status)',
    vars: [
      { sym: 'Low', desc: 'PSA<0.5 AND time>18mo AND GG<4 AND SM- AND N0' },
      { sym: 'Intermediate', desc: 'Intermediate risk factors' },
      { sym: 'High', desc: 'PSA≥2.0 OR time<12mo OR GG≥4 OR SM+ OR N+' }
    ]
  },
  'capra-s': {
    text: 'CAPRA-S = psaPts(PSA) + pTPts(pT) + marginsPts + lniPts + ggPts(ISUP GG)',
    vars: [
      { sym: 'PSA pts', desc: '0.2-0.49→1 | 0.5-0.99→2 | 1.0-1.99→3 | 2.0-2.99→4 | ≥3.0→5' },
      { sym: 'pT pts', desc: 'pT2a→1 | pT2b→2 | pT3a→3 | pT3b/T4→4' },
      { sym: 'Margins', desc: 'Positive→1 | Negative→0' },
      { sym: 'LNI', desc: 'Yes→2 | No→0' },
      { sym: 'GG pts', desc: 'GG1→0 | GG2→1 | GG3→2 | GG4-5→3 (max)' },
      { sym: 'Score 0-10', desc: '≤1 Low | 2-3 Intermediate | 4-5 High | 6-10 Very High' }
    ]
  },
  'psa-doubling-time': {
    text: 'DT = (0.693 × Δt_years) / log₂(PSA₂/PSA₁)',
    vars: [
      { sym: 'PSA₁', desc: 'Initial PSA (ng/mL)' },
      { sym: 'PSA₂', desc: 'Follow-up PSA (ng/mL), must be > PSA₁' },
      { sym: 'Δt_years', desc: 'Time interval in years (days/365.25)' },
      { sym: 'DT', desc: 'Result in months. EAU 2026 thresholds: <9mo high-risk, 9-12mo moderate, >18mo low-risk BCR' }
    ]
  },
  'psa-velocity': {
    text: 'PSAV = (PSA₂ − PSA₁) / Δt_years',
    vars: [
      { sym: 'PSA₁', desc: 'Initial PSA (ng/mL)' },
      { sym: 'PSA₂', desc: 'Follow-up PSA (ng/mL)' },
      { sym: 'Δt_years', desc: 'Time interval in years' },
      { sym: 'PSAV', desc: 'EAU 2026: >2.0 ng/mL/yr pre-RP = worse outcomes; >0.75 on AS = investigate' }
    ]
  },
  'fpsa': {
    text: '%fPSA = (fPSA / tPSA) × 100',
    vars: [
      { sym: 'fPSA', desc: 'Free PSA (ng/mL)' },
      { sym: 'tPSA', desc: 'Total PSA (ng/mL)' },
      { sym: '%fPSA', desc: 'Percent free PSA. EAU 2026: <10% = high PCa risk; >25% = low risk (in grey zone 4-10 ng/mL)' }
    ]
  },
  'phi': {
    text: 'PHI = (p2PSA/tPSA) × fPSA × 1000  [Beckman Coulter Access assay]',
    vars: [
      { sym: 'p2PSA', desc: 'Pro2PSA (pg/mL)' },
      { sym: 'fPSA', desc: 'Free PSA (ng/mL)' },
      { sym: 'tPSA', desc: 'Total PSA (ng/mL)' },
      { sym: 'PHI', desc: 'Prostate Health Index. EAU 2026: >30-35 = high PCa risk; commercial assay required' }
    ]
  },
  'cpsa': {
    text: 'cPSA = tPSA − fPSA',
    vars: [
      { sym: 'tPSA', desc: 'Total PSA (ng/mL)' },
      { sym: 'fPSA', desc: 'Free PSA (ng/mL)' },
      { sym: 'cPSA', desc: 'Complexed PSA (ng/mL)' }
    ]
  },
  'nlr': {
    text: 'NLR = Neutrophils / Lymphocytes  (from CBC with differential)',
    vars: [
      { sym: 'Neutrophils', desc: 'Absolute neutrophil count (×10⁹/L or cells/µL)' },
      { sym: 'Lymphocytes', desc: 'Absolute lymphocyte count (×10⁹/L or cells/µL)' },
      { sym: 'NLR', desc: 'EAU 2026: NLR>3 = unfavourable prognosis in mCRPC; NLR>5 = worse outcomes' }
    ]
  },
  'plr': {
    text: 'PLR = Platelets / Lymphocytes  (from CBC)',
    vars: [
      { sym: 'Platelets', desc: 'Platelet count (×10⁹/L)' },
      { sym: 'Lymphocytes', desc: 'Absolute lymphocyte count (×10⁹/L)' },
      { sym: 'PLR', desc: 'PLR>150-200 associated with worse prognosis in several urological cancers' }
    ]
  },
  'pni': {
    text: 'PNI = Albumin (g/dL) + 5 × Lymphocytes (×10⁹/L)',
    vars: [
      { sym: 'Albumin', desc: 'Serum albumin (g/dL)' },
      { sym: 'Lymphocytes', desc: 'Absolute lymphocyte count (×10⁹/L)' },
      { sym: 'PNI', desc: 'Nutrition-Inflammation index. <40-45 = malnutrition; used in bladder/renal CA prognosis' }
    ]
  },
  'nmibc-risk': {
    text: 'NMIBC Risk Group = f(Ta/T1 grade, size, number, CIS, prior recurrence rate)',
    vars: [
      { sym: 'Low', desc: 'Ta G1-2, single, <3cm, no CIS' },
      { sym: 'Intermediate', desc: 'Ta/T1 G2, single or multiple, <3cm' },
      { sym: 'High', desc: 'T1 G3 OR Ta G3 OR multiple/recurrent/size>3cm OR CIS' }
    ]
  },
  'epsi': {
    text: 'EPSI = 0.04×age − 0.49×BMI − 0.27×Hb + 0.69×eGFR − 0.14×Proteinuria',
    vars: [
      { sym: 'age', desc: 'Years' },
      { sym: 'BMI', desc: 'Body mass index (kg/m²)' },
      { sym: 'Hb', desc: 'Haemoglobin (g/dL)' },
      { sym: 'eGFR', desc: 'Estimated GFR (mL/min/1.73m²)' },
      { sym: 'Proteinuria', desc: 'g/24h or mg/mg creatinine ratio' }
    ]
  },
  'renal-nephrometry': {
    text: 'R.E.N.A.L. = R + E + N + A + L (each 1-3 pts)',
    vars: [
      { sym: 'R', desc: 'Radius: tumour size ≤4cm→1 | 4-7cm→2 | >7cm→3' },
      { sym: 'E', desc: 'Exophytic: ≥50%→1 | <50%→2 | entirely endophytic→3' },
      { sym: 'N', desc: 'Nearness to renal sinus: >7mm→1 | 4-7mm→2 | <4mm→3' },
      { sym: 'A', desc: 'Anterior/Posterior: a/p→1 | neither→2' },
      { sym: 'L', desc: 'Location relative to polar lines: above/below→1 | crosses→2 | >50% above upper→3' },
      { sym: 'Score 4-10', desc: '4-6 = low complexity | 7-9 = moderate | 10-12 = high complexity' }
    ]
  },
  'egfr': {
    text: 'eGFR = 175 × (Scr/0.7)^−0.241 × age^−0.179 × 0.993^age × 1.212 [if female]  [CKD-EPI 2021]',
    vars: [
      { sym: 'Scr', desc: 'Serum creatinine (mg/dL)' },
      { sym: 'age', desc: 'Years' },
      { sym: 'female', desc: 'Multiply by 1.212 if female' },
      { sym: 'eGFR', desc: 'mL/min/1.73m². CKD-EPI 2021 formula. Use race-free equation.' }
    ]
  },
  'psa-density': {
    text: 'PSAD = PSA / Prostate Volume',
    vars: [
      { sym: 'PSA', desc: 'Total PSA (ng/mL)' },
      { sym: 'Volume', desc: 'Prostate volume (mL) from MRI or TRUS' },
      { sym: 'PSAD', desc: 'EAU 2026: PSAD>0.15 ng/mL/mL = elevated; triggers biopsy in AS' }
    ]
  }
};

// ---- PWA init ----
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// ---- DOM refs ----
const appEl    = document.getElementById('app');
const detailEl = document.getElementById('calc-detail');
const searchEl = document.getElementById('search');
const tabCalc  = document.getElementById('tab-btn-calc');
const tabFc    = document.getElementById('tab-btn-fc');
const panelCalc = document.getElementById('panel-calc');
const panelFc   = document.getElementById('panel-fc');

// ---- Active tab state ----
let activeTab = 'calc';

function setActiveTab(tab) {
  activeTab = tab;
  if (tab === 'calc') {
    tabCalc.classList.add('tab-active');
    tabFc.classList.remove('tab-active');
    panelCalc.classList.remove('hidden');
    panelFc.classList.add('hidden');
    renderHome(searchEl.value);
  } else {
    tabFc.classList.add('tab-active');
    tabCalc.classList.remove('tab-active');
    panelCalc.classList.add('hidden');
    panelFc.classList.remove('hidden');
    renderFlowchartsView(searchEl.value);
  }
}

tabCalc.addEventListener('click', () => setActiveTab('calc'));
tabFc.addEventListener('click', () => setActiveTab('fc'));

// ---- Helpers ----
function getTopicOfCalc(calcId) {
  return TOPICS.find(t => t.calcIds.includes(calcId));
}

function cardIcon(c) {
  if (c.meta.isDIY === false) return '🔒';
  if (c.meta.isCommercial) return '🧪';
  return '🧮';
}

function cardTags(c) {
  let tags = '';
  if (c.meta.isDIY === false) tags += '<span class="tag closed">NOT DIY</span>';
  else if (c.meta.isCommercial) tags += '<span class="tag commercial">Commercial</span>';
  else tags += '<span class="tag">DIY</span>';
  return tags;
}

// ---- Render topic section ----
function renderTopicSection(topic, calcs, q) {
  const filtered = q
    ? calcs.filter(c =>
        c.meta.name.toLowerCase().includes(q) ||
        c.meta.category.toLowerCase().includes(q) ||
        (c.meta.shortName || '').toLowerCase().includes(q)
      )
    : calcs;

  if (!filtered.length) return '';

  const cards = filtered.map(c => `
    <article class="card" role="button" tabindex="0"
             onclick="window._openCalc('${c.meta.id}')"
             onkeydown="event.key==='Enter'&&window._openCalc('${c.meta.id}')">
      <span class="card-category">${c.meta.category}</span>
      <h2>${c.meta.name}</h2>
      <p>${cardIcon(c)} ${c.meta.disclaimer || c.meta.outputs?.map(o=>o.label).join(', ') || 'Calculator'}</p>
      <div class="card-tags">${cardTags(c)}</div>
    </article>`).join('');

  return `
    <section class="topic-section">
      <div class="topic-header">
        <span class="topic-icon">${topic.icon}</span>
        <span class="topic-title">${topic.name}</span>
        <span class="topic-count">${filtered.length}</span>
      </div>
      <div class="topic-grid">${cards}</div>
    </section>`;
}

// ---- Render home (topic sections) ----
function renderHome(filter = '') {
  appEl.classList.remove('hidden');
  detailEl.classList.add('hidden');
  detailEl.innerHTML = '';

  const q = filter.toLowerCase().trim();
  const topicSections = TOPICS.map(topic => {
    const calcs = topic.calcIds
      .map(id => CALCULATORS.find(c => c.meta.id === id))
      .filter(Boolean);
    return renderTopicSection(topic, calcs, q);
  }).join('');

  appEl.innerHTML = topicSections || '<p class="no-results">No calculators match your search.</p>';
}

// ---- Render flowcharts view ----
function renderFlowchartsView(filter = '') {
  const q = filter.toLowerCase().trim();
  const filtered = q
    ? FLOWCHARTS.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.shortDesc.toLowerCase().includes(q)
      )
    : FLOWCHARTS;

  const fcTarget = panelFc.querySelector('main') || panelFc;
  fcTarget.innerHTML = filtered.length
    ? `<section class="topic-section">
        <div class="topic-header">
          <span class="topic-icon">📊</span>
          <span class="topic-title">Prostate Cancer — EAU 2026 Flowcharts</span>
          <span class="topic-count">${filtered.length}</span>
        </div>
        <div class="topic-grid">
          ${filtered.map(fc => `
            <article class="card" role="button" tabindex="0"
                     onclick="window._openFlowchart('${fc.id}')"
                     onkeydown="event.key==='Enter'&&window._openFlowchart('${fc.id}')">
              <span class="card-category">flowchart</span>
              <h2>${fc.name}</h2>
              <p>${fc.icon} ${fc.shortDesc}</p>
              <div class="card-tags"><span class="tag">EAU 2026</span></div>
            </article>`).join('')}
        </div>
      </section>`
    : '<p class="no-results">No flowcharts match your search.</p>';
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

// ---- Formula Transparency Banner ----
function renderFormulaBanner(calcId) {
  const formula = FORMULAS[calcId];
  if (!formula) return '';
  const varsHtml = formula.vars.map(v =>
    `<div class="formula-var-sym">${v.sym}</div><div class="formula-var-desc">${v.desc.replace(/\n/g, '<br>')}</div>`
  ).join('');
  return `
    <div class="formula-banner" id="formula-banner">
      <div class="formula-banner-header" onclick="window._toggleFormula()">
        <span class="formula-banner-icon">📐</span>
        <span class="formula-banner-title">Trasparenza Formale — Formula utilizzata</span>
        <span class="formula-banner-toggle" id="formula-toggle">▾</span>
      </div>
      <div class="formula-banner-body" id="formula-body">
        <div class="formula-main">${formula.text}</div>
        <div class="formula-variables">${varsHtml}</div>
      </div>
    </div>`;
}

window._toggleFormula = () => {
  const body = document.getElementById('formula-body');
  const toggle = document.getElementById('formula-toggle');
  const open = body.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.textContent = open ? '▴' : '▾';
};

// ---- Render calculator detail ----
function renderDetail(id) {
  const c = CALCULATORS.find(x => x.meta.id === id);
  if (!c) return;

  appEl.classList.add('hidden');
  document.getElementById('panel-fc').classList.add('hidden');
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

  const topic = getTopicOfCalc(c.meta.id);
  const topicLabel = topic ? topic.name : c.meta.category;

  detailEl.innerHTML = `
    <button class="back-btn" onclick="window._back()">← Back</button>
    <div class="calc-header">
      <p class="category">${topicLabel}</p>
      <h2>${c.meta.name}</h2>
    </div>

    ${c.meta.disclaimer ? `<div class="info-banner disclaimer">⚠️ ${c.meta.disclaimer}</div>` : ''}

    <div id="calc-form">
      ${inputsHtml}
      <button class="calc-btn" id="calc-run">Calculate</button>
    </div>

    <div id="calc-result"></div>
    <div id="calc-formula"></div>

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
      const isDIY = c.meta.isDIY !== false;
      document.getElementById('calc-formula').innerHTML = isDIY ? renderFormulaBanner(c.meta.id) : '';
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
  if (activeTab !== 'fc') {
    tabFc.classList.add('tab-active');
    tabCalc.classList.remove('tab-active');
    panelCalc.classList.add('hidden');
    panelFc.classList.remove('hidden');
    activeTab = 'fc';
  }
  detailEl.classList.remove('hidden');
  detailEl.innerHTML = '<div id="fc-container"></div>';
  fc.render(document.getElementById('fc-container'));
  history.pushState({ flowchart: id }, '', `#flowchart-${id}`);
  window.scrollTo(0, 0);
};

window._back = () => {
  if (history.length > 1) {
    history.back();
  } else {
    history.pushState({}, '', location.pathname);
    detailEl.classList.add('hidden');
    detailEl.innerHTML = '';
    setActiveTab(activeTab);
    window.scrollTo(0, 0);
  }
};

// ---- Router ----
window.addEventListener('popstate', (e) => {
  if (e.state?.calc) {
    renderDetail(e.state.calc);
  } else if (e.state?.flowchart) {
    detailEl.classList.remove('hidden');
    detailEl.innerHTML = '<div id="fc-container"></div>';
    const fc = FLOWCHARTS.find(f => f.id === e.state.flowchart);
    if (fc) fc.render(document.getElementById('fc-container'));
  } else {
    detailEl.classList.add('hidden');
    detailEl.innerHTML = '';
    setActiveTab(activeTab);
  }
});

// ---- Init ----
if (location.hash) {
  const hash = location.hash.slice(1);
  if (hash.startsWith('flowchart-')) {
    setActiveTab('fc');
    window._openFlowchart(hash.replace('flowchart-', ''));
  } else {
    setActiveTab('calc');
    renderDetail(hash);
  }
} else {
  setActiveTab('calc');
}

searchEl.addEventListener('input', (e) => {
  if (activeTab === 'calc') renderHome(e.target.value);
  else renderFlowchartsView(e.target.value);
});
