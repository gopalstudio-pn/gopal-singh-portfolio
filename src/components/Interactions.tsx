import { useEffect, useMemo, useRef, useState } from 'react';

const isCoarse = () => window.matchMedia('(pointer: coarse)').matches;
const isReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const CursorGlow = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isCoarse() || isReduced()) return;
    const el = ref.current;
    if (!el) return;
    let x = -500, y = -500, tx = -500, ty = -500, raf = 0, shown = false;
    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      el.style.transform = 'translate3d(' + (x - 250) + 'px,' + (y - 250) + 'px,0)';
      if (Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        el.style.opacity = '1';
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    document.addEventListener('pointermove', move, { passive: true });
    return () => {
      document.removeEventListener('pointermove', move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[31] h-[500px] w-[500px] rounded-full"
      style={{ opacity: 0, transition: 'opacity .6s', willChange: 'transform', background: 'radial-gradient(circle, rgba(212,175,55,0.10), transparent 62%)' }}
    />
  );
};

export const Magnetic = () => {
  useEffect(() => {
    if (isCoarse() || isReduced()) return;
    let active: HTMLElement | null = null;
    const reset = (el: HTMLElement | null) => {
      if (!el) return;
      const from = el.style.translate || '0px 0px';
      el.style.translate = '';
      try {
        el.animate([{ translate: from }, { translate: '0px 0px' }] as any, { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' });
      } catch {}
    };
    const move = (e: PointerEvent) => {
      const t = ((e.target as HTMLElement).closest?.('[data-magnetic]') as HTMLElement | null) || null;
      if (t !== active) {
        reset(active);
        active = t;
      }
      if (!t) return;
      const r = t.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
      t.style.translate = dx + 'px ' + dy + 'px';
    };
    const leave = () => {
      reset(active);
      active = null;
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);
  return null;
};

export const PageCurtain = () => {
  const [state, setState] = useState<'idle' | 'covering' | 'revealing'>(() => {
    try {
      return sessionStorage.getItem('curtain') === '1' ? 'revealing' : 'idle';
    } catch {
      return 'idle';
    }
  });

  useEffect(() => {
    try {
      sessionStorage.removeItem('curtain');
    } catch {}
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (isReduced()) return;
      const a = (e.target as HTMLElement).closest?.('a') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/api')) return;
      if (/\.(pdf|png|jpe?g|webp|mp4)$/i.test(href)) return;
      if (href === window.location.pathname) return;
      e.preventDefault();
      try {
        sessionStorage.setItem('curtain', '1');
      } catch {}
      setState('covering');
      window.setTimeout(() => window.location.assign(href), 560);
    };
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setState('idle');
    };
    document.addEventListener('click', onClick);
    window.addEventListener('pageshow', onShow);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('pageshow', onShow);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[120]"
      style={{
        display: state === 'idle' ? 'none' : 'block',
        pointerEvents: state === 'covering' ? 'auto' : 'none',
        background: '#050403',
        animation:
          state === 'covering'
            ? 'curtainIn .55s cubic-bezier(.76,0,.24,1) forwards'
            : state === 'revealing'
            ? 'curtainOut .8s cubic-bezier(.76,0,.24,1) forwards'
            : 'none',
      }}
      onAnimationEnd={() => {
        if (state === 'revealing') setState('idle');
      }}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, opacity: 0.6, background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
    </div>
  );
};

export const EasterEgg = () => {
  const [show, setShow] = useState(false);
  const sparks = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const d = 90 + Math.random() * 180;
        return { x: Math.cos(a) * d, y: Math.sin(a) * d, s: 3 + Math.random() * 5, dl: Math.random() * 0.25 };
      }),
    []
  );

  useEffect(() => {
    let buf = '';
    let taps: number[] = [];
    const key = (e: KeyboardEvent) => {
      if (/input|textarea/i.test((e.target as HTMLElement).tagName)) return;
      buf = (buf + e.key.toLowerCase()).slice(-5);
      if (buf === 'gopal') setShow(true);
    };
    const click = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest?.('[data-egg]')) return;
      const now = Date.now();
      taps = taps.filter((t) => now - t < 2500);
      taps.push(now);
      if (taps.length >= 5) {
        taps = [];
        setShow(true);
      }
    };
    document.addEventListener('keydown', key);
    document.addEventListener('click', click);
    return () => {
      document.removeEventListener('keydown', key);
      document.removeEventListener('click', click);
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 4200);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;
  return (
    <div
      onClick={() => setShow(false)}
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/85"
      style={{ animation: 'eggIn .6s ease-out both' }}
    >
      <div className="relative flex flex-col items-center text-center">
        {sparks.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#D4AF37]"
            style={{ width: p.s, height: p.s, ['--x' as any]: p.x + 'px', ['--y' as any]: p.y + 'px', animation: 'spark 1.6s ease-out ' + p.dl + 's both' }}
          />
        ))}
        <p className="relative text-[10px] tracking-[0.5em] text-[#D4AF37]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          SECRET UNLOCKED
        </p>
        <h2 className="relative mt-3 text-5xl text-[#EAD8C7] sm:text-7xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em' }}>
          STAY CURIOUS
        </h2>
        <p className="relative mt-2 text-xs tracking-[0.4em] text-[#C4B29E]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          KEEP CREATING ✦
        </p>
      </div>
    </div>
  );
};

export const NameMarquee = () => {
  const item = 'GOPAL SINGH  ✦  CREATOR  ✦  DEVELOPER  ✦  LIFELONG LEARNER  ✦  ';
  return (
    <div aria-hidden="true" className="relative w-full select-none overflow-hidden border-y border-white/10 bg-black py-6">
      <div
        className="marquee-track flex w-max whitespace-nowrap"
        style={{ animation: 'marquee 32s linear infinite', willChange: 'transform', fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {[0, 1].map((i) => (
          <span key={i} className="text-[clamp(3rem,8vw,6.5rem)] leading-none tracking-[0.06em]" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(212,175,55,0.55)' }}>
            {item.repeat(3)}
          </span>
        ))}
      </div>
    </div>
  );
};
