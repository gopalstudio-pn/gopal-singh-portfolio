import fs from 'node:fs';
const out = {};
const mod = await import('@sonill/nepali-dates');
const get = mod.getCalendarData || (mod.default && mod.default.getCalendarData);
if (typeof get !== 'function') {
  console.log('=== COULD NOT READ THE CALENDAR PACKAGE ===');
  process.exit(1);
}
for (let y = 2000; y <= 2090; y++) out[y] = get(y);
// Correction: the package has Asoj 2083 = 30 and Mangsir 2083 = 30.
// Hamro Patro and other published calendars have Asoj 31 and Mangsir 29 (same 365-day year).
out[2083] = [31, 31, 32, 31, 31, 31, 30, 29, 29, 30, 30, 30];
fs.writeFileSync('src/lib/bsData.json', JSON.stringify(out));
console.log('calendar data written (91 years, BS 2083 corrected)');
