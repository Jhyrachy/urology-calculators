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
        <h2>Prostate Cancer Screening</h2>
        <p>Individualized opportunistic screening algorithm</p>
      </div>

      <div class="fc-flowchart" id="fc-screening">

        <!-- START -->
        <div class="fc-node fc-start" data-node="start">
          <div class="fc-node-icon">▶</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Asymptomatic man</div>
            <div class="fc-node-sub">Requires screening counselling</div>
          </div>
        </div>
        <div class="fc-arrow">↓</div>

        <!-- Life expectancy -->
        <div class="fc-node fc-decision" data-node="life-exp">
          <div class="fc-node-icon">◆</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Life expectancy</div>
            <div class="fc-node-sub">&gt; 10–15 years?</div>
          </div>
        </div>

        <!-- NO branch -->
        <div class="fc-branch-pair">
          <div class="fc-branch">
            <div class="fc-branch-label fc-no">NO</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="no-screen">
              <div class="fc-node-icon">✕</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Do not offer PSA testing</div>
                <div class="fc-node-sub">If &lt; 10–15 years, overdiagnosis risk &gt; benefit</div>
              </div>
            </div>
          </div>
          <!-- YES branch -->
          <div class="fc-branch">
            <div class="fc-branch-label fc-yes">YES</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="counsel">
              <div class="fc-node-icon">▶</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Pre-test counselling</div>
                <div class="fc-node-sub">Benefits, risks (overdiagnosis, overtreatment), lead time</div>
              </div>
            </div>
          </div>
        </div>

        <div class="fc-arrow">↓</div>

        <!-- PSA + DRE -->
        <div class="fc-node fc-input" data-node="psa-dre">
          <div class="fc-node-icon">▣</div>
          <div class="fc-node-body">
            <div class="fc-node-title">PSA + DRE</div>
            <div class="fc-node-sub">Same lab, same assay · no ejaculation/UTI 48h prior</div>
          </div>
        </div>
        <div class="fc-arrow">↓</div>

        <!-- Age Risk stratification -->
        <div class="fc-node fc-decision" data-node="psa-strat">
          <div class="fc-node-icon">◆</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Risk stratification by age</div>
            <div class="fc-node-sub">PSA baseline at 40–60 years</div>
          </div>
        </div>

        <div class="fc-strat-box">
          <div class="fc-strat-row">
            <div class="fc-node fc-decision fc-strat" data-node="low-risk">
              <div class="fc-node-icon">◆</div>
              <div class="fc-node-body">
                <div class="fc-node-title">PSA &lt; 1 ng/mL @ 40y</div>
                <div class="fc-node-sub">Or PSA &lt; 2 ng/mL @ 60y</div>
              </div>
            </div>
            <div class="fc-strat-label">LOW RISK</div>
            <div class="fc-node fc-action fc-strat" data-node="recheck-8y">
              <div class="fc-node-icon">⟳</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Re-test at 8 years</div>
                <div class="fc-node-sub">PSA &lt; 1 ng/mL → csPCa risk &lt; 1% at 8y</div>
              </div>
            </div>
          </div>
          <div class="fc-strat-row">
            <div class="fc-node fc-decision fc-strat" data-node="high-risk">
              <div class="fc-node-icon">◆</div>
              <div class="fc-node-body">
                <div class="fc-node-title">PSA &gt; 1 ng/mL @ 40y</div>
                <div class="fc-node-sub">Or PSA &gt; 2 ng/mL @ 60y</div>
              </div>
            </div>
            <div class="fc-strat-label">ELEVATED RISK</div>
            <div class="fc-node fc-action fc-strat" data-node="recheck-2y">
              <div class="fc-node-icon">⟳</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Re-test at 2 years</div>
                <div class="fc-node-sub">If PSA rises rapidly → re-evaluate</div>
              </div>
            </div>
          </div>
        </div>

        <div class="fc-arrow">↓</div>

        <!-- DRE abnormal -->
        <div class="fc-node fc-decision" data-node="dre-abnormal">
          <div class="fc-node-icon">◆</div>
          <div class="fc-node-body">
            <div class="fc-node-title">DRE positive?</div>
            <div class="fc-node-sub">Suspected PCa regardless of PSA</div>
          </div>
        </div>

        <div class="fc-branch-pair">
          <div class="fc-branch">
            <div class="fc-branch-label fc-yes">YES</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="mri-indicated">
              <div class="fc-node-icon">▶</div>
              <div class="fc-node-body">
                <div class="fc-node-title">→ Prostate MRI</div>
                <div class="fc-node-sub">Indicated regardless of PSA</div>
              </div>
            </div>
          </div>
          <div class="fc-branch">
            <div class="fc-branch-label fc-no">NO</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="continue-surveillance">
              <div class="fc-node-icon">▶</div>
              <div class="fc-node-body">
                <div class="fc-node-title">→ Continue screening</div>
                <div class="fc-node-sub">Continue follow-up based on initial PSA</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="fc-legend">
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#1a5276"></span>Start</span>
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#6f42c1"></span>Decision</span>
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#198754"></span>Action</span>
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#0d6efd"></span>Data</span>
      </div>

      <div class="fc-ref">
        <strong>References:</strong> EAU 2026 Sect. 5.1 — ERSPC 23y follow-up [158,166], CAP trial [164], NNS/NND/NNT [167], IMPACT study [151,182], G8 screening [159]
      </div>
    </div>
  `;

  container.querySelectorAll('.fc-node').forEach(node => {
    node.addEventListener('click', () => {
      container.querySelectorAll('.fc-node').forEach(n => n.classList.remove('fc-active'));
      node.classList.add('fc-active');
    });
  });
}
