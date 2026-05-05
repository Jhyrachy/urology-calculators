/**
 * Flowchart: ADT Monitoring — Follow-up durante terapia androgenica
 * Source: EAU Guidelines 2026 — Sect. 6.5 / 7.4
 * URL: https://uroweb.org/guideline/prostate-cancer/#6
 */
export function render(container) {
  container.innerHTML = `
    <div class="fc-page">
      <div class="fc-header">
        <div class="fc-guideline-badge">EAU 2026 · Prostate Cancer · Sect. 6.5 / 7.4</div>
        <h2>Monitoraggio ADT</h2>
        <p>Follow-up del paziente in terapia androgenica (castrazione)</p>
      </div>

      <div class="fc-flowchart" id="fc-adt">

        <!-- START -->
        <div class="fc-node fc-start" data-node="adt-start">
          <div class="fc-node-icon">▶</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Inizio ADT</div>
            <div class="fc-node-sub">LHRH agonista/antagonista · orchidectomia · combinato</div>
          </div>
        </div>
        <div class="fc-arrow">↓</div>

        <!-- First visit -->
        <div class="fc-node fc-process" data-node="first-visit">
          <div class="fc-node-icon">◉</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Prima visita (1–3 mesi)</div>
            <div class="fc-node-sub">Anamnesi · PSA · testosterone · funzionalità epatica · ECG/Cardiologia</div>
          </div>
        </div>
        <div class="fc-arrow">↓</div>

        <!-- Testosterone check -->
        <div class="fc-node fc-decision" data-node="testosterone-ok">
          <div class="fc-node-icon">◆</div>
          <div class="fc-node-body">
            <div class="fc-node-title">Testosterone &lt; 50 ng/dL?</div>
            <div class="fc-node-sub">Castrazione raggiunta e mantenuta</div>
          </div>
        </div>

        <!-- NO -->
        <div class="fc-branch">
          <div class="fc-branch-label fc-no">NO</div>
          <div class="fc-arrow">↓</div>
          <div class="fc-node fc-action" data-node="switch-adt">
            <div class="fc-node-icon">⟳</div>
            <div class="fc-node-body">
              <div class="fc-node-title">Switch therapy</div>
              <div class="fc-node-sub">Cambiare agonista o usare antagonista LHRH</div>
            </div>
          </div>
        </div>

        <!-- YES -->
        <div class="fc-branch">
          <div class="fc-branch-label fc-yes">YES</div>
          <div class="fc-arrow">↓</div>

          <!-- PSA response -->
          <div class="fc-node fc-decision" data-node="psa-response">
            <div class="fc-node-icon">◆</div>
            <div class="fc-node-body">
              <div class="fc-node-title">PSA in calo?</div>
              <div class="fc-node-sub">PSA &lt; 2.4 ng/mL → buona risposta</div>
            </div>
          </div>

          <!-- PSA rising -->
          <div class="fc-branch">
            <div class="fc-branch-label fc-no">PSA ↑</div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-process" data-node="crtc-check">
              <div class="fc-node-icon">◉</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Check CRPC</div>
                <div class="fc-node-sub">Testosterone confermato < 50 ng/dL · PSA rising · imaging</div>
              </div>
            </div>
            <div class="fc-arrow">↓</div>
            <div class="fc-node fc-action" data-node="crtc-therapy">
              <div class="fc-node-icon">▶</div>
              <div class="fc-node-body">
                <div class="fc-node-title">→ Second-line therapy</div>
                <div class="fc-node-sub">ARPI, taxani, 177Lu-PSMA, trial clinici</div>
              </div>
            </div>
          </div>

          <!-- PSA good -->
          <div class="fc-branch">
            <div class="fc-branch-label fc-yes">PSA ↓</div>
            <div class="fc-arrow">↓</div>

            <!-- Regular monitoring grid -->
            <div class="fc-adt-grid">
              <div class="fc-adt-item">
                <div class="fc-adt-icon">🩸</div>
                <div class="fc-adt-label">PSA + Testosterone</div>
                <div class="fc-adt-value">q 3–6 mesi</div>
              </div>
              <div class="fc-adt-item">
                <div class="fc-adt-icon">🫀</div>
                <div class="fc-adt-label">Funzionalitàepatica + Lipidi</div>
                <div class="fc-adt-value">q 3–6 mesi (primo anno)</div>
              </div>
              <div class="fc-adt-item">
                <div class="fc-adt-icon">🦴</div>
                <div class="fc-adt-label">DEXA scan</div>
                <div class="fc-adt-value">Basale · poi q 2 anni</div>
              </div>
              <div class="fc-adt-item">
                <div class="fc-adt-icon">💉</div>
                <div class="fc-adt-label">Glicemia / HbA1c</div>
                <div class="fc-adt-value">Basale · routine</div>
              </div>
              <div class="fc-adt-item">
                <div class="fc-adt-icon">🧠</div>
                <div class="fc-adt-label">Stato psicologico</div>
                <div class="fc-adt-value">Ogni visita</div>
              </div>
              <div class="fc-adt-item">
                <div class="fc-adt-icon">⚠️</div>
                <div class="fc-adt-label">Segni di progressione</div>
                <div class="fc-adt-value">Imaging se sintomi / PSA ↑</div>
              </div>
            </div>
            <div class="fc-arrow">↓</div>

            <!-- Imaging on progression -->
            <div class="fc-node fc-decision" data-node="imaging-decision">
              <div class="fc-node-icon">◆</div>
              <div class="fc-node-body">
                <div class="fc-node-title">Imaging di restadiazione?</div>
                <div class="fc-node-sub">Se PSA rising o sintomi · PSMA PET/CT</div>
              </div>
            </div>

            <div class="fc-branch">
              <div class="fc-branch-label fc-no">NO</div>
              <div class="fc-arrow">↓</div>
              <div class="fc-node fc-action" data-node="adt-continue">
                <div class="fc-node-icon">⟳</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">Continua ADT</div>
                  <div class="fc-node-sub">Rivalutazione a ogni visita</div>
                </div>
              </div>
            </div>

            <div class="fc-branch">
              <div class="fc-branch-label fc-yes">SÌ</div>
              <div class="fc-arrow">↓</div>
              <div class="fc-node fc-action" data-node="restadiation">
                <div class="fc-node-icon">▶</div>
                <div class="fc-node-body">
                  <div class="fc-node-title">→ Restadiazione</div>
                  <div class="fc-node-sub">CT + bone scan o PSMA PET · adattare piano terapeutico</div>
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
        <strong>Riferimenti:</strong> EAU 2026 Sect. 6.5.3, 7.4.2–7.4.5 — testosterone castration [1455,1456], metabolic syndrome [1463], DEXA [1471], CRPC definition [1218,1219]
      </div>
    </div>
  `;
}
