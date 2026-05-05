import { describe, it, expect } from 'vitest';
import { meta, calculate } from '../calculators/eau-bcr-risk.js';

describe('EAU BCR Risk Stratification', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('eau-bcr-risk');
    expect(meta.category).toBe('risk-stratification');
  });

  it('post-RP: Low Risk (ISUP < 4 and interval > 18)', () => {
    const r = calculate({ treatment: 'Radical Prostatectomy (RP)', isup: 3, interval: 24 });
    expect(r.risk_group).toBe('EAU Low-Risk BCR');
  });

  it('post-RP: High Risk (ISUP >= 4)', () => {
    const r = calculate({ treatment: 'Radical Prostatectomy (RP)', isup: 4, interval: 36 });
    expect(r.risk_group).toBe('EAU High-Risk BCR');
  });

  it('post-RP: High Risk (interval <= 18)', () => {
    const r = calculate({ treatment: 'Radical Prostatectomy (RP)', isup: 3, interval: 12 });
    expect(r.risk_group).toBe('EAU High-Risk BCR');
  });

  it('post-RT: Low Risk (ISUP < 4 and interval > 18)', () => {
    const r = calculate({ treatment: 'Radiotherapy (RT)', isup: 2, interval: 24 });
    expect(r.risk_group).toBe('EAU Low-Risk BCR');
  });

  it('post-RT: High Risk (ISUP >= 4)', () => {
    const r = calculate({ treatment: 'Radiotherapy (RT)', isup: 4, interval: 36 });
    expect(r.risk_group).toBe('EAU High-Risk BCR');
  });

  it('provides management recommendation', () => {
    const r = calculate({ treatment: 'Radiotherapy (RT)', isup: 3, interval: 24 });
    expect(r.management).toBeDefined();
    expect(r.management.length).toBeGreaterThan(0);
  });

  it('provides imaging recommendation', () => {
    const r = calculate({ treatment: 'Radical Prostatectomy (RP)', isup: 3, interval: 24 });
    expect(r.imaging).toBeDefined();
    expect(r.imaging.length).toBeGreaterThan(0);
  });
});
