/**
 * Flowchart: Prostate Cancer Screening
 * Source: EAU Guidelines 2026 — Sect. 5.1 "Individual early detection and screening"
 * URL: https://uroweb.org/guideline/prostate-cancer/#5
 */
export function render(container) {
  container.innerHTML = `
    <div class="fc-page">
      <div class="fc-header">
        <div class="fc-guideline-badge">EAU 2026 · Prostate Cancer · Sect. 5.1</div>
        <h2>Screening del Cancro Prostatico</h2>
        <p>Algoritmo di screening opportunistico individualizzato</p>
      </div>

      <div class="fc-flowchart" id="fc-screening">

        <!-- START -->
        <div class="fc-node fc-start" data-node="start">
          <div class="fc-node-icon">▶</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Uomo asintomatico</div>
            <div class="fc-node-sub">Richiede consulenza sullo screening</div>
          </div>
        </div>
        <div class="fc-arrow">↓</div>

        <!-- Life expectancy -->
        <div class="fc-node fc-decision" data-node="life-exp">
          <div class="fc-node-icon">◆</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Aspettativa di vita</div>
            <div class="fc-node-sub">&gt; 10–15 anni?</div>
          </div>
        </div>

        <!-- NO branch -->
        <div class="fc-branch">
          <div class="fc-branch-label fc-no">NO</div>
          <div class="fc-arrow">↓</div>
          <div class="fc-node fc-action" data-node="no-screen">
            <div class="fc-node-icon">✕</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Non offrire PSA testing</div>
              <div class="fc-node-sub">Se < 10–15 anni, rischio sovradiagnosi > beneficio</div>
            </div>
          </div>
        </div>

        <!-- YES branch -->
        <div class="fc-branch">
          <div class="fc-branch-label fc-yes">YES</div>
          <div class="fc-arrow">↓</div>

          <!-- Informed consent -->
          <div class="fc-node fc-process" data-node="counsel">
            <div class="fc-node-icon">◉</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Counseling pre-test</div>
              <div class="fc-node-sub">Benefici, rischi (sovradiagnosi, sovratrattamento), lead time</div>
            </div>
          </div>
          <div class="fc-arrow">↓</div>

          <!-- PSA + DRE -->
          <div class="fc-node fc-input" data-node="psa-dre">
            <div class="fc-node-icon">▣</div>
            <div class="fc-node-body">
              <div class="fc-node-title">PSA + DRE</div>
              <div class="fc-node-sub">Stesso laboratorio, stesso assay · no eiaculazione/UTI</div>
            </div>
          </div>
          <div class="fc-arrow">↓</div>

          <!-- Age Risk stratification -->
          <div class="fc-node fc-decision" data-node="psa-strat">
            <div class="fc-node-icon">◆</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Stratificazione per età</div>
              <div class="fc-node-sub">PSA baseline 40–60 anni</div>
            </div>
          </div>

          <div class="fc-strat-box">
            <div class="fc-strat-row">
              <div class="fc-node fc-decision fc-strat" data-node="low-risk">
                <div class="fc-node-icon">◆</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">PSA &lt; 1 ng/mL @ 40y</div>
                  <div class="fc-node-sub">O PSA &lt; 2 ng/mL @ 60y</div>
                </div>
              </div>
              <div class="fc-strat-label">BASSO RISCHIO</div>
              <div class="fc-node fc-action fc-strat" data-node="recheck-8y">
                <div class="fc-node-icon">⟳</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">Re-test a 8 anni</div>
                  <div class="fc-node-sub">PSA &lt; 1 ng/mL → rischio < 1% csPCa a 8y</div>
                </div>
              </div>
            </div>
            <div class="fc-strat-row">
              <div class="fc-node fc-decision fc-strat" data-node="high-risk">
                <div class="fc-node-icon">◆</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">PSA &gt; 1 ng/mL @ 40y</div>
                  <div class="fc-node-sub">O PSA &gt; 2 ng/mL @ 60y</div>
                </div>
              </div>
              <div class="fc-strat-label">RISCHIO AUMENTATO</div>
              <div class="fc-node fc-action fc-strat" data-node="recheck-2y">
                <div class="fc-node-icon">⟳</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">Re-test a 2 anni</div>
                  <div class="fc-node-sub">Se PSA aumenta rapidamente → rivalutare</div>
                </div>
              </div>
            </div>
          </div>

          <div class="fc-arrow" style="margin-top:0.75rem">↓</div>

          <!-- DRE abnormal -->
          <div class="fc-node fc-decision" data-node="dre-abnormal">
            <div class="fc-node-icon">◆</div>
            <div class="fc-node-body">
              <div class="fc-node-title">DRE positivo?</div>
              <div class="fc-node-sub">Sospetto di PCa indipendentemente dal PSA</div>
            </div>
          </div>
          <div class="fc-branch" style="margin-top:0">
            <div class="fc-branch-label fc-yes">SÌ</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="mri-indicated">
              <div class="fc-node-icon">▶</div>
              <div class="fc-node-body">
                <div class="fc-node-title">→ RMI prostatica</div>
                <div class="fc-node-sub">Indicata indipendentemente dal PSA</div>
              </div>
            </div>
          </div>
          <div class="fc-branch" style="margin-top:0">
            <div class="fc-branch-label fc-no">NO</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="continue-surveillance">
              <div class="fc-node-icon">▶</div>
              <div class="fc-node-body">
                <div class="fc-node-title">→ Poursuite screening</div>
                <div class="fc-node-sub">Continuare follow-up basato su PSA iniziale</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="fc-legend">
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#1a5276"></span>Start</span>
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#6f42c1"></span>Decisione</span>
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#198754"></span>Azione</span>
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#0d6efd"></span>Dato</span>
      </div>

      <div class="fc-ref">
        <strong>Riferimenti:</strong> EAU 2026 Sect. 5.1 — ERSPC 23y follow-up [158,166], CAP trial [164], NNS/NND/NNT [167], IMPACT study [151,182], G8 screening [159]
      </div>
    </div>
  `;

  // Highlight interactive nodes
  container.querySelectorAll('.fc-node').forEach(node => {
    node.addEventListener('click', () => {
      container.querySelectorAll('.fc-node').forEach(n => n.classList.remove('fc-active'));
      node.classList.add('fc-active');
    });
  });
}
