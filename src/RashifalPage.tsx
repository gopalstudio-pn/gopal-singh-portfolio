import { useState } from 'react';
import { ToolShell } from './components/ToolShell';

const mont = { fontFamily: "'Montserrat', sans-serif" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;

const SIGNS = [
  { id: 'mesh', ne: 'मेष', en: 'Aries', s: '♈' },
  { id: 'vrish', ne: 'वृष', en: 'Taurus', s: '♉' },
  { id: 'mithun', ne: 'मिथुन', en: 'Gemini', s: '♊' },
  { id: 'kark', ne: 'कर्क', en: 'Cancer', s: '♋' },
  { id: 'singh', ne: 'सिंह', en: 'Leo', s: '♌' },
  { id: 'kanya', ne: 'कन्या', en: 'Virgo', s: '♍' },
  { id: 'tula', ne: 'तुला', en: 'Libra', s: '♎' },
  { id: 'vrishchik', ne: 'वृश्चिक', en: 'Scorpio', s: '♏' },
  { id: 'dhanu', ne: 'धनु', en: 'Sagittarius', s: '♐' },
  { id: 'makar', ne: 'मकर', en: 'Capricorn', s: '♑' },
  { id: 'kumbh', ne: 'कुम्भ', en: 'Aquarius', s: '♒' },
  { id: 'meen', ne: 'मीन', en: 'Pisces', s: '♓' },
];

export default function RashifalPage() {
  const [lang, setLang] = useState<'ne' | 'en'>('ne');
  const [sign, setSign] = useState('');
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [meaning, setMeaning] = useState('');
  const [nameBusy, setNameBusy] = useState(false);
  const [nameError, setNameError] = useState('');

  const load = async (id: string, l: 'ne' | 'en') => {
    setSign(id);
    setBusy(true);
    setError('');
    setText('');
    try {
      const res = await fetch('/api/rashifal?sign=' + id + '&lang=' + l);
      const data: any = await res.json();
      if (data.success) {
        setText(data.text);
        setDate(data.date);
      } else setError(data.error || 'Something went wrong.');
    } catch {
      setError('Network problem. Please try again.');
    }
    setBusy(false);
  };

  const changeLang = (l: 'ne' | 'en') => {
    setLang(l);
    if (sign) load(sign, l);
  };

  const findName = async () => {
    setNameBusy(true);
    setNameError('');
    setMeaning('');
    try {
      const res = await fetch('/api/name-meaning?name=' + encodeURIComponent(name.trim()));
      const data: any = await res.json();
      if (data.success) setMeaning(data.text);
      else setNameError(data.error || 'Something went wrong.');
    } catch {
      setNameError('Network problem. Please try again.');
    }
    setNameBusy(false);
  };

  const chip = (on: boolean) =>
    'border px-3 py-2 text-[10px] tracking-[0.25em] transition-colors ' +
    (on ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-[#8C6D4F]/50 text-[#EAD8C7] hover:border-[#D4AF37]');

  const current = SIGNS.find((x) => x.id === sign);

  return (
    <ToolShell
      title="Daily Rashifal and Name Meaning"
      desc="Read your free daily rashifal in Nepali or English and find the meaning of any name. AI-written, for fun."
    >
      <section className="pb-10 pt-4 text-center">
        <p className="text-[10px] tracking-[0.4em] text-[#C9A66B]" style={mont}>FREE AI TOOL · FOR FUN</p>
        <h1 className="mt-5 text-[clamp(2.4rem,7vw,5rem)] uppercase leading-[0.9]" style={bebas}>
          <span className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] bg-clip-text text-transparent">Daily rashifal</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm font-light text-white/50" style={mont}>
          Pick your sign. Get today's reading.
        </p>
      </section>

      <div className="mx-auto max-w-2xl space-y-4" style={mont}>
        <div className="border border-[#8C6D4F]/40 bg-white/[0.02] p-5 sm:p-6">
          <div className="flex gap-2">
            <button type="button" onClick={() => changeLang('ne')} className={chip(lang === 'ne')} style={{ cursor: 'pointer' }}>नेपाली</button>
            <button type="button" onClick={() => changeLang('en')} className={chip(lang === 'en')} style={{ cursor: 'pointer' }}>English</button>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {SIGNS.map((x) => (
              <button key={x.id} type="button" onClick={() => load(x.id, lang)} className={chip(sign === x.id) + ' flex flex-col items-center gap-1 py-3'} style={{ cursor: 'pointer' }}>
                <span className="text-2xl">{x.s}</span>
                <span className="text-xs tracking-normal">{lang === 'ne' ? x.ne : x.en}</span>
              </button>
            ))}
          </div>
        </div>

        {busy ? <p className="text-center text-sm text-[#C9A66B]">Reading the stars…</p> : null}
        {error ? <p className="text-center text-sm text-red-300/80">{error}</p> : null}

        {text ? (
          <div className="border border-[#8C6D4F]/40 bg-white/[0.02] p-5 sm:p-6">
            <p className="text-[10px] tracking-[0.3em] text-[#C9A66B]">
              {current ? current.s + ' ' + current.en + ' · ' + current.ne : ''} · {date}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-[#EAD8C7]">{text}</p>
            <p className="mt-4 text-xs text-white/35">Written by AI for fun and entertainment. Not real astrology advice.</p>
          </div>
        ) : null}

        <div className="border border-[#8C6D4F]/40 bg-white/[0.02] p-5 sm:p-6">
          <label htmlFor="nm" className="text-[10px] tracking-[0.3em] text-[#C9A66B]">NAME MEANING</label>
          <input
            id="nm"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 40))}
            placeholder="Type any name, e.g. Gopal"
            className="mt-3 w-full border-b border-[#8C6D4F]/50 bg-transparent pb-2 text-2xl text-[#EAD8C7] outline-none focus:border-[#D4AF37]"
          />
          <button type="button" onClick={findName} disabled={nameBusy || name.trim().length < 2} className={chip(false) + ' mt-5 disabled:opacity-40'} style={{ cursor: 'pointer' }}>
            {nameBusy ? 'THINKING…' : 'FIND MEANING'}
          </button>
          {nameError ? <p className="mt-4 text-sm text-red-300/80">{nameError}</p> : null}
          {meaning ? (
            <>
              <p className="mt-5 whitespace-pre-wrap text-base leading-relaxed text-[#EAD8C7]">{meaning}</p>
              <p className="mt-3 text-xs text-white/35">AI can be wrong about name origins. Treat it as a fun guide.</p>
            </>
          ) : null}
        </div>
      </div>
    </ToolShell>
  );
}
