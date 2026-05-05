/**
 * Flowchart: BCR Follow-up — Post-prostatectomy and post-radiotherapy
 * Source: EAU Guidelines 2026 — Sect. 6.4 & 7.3
 * URL: https://uroweb.org/guideline/prostate-cancer/#6
 */
export function render(container) {
  container.innerHTML = `
    <div class="fc-page">
      <div class="fc-header">
        <div class="fc-guideline-badge">EAU 2026 · Prostate Cancer · Sect. 6.4 / 7.3</div>
        <h2>Post-Treatment Follow-up</h2>
        <p>Monitoring algorithm after RP and RT and management of biochemical recurrence</p>
      </div>

      <div class="fc-flowchart" id="fc-bcr">

        <!-- Tabs for RP / RT -->
        <div class="fc-tabs">
          <button class="fc-tab fc-tab-active" data-tab="rp">Post-Prostatectomy (RP)</button>
          <button class="fc-tab" data-tab="rt">Post-Radiotherapy (RT)</button>
        </div>

        <!-- RP Panel -->
        <div class="fc-panel" id="panel-rp">
          <div class="fc-node fc-start" data-node="rp-start">
            <div class="fc-node-icon">▶</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Post-RP</div>
              <div class="fc-node-sub">PSA expected undetectable at 2 months</div>
            </div>
          </div>
          <div class="fc-arrow">↓</div>

          <!-- PSA monitoring -->
          <div class="fc-node fc-process" data-node="rp-psa">
            <div class="fc-node-icon">◉</div>
            <div class="fc-node-body">
              <div class="fc-node-title">PSA every 6 months × 3 years</div>
              <div class="fc-node-sub">Then annual PSA · if stable after 3y</div>
            </div>
          </div>
          <div class="fc-arrow">↓</div>

          <!-- BCR definition -->
          <div class="fc-node fc-decision" data-node="rp-bcr">
            <div class="fc-node-icon">◆</div>
            <div class="fc-node-body">
              <div class="fc-node-title">PSA rise &gt; 0.4 ng/mL</div>
              <div class="fc-node-sub">BCR defined as PSA rising after RP [994]</div>
            </div>
          </div>

          <div class="fc-branch-pair">
            <div class="fc-branch">
              <div class="fc-branch-label fc-no">NO BCR</div>
              <div class="fc-arrow">↓</div>
              <div class="fc-node fc-action" data-node="rp-continue">
                <div class="fc-node-icon">⟳</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">Continue annual follow-up</div>
                  <div class="fc-node-sub">Stop if life expectancy &lt; 10 years</div>
                </div>
              </div>
            </div>
            <div class="fc-branch">
              <div class="fc-branch-label fc-yes">BCR</div>
              <div class="fc-arrow">↓</div>

              <!-- PSA-DT assessment -->
              <div class="fc-node fc-process" data-node="psadt-calc">
                <div class="fc-node-icon">◉</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">Calculate PSA-DT</div>
                  <div class="fc-node-sub">Use PSADT calculator · measure testosterone</div>
                </div>
              </div>
              <div class="fc-arrow">↓</div>

              <!-- Imaging decision -->
              <div class="fc-node fc-decision" data-node="imaging-needed">
                <div class="fc-node-icon">◆</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">Imaging indicated?</div>
                  <div class="fc-node-sub">If PSA &gt; 0.4 ng/mL or symptoms · PSMA PET/CT</div>
                </div>
              </div>

              <div class="fc-branch-pair" style="margin-top:0">
                <div class="fc-branch">
                  <div class="fc-branch-label fc-no">NO</div>
                  <div class="fc-arrow">↓</div>
                  <div class="fc-node fc-action" data-node="rp-ww">
                    <div class="fc-node-icon">▶</div>
                    <div class="fc-node-body">
                      <div class="fc-node-title">→ Watchful Waiting</div>
                      <div class="fc-node-sub">PSA-DT &gt; 10 months · MFS 192 months even without therapy</div>
                    </div>
                  </div>
                </div>
                <div class="fc-branch">
                  <div class="fc-branch-label fc-yes">YES</div>
                  <div class="fc-arrow">↓</div>
                  <div class="fc-node fc-action" data-node="rp-salvage">
                    <div class="fc-node-icon">▶</div>
                    <div class="fc-node-body">
                      <div class="fc-node-title">→ Salvage therapy</div>
                      <div class="fc-node-sub">RT alone or combined · ADT ± ARPI · second-line</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RT Panel -->
        <div class="fc-panel fc-panel-hidden" id="panel-rt">
          <div class="fc-node fc-start" data-node="rt-start">
            <div class="fc-node-icon">▶</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Post-RT</div>
              <div class="fc-node-sub">PSA nadir &lt; 0.5 ng/mL is favourable prognostic factor</div>
            </div>
          </div>
          <div class="fc-arrow">↓</div>

          <!-- RT PSA monitoring -->
          <div class="fc-node fc-process" data-node="rt-psa">
            <div class="fc-node-icon">◉</div>
            <div class="fc-node-body">
              <div class="fc-node-title">PSA every 6 months × 3 years</div>
              <div class="fc-node-sub">Then annual · nadir reached in up to 3 years</div>
            </div>
          </div>
          <div class="fc-arrow">↓</div>

          <!-- Phoenix definition -->
          <div class="fc-node fc-decision" data-node="rt-bcr">
            <div class="fc-node-icon">◆</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Phoenix: PSA nadir + 2 ng/mL</div>
              <div class="fc-node-sub">2006 RTOG-ASTRO Consensus [1016] · valid even with ADT</div>
            </div>
          </div>

          <div class="fc-branch-pair">
            <div class="fc-branch">
              <div class="fc-branch-label fc-no">NO BCR</div>
              <div class="fc-arrow">↓</div>
              <div class="fc-node fc-action" data-node="rt-continue">
                <div class="fc-node-icon">⟳</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">Continue annual follow-up</div>
                </div>
              </div>
            </div>
            <div class="fc-branch">
              <div class="fc-branch-label fc-yes">BCR</div>
              <div class="fc-arrow">↓</div>
              <div class="fc-node fc-action" data-node="rt-salvage">
                <div class="fc-node-icon">▶</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">→ Salvage therapy</div>
                  <div class="fc-node-sub">SBRT, ADT, or combination · imaging with PSMA PET/CT</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="fc-legend">
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#1a5276"></span>Start</span>
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#6f42c1"></span>Decision</span>
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#198754"></span>Action</span>
      </div>

      <div class="fc-ref">
        <strong>References:</strong> EAU 2026 Sect. 6.4.2 [994], 6.4.3, 7.3.2–7.3.4 — PSA nadir RP [1438], Phoenix definition [1016], PSMA PET [514], PSA-DT &gt; 10m → MFS 192mo [1450]
      </div>
    </div>
  `;

  // Tab switching
  container.querySelectorAll('.fc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.fc-tab').forEach(t => t.classList.remove('fc-tab-active'));
      tab.classList.add('fc-tab-active');
      container.querySelectorAll('.fc-panel').forEach(p => p.classList.add('fc-panel-hidden'));
      container.querySelector(`#panel-${tab.dataset.tab}`).classList.remove('fc-panel-hidden');
    });
  });
}
