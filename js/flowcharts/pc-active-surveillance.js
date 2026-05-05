/**
 * Flowchart: Active Surveillance — Inclusion and Monitoring
 * Source: EAU Guidelines 2026 — Sect. 6.2.1 & 7.2
 * URL: https://uroweb.org/guideline/prostate-cancer/#6
 */
export function render(container) {
  container.innerHTML = `
    <div class="fc-page">
      <div class="fc-header">
        <div class="fc-guideline-badge">EAU 2026 · Prostate Cancer · Sect. 6.2.1 / 7.2</div>
        <h2>Active Surveillance</h2>
        <p>Inclusion criteria and monitoring protocol</p>
      </div>

      <div class="fc-flowchart" id="fc-as">

        <!-- START: Diagnosis -->
        <div class="fc-node fc-start" data-node="diagnosis">
          <div class="fc-node-icon">▶</div>
          <div class="fc-node-body">
            <div class="fc-node-title">PCa diagnosis</div>
            <div class="fc-node-sub">ISUP GG 1 (Gleason ≤ 6) · systematic biopsy ± MRI target</div>
          </div>
        </div>
        <div class="fc-arrow">↓</div>

        <!-- Inclusion criteria check -->
        <div class="fc-node fc-process" data-node="criteria-check">
          <div class="fc-node-icon">◉</div>
          <div class="fc-node-body">
            <div class="fc-node-title">AS inclusion criteria</div>
            <div class="fc-node-sub">EAU Low-risk · PSA &lt; 10 ng/mL · ISUP GG 1 · cT1c–cT2a · PSAD &lt; 0.15 ng/mL/cc</div>
          </div>
        </div>
        <div class="fc-arrow">↓</div>

        <!-- Eligible? -->
        <div class="fc-node fc-decision" data-node="eligible">
          <div class="fc-node-icon">◆</div>
          <div class="fc-node-body">
            <div class="fc-node-title">AS candidate?</div>
            <div class="fc-node-sub">Life expectancy &gt; 10 years · accepts protocol</div>
          </div>
        </div>

        <div class="fc-branch-pair">
          <div class="fc-branch">
            <div class="fc-branch-label fc-no">NO</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="alt-therapy">
              <div class="fc-node-icon">✕</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Other curative option</div>
                <div class="fc-node-sub">RP, RT, or adapted therapy based on frailty</div>
              </div>
            </div>
          </div>
          <div class="fc-branch">
            <div class="fc-branch-label fc-yes">YES</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-process" data-node="confirmatory-bx">
              <div class="fc-node-icon">◉</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Confirmatory biopsy</div>
                <div class="fc-node-sub">mpMRI + systematic + targeted (if PI-RADS ≥ 3) · within 3–6 months</div>
              </div>
            </div>
          </div>
        </div>

        <div class="fc-arrow">↓</div>

        <!-- Confirmatory result -->
        <div class="fc-node fc-decision" data-node="confirm-ok">
          <div class="fc-node-icon">◆</div>
          <div class="fc-node-body">
            <div class="fc-node-title">No upgrade to ISUP GG ≥ 2?</div>
            <div class="fc-node-sub">GG 1 confirmed · max 50% positive cores · no core &gt; 50%</div>
          </div>
        </div>

        <div class="fc-branch-pair">
          <div class="fc-branch">
            <div class="fc-branch-label fc-no">UPGRADE</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="active-treatment">
              <div class="fc-node-icon">▶</div>
              <div class="fc-node-body">
                <div class="fc-node-title">→ Active treatment</div>
                <div class="fc-node-sub">RP or RT · risks/benefits discussion</div>
              </div>
            </div>
          </div>
          <div class="fc-branch">
            <div class="fc-branch-label fc-yes">CONFIRMED</div>
            <div class="fc-arrow">↓</div>

            <!-- AS Protocol table -->
            <div class="fc-as-protocol">
              <div class="fc-protocol-title">AS Monitoring Protocol</div>
              <div class="fc-protocol-grid">
                <div class="fc-protocol-item">
                  <div class="fc-protocol-label">PSA</div>
                  <div class="fc-protocol-value">Every 3–6 months</div>
                </div>
                <div class="fc-protocol-item">
                  <div class="fc-protocol-label">DRE</div>
                  <div class="fc-protocol-value">Every 6–12 months</div>
                </div>
                <div class="fc-protocol-item">
                  <div class="fc-protocol-label">mpMRI</div>
                  <div class="fc-protocol-value">12 months, then q1–2y if stable</div>
                </div>
                <div class="fc-protocol-item">
                  <div class="fc-protocol-label">Confirmatory biopsy</div>
                  <div class="fc-protocol-value">1st at 6–12 months · then q2–3y or if MRI+</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="fc-arrow">↓</div>

        <!-- Trigger for intervention -->
        <div class="fc-node fc-decision" data-node="trigger">
          <div class="fc-node-icon">◆</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Intervention triggers</div>
            <div class="fc-node-sub">Gleason upgrade · PSA-DT &lt; 3 years · clinical progression</div>
          </div>
        </div>

        <div class="fc-strat-box" style="margin-top:0.75rem">
          <div class="fc-strat-row">
            <div class="fc-node fc-decision fc-strat" data-node="psadt-trigger">
              <div class="fc-node-icon">◆</div>
              <div class="fc-node-body">
                <div class="fc-node-title">PSA-DT &lt; 3 years</div>
              </div>
            </div>
            <div class="fc-strat-label">⚠️ RE-TRIGGER</div>
            <div class="fc-node fc-action fc-strat" data-node="reevaluate">
              <div class="fc-node-icon">▶</div>
              <div class="fc-node-body">
                <div class="fc-node-title">→ Re-evaluate</div>
                <div class="fc-node-sub">mpMRI + refresh biopsy</div>
              </div>
            </div>
          </div>
          <div class="fc-strat-row">
            <div class="fc-node fc-decision fc-strat" data-node="gg-upgrade-trigger">
              <div class="fc-node-icon">◆</div>
              <div class="fc-node-body">
                <div class="fc-node-title">ISUP GG ≥ 2 on biopsy</div>
              </div>
            </div>
            <div class="fc-strat-label">⚠️ PROGRESSION</div>
            <div class="fc-node fc-action fc-strat" data-node="active-treat">
              <div class="fc-node-icon">▶</div>
              <div class="fc-node-body">
                <div class="fc-node-title">→ Active treatment</div>
                <div class="fc-node-sub">Radical RP or RT</div>
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
        <strong>References:</strong> EAU 2026 Sect. 6.2.1, 7.2 — ProtecT trial 15y [593–595], ASIST [639], MRIAS [623], DETECTIVE [642], Movember consensus [620]
      </div>
    </div>
  `;
}
