import { meta, calculate } from '../calculators/eau-bcr-risk.js';

export const tests = [
  ['meta: id and category', (e, m) => {
    e(m.id).toBe('eau-bcr-risk');
    e(m.category).toBe('risk-stratification');
  }],
  ['post-RP Low: ISUP<4 interval>18', (e, _, c) => {
    const r = c({ treatment: 'Radical Prostatectomy (RP)', isup: 3, interval: 24 });
    e(r.risk_group).toBe('EAU Low-Risk BCR');
  }],
  ['post-RP High: ISUP>=4', (e, _, c) => {
    const r = c({ treatment: 'Radical Prostatectomy (RP)', isup: 4, interval: 36 });
    e(r.risk_group).toBe('EAU High-Risk BCR');
  }],
  ['post-RP High: interval<=18', (e, _, c) => {
    const r = c({ treatment: 'Radical Prostatectomy (RP)', isup: 3, interval: 12 });
    e(r.risk_group).toBe('EAU High-Risk BCR');
  }],
  ['post-RT Low: ISUP<4 interval>18', (e, _, c) => {
    const r = c({ treatment: 'Radiotherapy (RT)', isup: 2, interval: 24 });
    e(r.risk_group).toBe('EAU Low-Risk BCR');
  }],
  ['post-RT High: ISUP>=4', (e, _, c) => {
    const r = c({ treatment: 'Radiotherapy (RT)', isup: 4, interval: 36 });
    e(r.risk_group).toBe('EAU High-Risk BCR');
  }],
  ['management non-empty', (e, _, c) => {
    const r = c({ treatment: 'Radiotherapy (RT)', isup: 3, interval: 24 });
    e(r.management.length).toBeGreaterThan(0);
  }],
  ['imaging non-empty', (e, _, c) => {
    const r = c({ treatment: 'Radical Prostatectomy (RP)', isup: 3, interval: 24 });
    e(r.imaging.length).toBeGreaterThan(0);
  }],
];