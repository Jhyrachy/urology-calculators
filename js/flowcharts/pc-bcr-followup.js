/**
 * Flowchart: BCR Follow-up — Post prostatectomia e radioterapia
 * Source: EAU Guidelines 2026 — Sect. 6.4 & 7.3
 * URL: https://uroweb.org/guideline/prostate-cancer/#6
 */
export function render(container) {
  container.innerHTML = `
    <div class="fc-page">
      <div class="fc-header">
        <div class="fc-guideline-badge">EAU 2026 · Prostate Cancer · Sect. 6.4 / 7.3</div>
        <h2>Follow-up Post-Trattamento Curativo</h2>
        <p>Algoritmo di monitoraggio post-RP e post-RT e gestione della recidiva biochimica</p>
      </div>

      <div class="fc-flowchart" id="fc-bcr">

        <!-- Tabs for RP / RT -->
        <div class="fc-tabs">
          <button class="fc-tab fc-tab-active" data-tab="rp">Post-Prostatectomia (RP)</button>
          <button class="fc-tab" data-tab="rt">Post-Radioterapia (RT)</button>
        </div>

        <!-- RP Panel -->
        <div class="fc-panel" id="panel-rp">
          <div class="fc-node fc-start" data-node="rp-start">
            <div class="fc-node-icon">▶</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Post-RP</div>
              <div class="fc-node-sub">PSA atteso non rilevabile a 2 mesi</div>
            </div>
          </div>
          <div class="fc-arrow">↓</div>

          <!-- PSA monitoring -->
          <div class="fc-node fc-process" data-node="rp-psa">
            <div class="fc-node-icon">◉</div>
            <div class="fc-node-body">
              <div class="fc-node-title">PSA every 6 mesi × 3 anni</div>
              <div class="fc-node-sub">Poi PSA annuale · PSA annuale dopo 3y se stabile</div>
            </div>
          </div>
          <div class="fc-arrow">↓</div>

          <!-- BCR definition -->
          <div class="fc-node fc-decision" data-node="rp-bcr">
            <div class="fc-node-icon">◆</div>
            <div class="fc-node-body">
              <div class="fc-node-title">PSA rise > 0.4 ng/mL</div>
              <div class="fc-node-sub">BCR definita come PSA rising after RP [994]</div>
            </div>
          </div>

          <!-- NO branch -->
          <div class="fc-branch">
            <div class="fc-branch-label fc-no">NO BCR</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="rp-continue">
              <div class="fc-node-icon">⟳</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Continua follow-up annuale</div>
                <div class="fc-node-sub">Stop se aspettativa < 10 anni</div>
              </div>
            </div>
          </div>

          <!-- YES branch -->
          <div class="fc-branch">
            <div class="fc-branch-label fc-yes">BCR</div>
            <div class="fc-arrow">↓</div>

            <!-- PSA-DT assessment -->
            <div class="fc-node fc-process" data-node="psadt-calc">
              <div class="fc-node-icon">◉</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Calcola PSA-DT</div>
                <div class="fc-node-sub">Usa PSADT calculator · misura testosterone</div>
              </div>
            </div>
            <div class="fc-arrow">↓</div>

            <!-- Imaging decision -->
            <div class="fc-node fc-decision" data-node="imaging-needed">
              <div class="fc-node-icon">◆</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Imaging indicato?</div>
                <div class="fc-node-sub">Se PSA > 0.4 ng/mL o sintomi · PSMA PET/CT</div>
              </div>
            </div>

            <div class="fc-branch">
              <div class="fc-branch-label fc-no">NO</div>
              <div class="fc-arrow">↓</div>
              <div class="fc-node fc-action" data-node="rp-ww">
                <div class="fc-node-icon">▶</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">→ Watchful Waiting</div>
                  <div class="fc-node-sub">PSA-DT > 10 mesi · MFS 192 mesi anche senza terapia</div>
                </div>
              </div>
            </div>

            <div class="fc-branch">
              <div class="fc-branch-label fc-yes">SÌ</div>
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

        <!-- RT Panel -->
        <div class="fc-panel fc-panel-hidden" id="panel-rt">
          <div class="fc-node fc-start" data-node="rt-start">
            <div class="fc-node-icon">▶</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Post-RT</div>
              <div class="fc-node-sub">PSA nadir &lt; 0.5 ng/mL è prognostico favorevole</div>
            </div>
          </div>
          <div class="fc-arrow">↓</div>

          <!-- RT PSA monitoring -->
          <div class="fc-node fc-process" data-node="rt-psa">
            <div class="fc-node-icon">◉</div>
            <div class="fc-node-body">
              <div class="fc-node-title">PSA every 6 mesi × 3 anni</div>
              <div class="fc-node-sub">Poi annuale · nadir raggiunto in fino a 3 anni</div>
            </div>
          </div>
          <div class="fc-arrow">↓</div>

          <!-- Phoenix definition -->
          <div class="fc-node fc-decision" data-node="rt-bcr">
            <div class="fc-node-icon">◆</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Phoenix: PSA nadir + 2 ng/mL</div>
              <div class="fc-node-sub">2006 RTOG-ASTRO Consensus [1016] · valido anche con ADT</div>
            </div>
          </div>

          <div class="fc-branch">
            <div class="fc-branch-label fc-no">NO BCR</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="rt-continue">
              <div class="fc-node-icon">⟳</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Continua follow-up annuale</div>
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

      <div class="fc-legend">
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#1a5276"></span>Start</span>
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#6f42c1"></span>Decisione</span>
        <span class="fc-legend-item"><span class="fc-legend-dot" style="background:#198754"></span>Azione</span>
      </div>

      <div class="fc-ref">
        <strong>Riferimenti:</strong> EAU 2026 Sect. 6.4.2 [994], 6.4.3, 7.3.2–7.3.4 — PSA nadir RP [1438], Phoenix definition [1016], PSMA PET [514], PSA-DT > 10m → MFS 192mo [1450]
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
