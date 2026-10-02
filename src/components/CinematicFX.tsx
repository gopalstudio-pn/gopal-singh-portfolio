import { useEffect, useState } from 'react';

const NOISE =
  'url("data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.9 0 0 0 -0.32'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
  ) +
  '")';

const initial = () => {
  try {
    const s = localStorage.getItem('fx');
    if (s) return s === '1';
  } catch {}
  const nav: any = navigator;
  const weak = (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) || (nav.deviceMemory && nav.deviceMemory <= 2);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return !(weak || reduce);
};

export const CinematicFX = () => {
  const [on, setOn] = useState(initial);

  useEffect(() => {
    try {
      localStorage.setItem('fx', on ? '1' : '0');
    } catch {}
  }, [on]);

  return (
    <>
      {on && (
        <>
          <div
            aria-hidden="true"
            className="fx-grain pointer-events-none fixed z-30"
            style={{ inset: '-20%', backgroundImage: NOISE, opacity: 0.07, animation: 'grainShift 0.9s steps(4) infinite' }}
          />
          <div
            aria-hidden="true"
            className="fx-leak pointer-events-none fixed inset-0 z-30"
            style={{
              background:
                'radial-gradient(circle at 12% 8%, rgba(255,170,80,0.14), transparent 50%), radial-gradient(circle at 92% 95%, rgba(212,175,55,0.12), transparent 50%)',
              animation: 'leakDrift 14s ease-in-out infinite alternate',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-30"
            style={{ background: 'radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.32) 100%)' }}
          />
        </>
      )}
      <button
        type="button"
        onClick={() => setOn(!on)}
        aria-label="Toggle cinematic effects"
        className="fixed bottom-4 left-4 z-[45] border border-[#8C6D4F]/50 bg-black/60 px-3 py-2 text-[9px] tracking-[0.3em] text-[#C4B29E]"
        style={{ cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}
      >
        FX {on ? 'ON' : 'OFF'}
      </button>
    </>
  );
};
