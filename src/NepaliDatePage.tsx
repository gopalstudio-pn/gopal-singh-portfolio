import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ToolShell } from './components/ToolShell';
import { daysInBsMonth, format, getMonthName, getSupportedRange, getYearStatus, toAd, toBs, today } from './lib/nepaliDate';

type D = { year: number; month: number; day: number };

const mont = { fontFamily: "'Montserrat', sans-serif" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;
const OUT = 'That date is outside the supported range (BS 2000 to 2090).';

const pad = (n: number) => String(n).padStart(2, '0');
const isoOf = (d: D) => d.year + '-' + pad(d.month) + '-' + pad(d.day);
const parseIso = (s: string): D | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? { year: +m[1], month: +m[2], day: +m[3] } : null;
};
const ms = (d: D) => Date.UTC(d.year, d.month - 1, d.day);
const diffDays = (a: D, b: D) => Math.round((ms(b) - ms(a)) / 86400000);
const adLong = (d: D) => new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(ms(d)));
const weekdayOf = (d: D) => new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' }).format(new Date(ms(d)));
const nowBs = () => today() as D;
const nowAd = () => toAd(nowBs()) as D;
const bsNe = (d: D, p = 'D MMMM YYYY, dddd') => format(d, p, { locale: 'ne' });
const bsEn = (d: D, p = 'D MMMM YYYY, dddd') => format(d, p);
const when = (n: number) =>
  n === 0 ? 'Today' : n > 0 ? 'In ' + n.toLocaleString('en-US') + (n === 1 ? ' day' : ' days') : Math.abs(n).toLocaleString('en-US') + (n === -1 ? ' day ago' : ' days ago');

const RANGE = (() => {
  const r: any = getSupportedRange();
  return { min: r.min as D, max: r.max as D };
})();
const AD_LIMITS = { min: isoOf(toAd(RANGE.min) as D), max: isoOf(toAd(RANGE.max) as D) };

const ymd = (a: D, b: D, prevDays: (y: number, m: number) => number) => {
  let y = b.year - a.year;
  let m = b.month - a.month;
  let d = b.day - a.day;
  if (d < 0) {
    m--;
    const py = b.month === 1 ? b.year - 1 : b.year;
    const pm = b.month === 1 ? 12 : b.month - 1;
    d += prevDays(py, pm);
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  return { y, m, d };
};

const Copy = ({ text }: { text: string }) => {
  const [done, setDone] = useState(false);
  const go = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement('textarea');
      t.value = text;
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand('copy');
      } catch {}
      document.body.removeChild(t);
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1500);
  };
  return (
    <button type="button" onClick={go} className={'text-[9px] tracking-[0.25em] transition-colors ' + (done ? 'text-[#D4AF37]' : 'text-white/30 hover:text-[#C9A66B]')} style={{ cursor: 'pointer', ...mont }}>
      {done ? 'COPIED ✓' : 'COPY'}
    </button>
  );
};

const Line = ({ label, text, big }: { label: string; text: string; big?: boolean }) => (
  <div className="border-b border-white/10 py-4 last:border-0">
    <div className="flex items-center justify-between" style={mont}>
      <span className="text-[9px] tracking-[0.3em] text-white/35">{label}</span>
      <Copy text={text} />
    </div>
    <p className={'mt-2 break-words text-[#EAD8C7] ' + (big ? 'text-2xl' : 'text-lg font-light')}>{text}</p>
  </div>
);

const Pills = ({ items, value, onChange }: { items: [string, string][]; value: string; onChange: (v: any) => void }) => (
  <div className="flex gap-2" style={mont}>
    {items.map(([id, label]) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        className={'border px-4 py-2 text-[10px] tracking-[0.25em] transition-colors ' + (value === id ? 'border-[#D4AF37] text-[#EAD8C7]' : 'border-white/10 text-white/40 hover:border-white/30')}
        style={{ cursor: 'pointer' }}
      >
        {label}
      </button>
    ))}
  </div>
);

const fieldCls = 'w-full appearance-none border-0 border-b border-white/20 bg-transparent py-3 text-lg font-light text-[#EAD8C7] outline-none transition-colors focus:border-[#D4AF37]';
const tiny = 'text-[9px] tracking-[0.3em] text-white/35';

const AdInput = ({ value, onChange, max }: { value: string; onChange: (v: string) => void; max?: string }) => (
  <input type="date" value={value} min={AD_LIMITS.min} max={max || AD_LIMITS.max} onChange={(e) => onChange(e.target.value)} className={fieldCls} style={{ ...mont, colorScheme: 'dark' }} />
);

const BsPicker = ({ value, onChange }: { value: D; onChange: (d: D) => void }) => {
  const years: number[] = [];
  for (let y = RANGE.max.year; y >= RANGE.min.year; y--) years.push(y);
  const dim = daysInBsMonth(value.year, value.month);
  const set = (p: Partial<D>) => {
    const next = { ...value, ...p };
    const max = daysInBsMonth(next.year, next.month);
    if (next.day > max) next.day = max;
    onChange(next);
  };
  return (
    <div className="grid grid-cols-[1fr_1.6fr_0.8fr] gap-4" style={mont}>
      <label>
        <span className={tiny}>YEAR</span>
        <select value={value.year} onChange={(e) => set({ year: +e.target.value })} className={fieldCls} style={{ colorScheme: 'dark' }}>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </label>
      <label>
        <span className={tiny}>MONTH</span>
        <select value={value.month} onChange={(e) => set({ month: +e.target.value })} className={fieldCls} style={{ colorScheme: 'dark' }}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{getMonthName(m) + ' · ' + getMonthName(m, { locale: 'ne' })}</option>
          ))}
        </select>
      </label>
      <label>
        <span className={tiny}>DAY</span>
        <select value={value.day} onChange={(e) => set({ day: +e.target.value })} className={fieldCls} style={{ colorScheme: 'dark' }}>
          {Array.from({ length: dim }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

const Provisional = ({ year }: { year: number }) =>
  getYearStatus(year) === 'provisional' ? (
    <p className="mt-4 text-xs font-light leading-relaxed text-[#C9A66B]" style={mont}>
      BS {year} is not officially published yet, so this date may shift by a day.
    </p>
  ) : null;

const Converter = ({ todayBs, todayAd }: { todayBs: D; todayAd: D }) => {
  const [mode, setMode] = useState<'ad' | 'bs'>('ad');
  const [adIso, setAdIso] = useState(isoOf(todayAd));
  const [bs, setBs] = useState<D>(todayBs);

  const res = useMemo(() => {
    try {
      if (mode === 'ad') {
        const ad = parseIso(adIso);
        if (!ad) return null;
        return { bs: toBs(adIso) as D, ad };
      }
      return { bs, ad: toAd(bs) as D };
    } catch {
      return { error: OUT } as { error: string };
    }
  }, [mode, adIso, bs]);

  return (
    <div>
      <Pills items={[['ad', 'AD → BS'], ['bs', 'BS → AD']]} value={mode} onChange={setMode} />
      <div className="mt-8 max-w-xl">
        {mode === 'ad' ? (
          <label>
            <span className={tiny} style={mont}>ENGLISH DATE (AD)</span>
            <AdInput value={adIso} onChange={setAdIso} />
          </label>
        ) : (
          <BsPicker value={bs} onChange={setBs} />
        )}
      </div>

      {res && 'error' in res && <p className="mt-8 text-sm text-[#E0A38F]" style={mont}>{res.error}</p>}
      {res && !('error' in res) && (
        <div className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[10px] tracking-[0.35em] text-[#C9A66B]" style={mont}>BIKRAM SAMBAT</p>
              <Line label="NEPALI" text={bsNe(res.bs)} big />
              <Line label="ENGLISH LETTERS" text={bsEn(res.bs)} />
              <Line label="NUMBERS" text={bsEn(res.bs, 'YYYY-MM-DD')} />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[10px] tracking-[0.35em] text-[#C9A66B]" style={mont}>GREGORIAN (AD)</p>
              <Line label="DATE" text={adLong(res.ad)} big />
              <Line label="NUMBERS" text={isoOf(res.ad)} />
              <Line label="FROM TODAY" text={when(diffDays(todayAd, res.ad))} />
            </div>
          </div>
          <Provisional year={res.bs.year} />
        </div>
      )}
    </div>
  );
};

const Age = ({ todayBs, todayAd }: { todayBs: D; todayAd: D }) => {
  const [mode, setMode] = useState<'ad' | 'bs'>('ad');
  const [adIso, setAdIso] = useState('');
  const [bs, setBs] = useState<D>({ year: todayBs.year - 20, month: 1, day: 1 });

  const r = useMemo(() => {
    try {
      let dob: D;
      if (mode === 'ad') {
        const p = parseIso(adIso);
        if (!p) return null;
        dob = p;
      } else dob = toAd(bs) as D;
      if (ms(dob) > ms(todayAd)) return { error: 'That date is in the future.' } as { error: string };
      const a = ymd(dob, todayAd, (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate());
      const dobBs = toBs(isoOf(dob)) as D;
      const b = ymd(dobBs, todayBs, daysInBsMonth);
      const cand = (y: number): D => {
        const dt = new Date(Date.UTC(y, dob.month - 1, dob.day));
        return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate() };
      };
      let nbd = cand(todayAd.year);
      if (diffDays(todayAd, nbd) < 0) nbd = cand(todayAd.year + 1);
      let nbBs = '';
      try {
        nbBs = bsNe(toBs(isoOf(nbd)) as D);
      } catch {}
      return { a, b, total: diffDays(dob, todayAd), left: diffDays(todayAd, nbd), nbd, nbBs, born: weekdayOf(dob) };
    } catch {
      return { error: OUT } as { error: string };
    }
  }, [mode, adIso, bs, todayAd, todayBs]);

  return (
    <div>
      <Pills items={[['ad', 'BIRTH DATE IN AD'], ['bs', 'BIRTH DATE IN BS']]} value={mode} onChange={setMode} />
      <div className="mt-8 max-w-xl">
        {mode === 'ad' ? (
          <label>
            <span className={tiny} style={mont}>DATE OF BIRTH (AD)</span>
            <AdInput value={adIso} onChange={setAdIso} max={isoOf(todayAd)} />
          </label>
        ) : (
          <BsPicker value={bs} onChange={setBs} />
        )}
      </div>

      {!r && <p className="mt-8 text-sm font-light text-white/40" style={mont}>Choose a date of birth to see your exact age.</p>}
      {r && 'error' in r && <p className="mt-8 text-sm text-[#E0A38F]" style={mont}>{r.error}</p>}
      {r && !('error' in r) && (
        <div className="mt-8">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              {[['YEARS', r.a.y], ['MONTHS', r.a.m], ['DAYS', r.a.d]].map(([l, v]) => (
                <div key={l}>
                  <p className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#7A5A2A] bg-clip-text text-5xl text-transparent sm:text-7xl" style={bebas}>{v}</p>
                  <p className="mt-2 text-[9px] tracking-[0.3em] text-white/35" style={mont}>{l}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs font-light text-white/50" style={mont}>
              In Bikram Sambat: {r.b.y} years, {r.b.m} months, {r.b.d} days
            </p>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className={tiny} style={mont}>TOTAL DAYS LIVED</p>
              <p className="mt-2 text-2xl text-[#EAD8C7]">{r.total.toLocaleString('en-US')}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className={tiny} style={mont}>BORN ON A</p>
              <p className="mt-2 text-2xl text-[#EAD8C7]">{r.born}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className={tiny} style={mont}>NEXT BIRTHDAY</p>
              <p className="mt-2 text-2xl text-[#EAD8C7]">{r.left === 0 ? 'Today! 🎉' : when(r.left)}</p>
              <p className="mt-1 text-xs font-light text-white/40" style={mont}>{adLong(r.nbd) + (r.nbBs ? ' · ' + r.nbBs : '')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function NepaliDatePage() {
  const [tab, setTab] = useState(() => (window.location.hash === '#age' ? 'age' : 'converter'));
  const todayBs = useMemo(() => nowBs(), []);
  const todayAd = useMemo(() => nowAd(), []);
  const go = (t: string) => {
    setTab(t);
    history.replaceState(null, '', '#' + t);
  };

  return (
    <ToolShell title="Nepali Date Converter" desc="Free Nepali date converter: Bikram Sambat to English dates and back, today's Nepali date and an exact age calculator.">
      <section className="pb-8 pt-4 text-center">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-[10px] tracking-[0.4em] text-[#C9A66B]" style={mont}>
          NEPALI DATE TOOLS · FREE
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-[clamp(2.6rem,8vw,5.5rem)] uppercase leading-[0.9]"
          style={bebas}
        >
          <span className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] bg-clip-text text-transparent">Nepali date converter</span>
        </motion.h1>
        <p className="mx-auto mt-5 max-w-md text-sm font-light text-white/50" style={mont}>BS and AD dates, today in Nepal, and your exact age. Fast, free and private.</p>
      </section>

      <div className="mx-auto max-w-2xl rounded-xl border border-[#D4AF37]/30 bg-white/[0.02] p-6 text-center sm:p-8">
        <p className="text-[10px] tracking-[0.4em] text-[#C9A66B]" style={mont}>आज · TODAY IN NEPAL</p>
        <p className="mt-4 text-3xl text-[#EAD8C7] sm:text-4xl">{bsNe(todayBs, 'dddd, D MMMM YYYY')}</p>
        <p className="mt-3 text-sm font-light text-white/50" style={mont}>{bsEn(todayBs, 'dddd, D MMMM YYYY') + ' BS'}</p>
        <p className="mt-1 text-sm font-light text-white/35" style={mont}>{adLong(todayAd)}</p>
      </div>

      <div role="tablist" className="mx-auto mt-12 flex max-w-xl justify-center gap-1 border-b border-white/10" style={mont}>
        {[['converter', 'CONVERTER'], ['age', 'AGE CALCULATOR']].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            type="button"
            onClick={() => go(id)}
            className={'relative px-4 py-3 text-[10px] tracking-[0.3em] transition-colors sm:px-6 ' + (tab === id ? 'text-[#EAD8C7]' : 'text-white/40 hover:text-white/70')}
            style={{ cursor: 'pointer' }}
          >
            {label}
            {tab === id && <motion.span layoutId="nd-tab" className="absolute inset-x-3 -bottom-px h-px bg-[#D4AF37]" />}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl">{tab === 'converter' ? <Converter todayBs={todayBs} todayAd={todayAd} /> : <Age todayBs={todayBs} todayAd={todayAd} />}</div>

      <p className="mx-auto mt-14 max-w-xl text-center text-[11px] font-light leading-relaxed text-white/30" style={mont}>
        Covers BS 2000 to 2090. The official calendar is published about a year ahead, so dates from BS 2084 on are provisional and may shift by a day.
      </p>
    </ToolShell>
  );
}
