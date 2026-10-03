import { useMemo, useState } from 'react';
import { CATS, STYLES } from '../lib/fancyText';

const mont = { fontFamily: "'Montserrat', sans-serif" } as const;

export const StylishTab = ({ name }: { name: string }) => {
  const [cat, setCat] = useState('all');
  const [copied, setCopied] = useState('');
  const text = name.trim() || 'Your Name';

  const items = useMemo(
    () => STYLES.filter((s) => cat === 'all' || s.cat === cat).map((s) => ({ id: s.id, label: s.label, out: s.fn(text) })),
    [cat, text]
  );

  const copy = async (id: string, out: string) => {
    try {
      await navigator.clipboard.writeText(out);
    } catch {
      const t = document.createElement('textarea');
      t.value = out;
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand('copy');
      } catch {}
      document.body.removeChild(t);
    }
    setCopied(id);
    window.setTimeout(() => setCopied((c) => (c === id ? '' : c)), 1600);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2" style={mont}>
        {CATS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setCat(id)}
            className={'border px-4 py-2 text-[10px] tracking-[0.25em] transition-colors ' + (cat === id ? 'border-[#D4AF37] text-[#EAD8C7]' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70')}
            style={{ cursor: 'pointer' }}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-5 text-center text-[10px] tracking-[0.3em] text-white/30" style={mont}>
        {items.length} STYLES · TAP ANY CARD TO COPY
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => copy(it.id, it.out)}
            className="group relative rounded-xl border border-white/10 bg-white/[0.02] p-5 text-left transition-colors duration-300 hover:border-[#D4AF37]/50 hover:bg-white/[0.04]"
            style={{ cursor: 'pointer' }}
          >
            <span className="flex items-center justify-between" style={mont}>
              <span className="text-[9px] tracking-[0.3em] text-white/35">{it.label.toUpperCase()}</span>
              <span className={'text-[9px] tracking-[0.25em] transition-colors ' + (copied === it.id ? 'text-[#D4AF37]' : 'text-white/30 group-hover:text-[#C9A66B]')}>
                {copied === it.id ? 'COPIED ✓' : 'COPY'}
              </span>
            </span>
            <span className="mt-3 block break-words text-[1.35rem] leading-snug text-[#EAD8C7]">{it.out}</span>
          </button>
        ))}
      </div>
      {!name.trim() && (
        <p className="mt-8 text-center text-xs font-light text-white/40" style={mont}>
          Type your name above to see it in every style.
        </p>
      )}
    </div>
  );
};
