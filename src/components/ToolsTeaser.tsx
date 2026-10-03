import { useState } from 'react';
import { motion } from 'framer-motion';
import { BentoCard } from './BentoCard';
import { STYLES } from '../lib/fancyText';

const mont = { fontFamily: "'Montserrat', sans-serif" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;
const IDS = [['bscript', 'SCRIPT'], ['smallcaps', 'SMALL CAPS'], ['fraktur', 'FRAKTUR'], ['sansbold', 'BOLD']];
const CARDS = [
  ['STYLISH TEXT', '60 fancy styles for Instagram, WhatsApp and game names.', '/tools/name-studio#stylish'],
  ['NAME LOGO', 'Turn your name into a logo or a profile picture.', '/tools/name-studio#logo'],
  ['SIGNATURE', 'A handwritten signature, ready as a transparent PNG.', '/tools/name-studio#signature'],
];

export const ToolsTeaser = () => {
  const [name, setName] = useState('');
  const text = name.trim() || 'Gopal';
  const rows = IDS.map(([id, label]) => [label, STYLES.find((s) => s.id === id)?.fn(text) || text]);
  const href = '/tools/name-studio' + (name.trim() ? '?name=' + encodeURIComponent(name.trim()) : '');

  return (
    <section id="tools" data-zone="adaptive" className="relative w-full bg-black px-6 py-24 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          <p className="text-[10px] tracking-[0.35em] text-[#C9A66B]" style={mont}>FREE TOOLS</p>
          <h2 className="mt-4 text-[clamp(2.6rem,7vw,5rem)] uppercase leading-[0.9]" style={bebas}>
            <span className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] bg-clip-text text-transparent">Made to be useful</span>
          </h2>
          <p className="mt-4 max-w-md text-sm font-light text-white/50" style={mont}>Type your name and see it come alive. No sign-up, nothing to install.</p>
        </motion.div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <label htmlFor="teaser-name" className="sr-only">Your name</label>
            <input
              id="teaser-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              autoComplete="off"
              placeholder="Type your name"
              className="w-full border-0 border-b border-[#D4AF37]/40 bg-transparent py-4 text-2xl font-light tracking-[0.06em] text-[#EAD8C7] outline-none transition-colors placeholder:text-white/25 focus:border-[#D4AF37]"
              style={mont}
            />
            <a href={href} className="mt-8 inline-block border border-[#D4AF37]/50 px-6 py-3 text-[10px] tracking-[0.3em] text-[#EAD8C7] transition-colors hover:border-[#D4AF37] hover:text-white" style={mont}>
              SEE ALL 60 STYLES →
            </a>
          </div>
          <div>
            {rows.map(([label, out]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
                <span className="break-all text-2xl text-[#EAD8C7]">{out}</span>
                <span className="shrink-0 text-[9px] tracking-[0.3em] text-white/30" style={mont}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {CARDS.map(([t, d, h], i) => (
            <BentoCard key={t} delay={i * 0.06}>
              <a href={h} className="flex h-full flex-col gap-3">
                <span className="text-2xl tracking-[0.06em] text-[#EAD8C7]" style={bebas}>{t}</span>
                <span className="text-sm font-light leading-relaxed text-white/50" style={mont}>{d}</span>
                <span className="mt-auto pt-2 text-[10px] tracking-[0.3em] text-[#C9A66B]" style={mont}>OPEN →</span>
              </a>
            </BentoCard>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="/tools" className="text-[10px] tracking-[0.35em] text-[#C9A66B] transition-colors hover:text-[#EAD8C7]" style={mont}>VIEW ALL TOOLS →</a>
        </div>
      </div>
    </section>
  );
};
