/**
 * Flowchart: Active Surveillance — Inclusione e Monitoraggio
 * Source: EAU Guidelines 2026 — Sect. 6.2.1 & 7.2
 * URL: https://uroweb.org/guideline/prostate-cancer/#6
 */
export function render(container) {
  container.innerHTML = `
    <div class="fc-page">
      <div class="fc-header">
        <div class="fc-guideline-badge">EAU 2026 · Prostate Cancer · Sect. 6.2.1 / 7.2</div>
        <h2>Active Surveillance</h2>
        <p>Criteri di inclusione e protocollo di monitoraggio</p>
      </div>

      <div class="fc-flowchart" id="fc-as">

        <!-- START: Diagnosis -->
        <div class="fc-node fc-start" data-node="diagnosis">
          <div class="fc-node-icon">▶</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Diagnosi di PCa</div>
            <div class="fc-node-sub">ISUP GG 1 (Gleason ≤ 6) · biopsia sistematica ± MRI target</div>
          </div>
        </div>
        <div class="fc-arrow">↓</div>

        <!-- Inclusion criteria check -->
        <div class="fc-node fc-process" data-node="criteria-check">
          <div class="fc-node-icon">◉</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Criteri di inclusione AS</div>
            <div class="fc-node-sub">EAU Low-risk · PSA < 10 ng/mL · ISUP GG 1 · cT1c–cT2a · PSA-D < 0.15 ng/mL/cc</div>
          </div>
        </div>
        <div class="fc-arrow">↓</div>

        <!-- Eligible? -->
        <div class="fc-node fc-decision" data-node="eligible">
          <div class="fc-node-icon">◆</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Candidato AS?</div>
            <div class="fc-node-sub">Aspettativa di vita > 10 anni · accetta il protocollo</div>
          </div>
        </div>

        <!-- NO -->
        <div class="fc-branch">
          <div class="fc-branch-label fc-no">NO</div>
          <div class="fc-arrow">↓</div>
          <div class="fc-node fc-action" data-node="alt-therapy">
            <div class="fc-node-icon">✕</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Altra opzione curativa</div>
              <div class="fc-node-sub">RP, RT, or curata adattata alla frailty</div>
            </div>
          </div>
        </div>

        <!-- YES -->
        <div class="fc-branch">
          <div class="fc-branch-label fc-yes">YES</div>
          <div class="fc-arrow">↓</div>

          <!-- Confirmatory biopsy -->
          <div class="fc-node fc-process" data-node="confirmatory-bx">
            <div class="fc-node-icon">◉</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Biopsia confermativa</div>
              <div class="fc-node-sub">mpMRI + systematic + targeted (se PI-RADS ≥ 3) · entro 3–6 mesi</div>
            </div>
          </div>
          <div class="fc-arrow">↓</div>

          <!-- Confirmatory result -->
          <div class="fc-node fc-decision" data-node="confirm-ok">
            <div class="fc-node-icon">◆</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Nessun upgrade a ISUP GG ≥ 2?</div>
              <div class="fc-node-sub">Conferma GG 1 · max 50% core positivi · no core > 50%</div>
            </div>
          </div>

          <!-- Upgrade -->
          <div class="fc-branch">
            <div class="fc-branch-label fc-no">UPGRADE</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="active-treatment">
              <div class="fc-node-icon">▶</div>
              <div class="fc-node-body">
                <div class="fc-node-title">→ Trattamento attivo</div>
                <div class="fc-node-sub">RP o RT · discussione rischi/benefici</div>
              </div>
            </div>
          </div>

          <!-- Confirmed -->
          <div class="fc-branch">
            <div class="fc-branch-label fc-yes">CONFERMATO</div>
            <div class="fc-arrow">↓</div>

            <!-- AS Protocol table -->
            <div class="fc-as-protocol">
              <div class="fc-protocol-title">Protocollo di sorveglianza AS</div>
              <div class="fc-protocol-grid">
                <div class="fc-protocol-item">
                  <div class="fc-protocol-label">PSA</div>
                  <div class="fc-protocol-value">Ogni 3–6 mesi</div>
                </div>
                <div class="fc-protocol-item">
                  <div class="fc-protocol-label">DRE</div>
                  <div class="fc-protocol-value">Ogni 6–12 mesi</div>
                </div>
                <div class="fc-protocol-item">
                  <div class="fc-protocol-label">mpMRI</div>
                  <div class="fc-protocol-value">12 mesi, poi q1–2y se stabile</div>
                </div>
                <div class="fc-protocol-item">
                  <div class="fc-protocol-label">Biopsia di conferma</div>
                  <div class="fc-protocol-value">1ª a 6–12 mesi · poi q2–3y o su MRI+</div>
                </div>
              </div>
            </div>
            <div class="fc-arrow">↓</div>

            <!-- Trigger for intervention -->
            <div class="fc-node fc-decision" data-node="trigger">
              <div class="fc-node-icon">◆</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Trigger di intervento</div>
                <div class="fc-node-sub">Gleason升级 · PSA-DT < 3 anni · progressione clinica</div>
              </div>
            </div>

            <!-- Trigger details -->
            <div class="fc-strat-box" style="margin-top:0.75rem">
              <div class="fc-strat-row">
                <div class="fc-node fc-decision fc-strat" data-node="psadt-trigger">
                  <div class="fc-node-icon">◆</div>
                  <div class="fc-node-body">
                    <div class="fc-node-title">PSA-DT &lt; 3 anni</div>
                  </div>
                </div>
                <div class="fc-strat-label">⚠️ RE-TRIGGER</div>
                <div class="fc-node fc-action fc-strat" data-node="reevaluate">
                  <div class="fc-node-icon">▶</div>
                  <div class="fc-node-body">
                    <div class="fc-node-title">→ Rivalutare</div>
                    <div class="fc-node-sub">mpMRI + biopsia di refresh</div>
                  </div>
                </div>
              </div>
              <div class="fc-strat-row">
                <div class="fc-node fc-decision fc-strat" data-node="gg-upgrade-trigger">
                  <div class="fc-node-icon">◆</div>
                  <div class="fc-node-body">
                    <div class="fc-node-title">ISUP GG ≥ 2 alla biopsia</div>
                  </div>
                </div>
                <div class="fc-strat-label">⚠️ PROGRESSIONE</div>
                <div class="fc-node fc-action fc-strat" data-node="active-treat">
                  <div class="fc-node-icon">▶</div>
                  <div class="fc-node-body">
                    <div class="fc-node-title">→ Trattamento attivo</div>
                    <div class="fc-node-sub">RP o RT radicale</div>
                  </div>
                </div>
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
        <strong>Riferimenti:</strong> EAU 2026 Sect. 6.2.1, 7.2 — ProtecT trial 15y [593–595], ASIST [639], MRIAS [623], DETECTIVE [642], Movember consensus [620]
      </div>
    </div>
  `;
}
