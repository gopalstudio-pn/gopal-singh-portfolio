import fs from 'node:fs';
import { makeCalendar } from '../src/lib/nepaliCore.js';
const data = JSON.parse(fs.readFileSync('src/lib/bsData.json', 'utf8'));
let cal;
try {
  cal = makeCalendar(data);
} catch (e) {
  console.log('=== DATE DATA CHECK FAILED: ' + e.message + ' ===');
  process.exit(1);
}
const same = (a, b) => a.year === b.year && a.month === b.month && a.day === b.day;
const B = (year, month, day) => ({ year, month, day });
const cases = [
  ['BS 2000-01-01', cal.toAd(B(2000, 1, 1)), B(1943, 4, 14)],
  ['BS 2078-01-01', cal.toAd(B(2078, 1, 1)), B(2021, 4, 14)],
  ['BS 2079-01-01', cal.toAd(B(2079, 1, 1)), B(2022, 4, 14)],
  ['BS 2080-01-01', cal.toAd(B(2080, 1, 1)), B(2023, 4, 14)],
  ['BS 2081-01-01', cal.toAd(B(2081, 1, 1)), B(2024, 4, 13)],
  ['BS 2082-01-01', cal.toAd(B(2082, 1, 1)), B(2025, 4, 14)],
  ['BS 2083-01-01', cal.toAd(B(2083, 1, 1)), B(2026, 4, 14)],
  ['AD 2024-04-13', cal.toBs('2024-04-13'), B(2081, 1, 1)],
  ['AD 2026-08-18', cal.toBs('2026-08-18'), B(2083, 5, 2)],
  ['AD 2026-10-01', cal.toBs('2026-10-01'), B(2083, 6, 15)],
  ['BS 2083-06-31', cal.toAd(B(2083, 6, 31)), B(2026, 10, 17)],
  ['BS 2083-07-01', cal.toAd(B(2083, 7, 1)), B(2026, 10, 18)],
  ['BS 2083-07-29', cal.toAd(B(2083, 7, 29)), B(2026, 11, 15)],
  ['BS 2083-08-01', cal.toAd(B(2083, 8, 1)), B(2026, 11, 17)],
  ['BS 2083-08-28', cal.toAd(B(2083, 8, 28)), B(2026, 12, 14)],
  ['BS 2083-09-01', cal.toAd(B(2083, 9, 1)), B(2026, 12, 16)],
  ['BS 2083-09-09', cal.toAd(B(2083, 9, 9)), B(2026, 12, 24)],
  ['BS 2084-01-01', cal.toAd(B(2084, 1, 1)), B(2027, 4, 14)],
];
let bad = 0;
for (const [name, got, want] of cases) {
  if (!same(got, want)) {
    bad++;
    console.log('MISMATCH ' + name + ' got ' + JSON.stringify(got) + ' expected ' + JSON.stringify(want));
  }
}
if (bad) {
  console.log('=== DATE DATA CHECK FAILED (' + bad + ' of ' + cases.length + ') ===');
  process.exit(1);
}
console.log('today in Nepal (BS): ' + cal.format(cal.today(), 'D MMMM YYYY, dddd'));
console.log('=== DATE DATA CHECK PASSED (' + cases.length + ' known dates) ===');
