import { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ToolShell } from './components/ToolShell';
import { StylishTab } from './components/StylishTab';

const LogoTab = lazy(() => import('./components/LogoTab'));
const SignatureTab = lazy(() => import('./components/SignatureTab'));

const TABS = [
  ['stylish', 'STYLISH TEXT'],
  ['logo', 'NAME LOGO'],
  ['signature', 'SIGNATURE'],
];

const readTab = () => {
  const h = window.location.hash.replace('#', '');
  return TABS.some((t) => t[0] === h) ? h : 'stylish';
};

const mont = { fontFamily: "'Montserrat', sans-serif" } as const;

export default function NameStudioPage() {
  const [tab, setTab] = useState<string>(readTab);
  const [name, setName] = useState(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('name');
      if (q) return q.slice(0, 24);
      return localStorage.getItem('nsName') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nsName', name);
    } catch {}
  }, [name]);

  const go = (t: string) => {
    setTab(t);
    history.replaceState(null, '', '#' + t);
  };

  return (
    <ToolShell title="Name Studio" desc="Free stylish name generator, name logo maker and signature maker. No sign-up needed.">
      <section className="pb-8 pt-4 text-center">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-[10px] tracking-[0.4em] text-[#C9A66B]" style={mont}>
          NAME STUDIO · FREE · NO SIGN-UP
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-[clamp(2.6rem,8vw,5.5rem)] uppercase leading-[0.9]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          <span className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] bg-clip-text text-transparent">Make your name unforgettable</span>
        </motion.h1>
        <p className="mx-auto mt-5 max-w-md text-sm font-light text-white/50" style={mont}>
          Stylish fonts, logos and signatures. Type your name once and use it everywhere.
        </p>
      </section>

      <div className="mx-auto max-w-xl">
        <label htmlFor="ns-name" className="sr-only">Your name</label>
        <input
          id="ns-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          autoComplete="off"
          spellCheck={false}
          placeholder="Type your name"
          className="w-full border-0 border-b border-[#D4AF37]/40 bg-transparent py-4 text-center text-3xl font-light tracking-[0.06em] text-[#EAD8C7] outline-none transition-colors placeholder:text-white/20 focus:border-[#D4AF37]"
          style={mont}
        />
      </div>

      <div role="tablist" className="mx-auto mt-10 flex max-w-xl justify-center gap-1 border-b border-white/10" style={mont}>
        {TABS.map(([id, label]) => (
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
            {tab === id && <motion.span layoutId="ns-tab" className="absolute inset-x-3 -bottom-px h-px bg-[#D4AF37]" />}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <Suspense fallback={<div className="h-64" />}>
          {tab === 'stylish' && <StylishTab name={name} />}
          {tab === 'logo' && <LogoTab name={name} />}
          {tab === 'signature' && <SignatureTab name={name} />}
        </Suspense>
      </div>
    </ToolShell>
  );
}
