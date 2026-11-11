import { useState } from 'react';
import { ToolShell } from './components/ToolShell';

const mont = { fontFamily: "'Montserrat', sans-serif" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;

const MODES = [
  { id: 'short', label: 'SHORT SUMMARY' },
  { id: 'points', label: 'KEY POINTS' },
  { id: 'simple', label: 'SIMPLE WORDS' },
];
const LANGS = [
  { id: 'en', label: 'English' },
  { id: 'ne', label: 'नेपाली' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function SummarizerPage() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('short');
  const [lang, setLang] = useState('en');
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setBusy(true);
    setError('');
    setOut('');
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode, lang }),
      });
      const data: any = await res.json();
      if (data.success) setOut(data.summary);
      else setError(data.error || 'Something went wrong.');
    } catch {
      setError('Network problem. Please try again.');
    }
    setBusy(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const chip = (on: boolean) =>
    'border px-3 py-2 text-[10px] tracking-[0.25em] transition-colors ' +
    (on ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-[#8C6D4F]/50 text-[#EAD8C7] hover:border-[#D4AF37]');

  return (
    <ToolShell
      title="AI Document Summarizer"
      desc="Paste any article or document and get a short summary, key points or a simple explanation in English, Nepali or Hindi. Free AI tool."
    >
      <section className="pb-10 pt-4 text-center">
        <p className="text-[10px] tracking-[0.4em] text-[#C9A66B]" style={mont}>FREE AI TOOL · NO SIGN-UP</p>
        <h1 className="mt-5 text-[clamp(2.4rem,7vw,5rem)] uppercase leading-[0.9]" style={bebas}>
          <span className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] bg-clip-text text-transparent">AI summarizer</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm font-light text-white/50" style={mont}>
          Paste a long text. Get the main idea in seconds.
        </p>
      </section>

      <div className="mx-auto max-w-2xl space-y-4" style={mont}>
        <div className="border border-[#8C6D4F]/40 bg-white/[0.02] p-5 sm:p-6">
          <label htmlFor="doc" className="text-[10px] tracking-[0.3em] text-[#C9A66B]">PASTE YOUR TEXT</label>
          <textarea
            id="doc"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 6000))}
            rows={8}
            placeholder="Paste an article, email, notice or notes here…"
            className="mt-3 w-full border border-[#8C6D4F]/40 bg-transparent p-3 text-sm text-[#EAD8C7] outline-none focus:border-[#D4AF37]"
          />
          <p className="mt-1 text-right text-xs text-white/40">{text.length} / 6000</p>

          <p className="mt-4 text-[10px] tracking-[0.3em] text-[#C9A66B]">STYLE</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button key={m.id} type="button" onClick={() => setMode(m.id)} className={chip(mode === m.id)} style={{ cursor: 'pointer' }}>{m.label}</button>
            ))}
          </div>

          <p className="mt-4 text-[10px] tracking-[0.3em] text-[#C9A66B]">ANSWER LANGUAGE</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button key={l.id} type="button" onClick={() => setLang(l.id)} className={chip(lang === l.id)} style={{ cursor: 'pointer' }}>{l.label}</button>
            ))}
          </div>

          <button type="button" onClick={run} disabled={busy || text.trim().length < 50} className={chip(false) + ' mt-6 disabled:opacity-40'} style={{ cursor: 'pointer' }}>
            {busy ? 'THINKING…' : 'SUMMARIZE'}
          </button>
          {error ? <p className="mt-4 text-sm text-red-300/80">{error}</p> : null}
        </div>

        {out ? (
          <div className="border border-[#8C6D4F]/40 bg-white/[0.02] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] text-[#C9A66B]">RESULT</span>
              <button type="button" onClick={copy} className={chip(false)} style={{ cursor: 'pointer' }}>{copied ? 'COPIED ✓' : 'COPY'}</button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-[#EAD8C7]">{out}</p>
            <p className="mt-4 text-xs text-white/35">AI can make mistakes. Check important details.</p>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
