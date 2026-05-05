/**
 * Flowchart: ADT Monitoring — Follow-up during androgen deprivation therapy
 * Source: EAU Guidelines 2026 — Sect. 6.5 / 7.4
 * URL: https://uroweb.org/guideline/prostate-cancer/#6
 */
export function render(container) {
  container.innerHTML = `
    <div class="fc-page">
      <div class="fc-header">
        <div class="fc-guideline-badge">EAU 2026 · Prostate Cancer · Sect. 6.5 / 7.4</div>
        <h2>ADT Monitoring</h2>
        <p>Follow-up of patients on androgen deprivation therapy (castration)</p>
      </div>

      <div class="fc-flowchart" id="fc-adt">

        <!-- START -->
        <div class="fc-node fc-start" data-node="adt-start">
          <div class="fc-node-icon">▶</div>
          <div class="fc-node-body">
            <div class="fc-node-title">ADT initiation</div>
            <div class="fc-node-sub">LHRH agonist/antagonist · orchidectomy · combined</div>
          </div>
        </div>
        <div class="fc-arrow">↓</div>

        <!-- First visit -->
        <div class="fc-node fc-process" data-node="first-visit">
          <div class="fc-node-icon">◉</div>
          <div class="fc-node-body">
            <div class="fc-node-title">First visit (1–3 months)</div>
            <div class="fc-node-sub">History · PSA · testosterone · liver function · ECG/Cardiology</div>
          </div>
        </div>
        <div class="fc-arrow">↓</div>

        <!-- Testosterone check -->
        <div class="fc-node fc-decision" data-node="testosterone-ok">
          <div class="fc-node-icon">◆</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Testosterone &lt; 50 ng/dL?</div>
            <div class="fc-node-sub">Castration achieved and maintained</div>
          </div>
        </div>

        <div class="fc-branch-pair">
          <div class="fc-branch">
            <div class="fc-branch-label fc-no">NO</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="switch-adt">
              <div class="fc-node-icon">⟳</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Switch therapy</div>
                <div class="fc-node-sub">Change agonist or use LHRH antagonist</div>
              </div>
            </div>
          </div>
          <div class="fc-branch">
            <div class="fc-branch-label fc-yes">YES</div>
            <div class="fc-arrow">↓</div>

            <!-- PSA response -->
            <div class="fc-node fc-decision" data-node="psa-response">
              <div class="fc-node-icon">◆</div>
              <div class="fc-node-body">
                <div class="fc-node-title">PSA declining?</div>
                <div class="fc-node-sub">PSA &lt; 2.4 ng/mL → good response</div>
              </div>
            </div>

            <div class="fc-branch-pair" style="margin-top:0">
              <div class="fc-branch">
                <div class="fc-branch-label fc-no">PSA ↑</div>
                <div class="fc-arrow">↓</div>
                <div class="fc-node fc-process" data-node="crtc-check">
                  <div class="fc-node-icon">◉</div>
                  <div class="fc-node-body">
                    <div class="fc-node-title">Check for CRPC</div>
                    <div class="fc-node-sub">Testosterone confirmed &lt; 50 ng/dL · PSA rising · imaging</div>
                  </div>
                </div>
                <div class="fc-arrow">↓</div>
                <div class="fc-node fc-action" data-node="crtc-therapy">
                  <div class="fc-node-icon">▶</div>
                  <div class="fc-node-body">
                    <div class="fc-node-title">→ Second-line therapy</div>
                    <div class="fc-node-sub">ARPI, taxanes, 177Lu-PSMA, clinical trials</div>
                  </div>
                </div>
              </div>
              <div class="fc-branch">
                <div class="fc-branch-label fc-yes">PSA ↓</div>
                <div class="fc-arrow">↓</div>

                <!-- Regular monitoring grid -->
                <div class="fc-adt-grid">
                  <div class="fc-adt-item">
                    <div class="fc-adt-icon">🩸</div>
                    <div class="fc-adt-label">PSA + Testosterone</div>
                    <div class="fc-adt-value">q 3–6 months</div>
                  </div>
                  <div class="fc-adt-item">
                    <div class="fc-adt-icon">🫀</div>
                    <div class="fc-adt-label">Liver + Lipids</div>
                    <div class="fc-adt-value">q 3–6 months (first year)</div>
                  </div>
                  <div class="fc-adt-item">
                    <div class="fc-adt-icon">🦴</div>
                    <div class="fc-adt-label">DEXA scan</div>
                    <div class="fc-adt-value">Baseline · then q 2 years</div>
                  </div>
                  <div class="fc-adt-item">
                    <div class="fc-adt-icon">💉</div>
                    <div class="fc-adt-label">Glucose / HbA1c</div>
                    <div class="fc-adt-value">Baseline · routine</div>
                  </div>
                  <div class="fc-adt-item">
                    <div class="fc-adt-icon">🧠</div>
                    <div class="fc-adt-label">Psychological status</div>
                    <div class="fc-adt-value">Every visit</div>
                  </div>
                  <div class="fc-adt-item">
                    <div class="fc-adt-icon">⚠️</div>
                    <div class="fc-adt-label">Signs of progression</div>
                    <div class="fc-adt-value">Imaging if symptoms / PSA ↑</div>
                  </div>
                </div>
                <div class="fc-arrow">↓</div>

                <!-- Imaging on progression -->
                <div class="fc-node fc-decision" data-node="imaging-decision">
                  <div class="fc-node-icon">◆</div>
                  <div class="fc-node-body">
                    <div class="fc-node-title">Restaging imaging?</div>
                    <div class="fc-node-sub">If PSA rising or symptoms · PSMA PET/CT</div>
                  </div>
                </div>

                <div class="fc-branch-pair" style="margin-top:0">
                  <div class="fc-branch">
                    <div class="fc-branch-label fc-no">NO</div>
                    <div class="fc-arrow">↓</div>
                    <div class="fc-node fc-action" data-node="adt-continue">
                      <div class="fc-node-icon">⟳</div>
                      <div class="fc-node-body">
                        <div class="fc-node-title">Continue ADT</div>
                        <div class="fc-node-sub">Re-evaluate at each visit</div>
                      </div>
                    </div>
                  </div>
                  <div class="fc-branch">
                    <div class="fc-branch-label fc-yes">YES</div>
                    <div class="fc-arrow">↓</div>
                    <div class="fc-node fc-action" data-node="restadiation">
                      <div class="fc-node-icon">▶</div>
                      <div class="fc-node-body">
                        <div class="fc-node-title">→ Restaging</div>
                        <div class="fc-node-sub">CT + bone scan or PSMA PET · adapt treatment plan</div>
                      </div>
                    </div>
                  </div>
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
        <strong>References:</strong> EAU 2026 Sect. 6.5.3, 7.4.2–7.4.5 — testosterone castration [1455,1456], metabolic syndrome [1463], DEXA [1471], CRPC definition [1218,1219]
      </div>
    </div>
  `;
}
