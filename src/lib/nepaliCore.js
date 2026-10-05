const EN_M = ['Baisakh', 'Jestha', 'Asar', 'Shrawan', 'Bhadra', 'Asoj', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
const NE_M = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फागुन', 'चैत'];
const EN_W = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const NE_W = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
const DAY = 86400000;

const nd = (v) => String(v).replace(/[0-9]/g, (c) => '०१२३४५६७८९'[+c]);

export function makeCalendar(data, opts = {}) {
  const minYear = 2000;
  const maxYear = opts.maxYear || 2090;
  const provisionalFrom = opts.provisionalFrom || 2084;
  const rows = {};
  const starts = {};
  let acc = 0;
  for (let y = minYear; y <= maxYear; y++) {
    const r = data[y] || data[String(y)];
    if (!Array.isArray(r) || r.length !== 12 || r.some((n) => !Number.isInteger(n) || n < 29 || n > 32)) throw new Error('Bad calendar row for BS ' + y);
    rows[y] = r;
    starts[y] = acc;
    acc += r.reduce((a, b) => a + b, 0);
  }
  const total = acc;
  const epochDay = Math.round(Date.UTC(1943, 3, 14) / DAY);

  const daysInBsMonth = (y, m) => {
    if (!rows[y] || m < 1 || m > 12) throw new RangeError('BS date out of range');
    return rows[y][m - 1];
  };
  const isoToAd = (s) => {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(s).trim());
    if (!m) throw new TypeError('Bad date');
    return { year: +m[1], month: +m[2], day: +m[3] };
  };
  const toAd = (bs) => {
    const { year: y, month: m, day: d } = bs;
    if (!rows[y]) throw new RangeError('BS year out of range');
    if (!Number.isInteger(m) || m < 1 || m > 12 || !Number.isInteger(d) || d < 1 || d > rows[y][m - 1]) throw new RangeError('Not a real BS date');
    let off = starts[y];
    for (let i = 0; i < m - 1; i++) off += rows[y][i];
    off += d - 1;
    const dt = new Date((epochDay + off) * DAY);
    return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate() };
  };
  const toBs = (adIn) => {
    const ad = typeof adIn === 'string' ? isoToAd(adIn) : adIn;
    const dayNum = Math.round(Date.UTC(ad.year, ad.month - 1, ad.day) / DAY);
    let off = dayNum - epochDay;
    if (!(off >= 0 && off < total)) throw new RangeError('AD date out of range');
    let lo = minYear;
    let hi = maxYear;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= off) lo = mid;
      else hi = mid - 1;
    }
    const y = lo;
    off -= starts[y];
    let m = 0;
    while (off >= rows[y][m]) {
      off -= rows[y][m];
      m++;
    }
    return { year: y, month: m + 1, day: off + 1 };
  };
  const adNepal = () => {
    const s = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    return isoToAd(s);
  };
  const today = () => toBs(adNepal());
  const getYearStatus = (y) => (y < minYear || y > maxYear ? undefined : y >= provisionalFrom ? 'provisional' : 'verified');
  const getMonthName = (m, o = {}) => (o.locale === 'ne' ? NE_M : EN_M)[m - 1];
  const format = (bs, pattern = 'YYYY-MM-DD', o = {}) => {
    const ne = o.locale === 'ne';
    const num = (v) => (ne ? nd(v) : String(v));
    const ad = toAd(bs);
    const wd = new Date(Date.UTC(ad.year, ad.month - 1, ad.day)).getUTCDay();
    return pattern.replace(/YYYY|MMMM|dddd|MM|DD|D/g, (t) => {
      if (t === 'YYYY') return num(bs.year);
      if (t === 'MMMM') return getMonthName(bs.month, o);
      if (t === 'dddd') return (ne ? NE_W : EN_W)[wd];
      if (t === 'MM') return num(String(bs.month).padStart(2, '0'));
      if (t === 'DD') return num(String(bs.day).padStart(2, '0'));
      return num(bs.day);
    });
  };
  const range = { min: { year: minYear, month: 1, day: 1 }, max: { year: maxYear, month: 12, day: rows[maxYear][11] } };
  return { toAd, toBs, today, daysInBsMonth, getYearStatus, getMonthName, format, getSupportedRange: () => range, total };
}
