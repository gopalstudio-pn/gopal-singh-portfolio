import { useEffect, useRef } from 'react';

type Mode = 'idle' | 'listening' | 'speaking' | 'thinking';

export const AIOrb = ({ mode }: { mode: Mode }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<Mode>(mode);
  modeRef.current = mode;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const S = cv.width;
    const c = S / 2;
    const R = S * 0.27;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = 0;
    let amp = 0.18;

    const draw = (t: number) => {
      const m = modeRef.current;
      const target = m === 'listening' ? 1 : m === 'speaking' ? 0.85 : m === 'thinking' ? 0.55 : 0.18;
      amp += (target - amp) * 0.08;
      ctx.clearRect(0, 0, S, S);
      const breath = 1 + Math.sin(t / 900) * 0.04 * (0.6 + amp);
      const r = R * breath;
      const glow = ctx.createRadialGradient(c, c, r * 0.3, c, c, r * 2.1);
      glow.addColorStop(0, 'rgba(212,175,55,' + (0.35 + amp * 0.3) + ')');
      glow.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(c, c, r * 2.1, 0, Math.PI * 2);
      ctx.fill();
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        for (let a = 0; a <= 64; a++) {
          const ang = (a / 64) * Math.PI * 2;
          const rr = r * (1.22 + k * 0.17) + Math.sin(ang * (3 + k * 2) + t / (380 + k * 140)) * amp * r * 0.16;
          const x = c + Math.cos(ang) * rr;
          const y = c + Math.sin(ang) * rr;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(247,231,196,' + (0.55 - k * 0.15) * (0.5 + amp * 0.5) + ')';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      const body = ctx.createRadialGradient(c - r * 0.35, c - r * 0.4, r * 0.08, c, c, r);
      body.addColorStop(0, '#FFF4CF');
      body.addColorStop(0.35, '#E3B650');
      body.addColorStop(0.75, '#8A5F1A');
      body.addColorStop(1, '#2A1C06');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 33) return;
      last = t;
      if (document.hidden) return;
      draw(t);
    };
    if (reduced) draw(0);
    else raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} width={112} height={112} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
};

export const Waveform = ({ kind }: { kind: 'listen' | 'speak' }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = cv.width;
    const H = cv.height;
    const bars = 36;
    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 40) return;
      last = t;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = kind === 'listen' ? 'rgba(212,175,55,0.9)' : 'rgba(234,216,199,0.85)';
      for (let i = 0; i < bars; i++) {
        const x = (i + 0.5) * (W / bars);
        const env = Math.sin((i / (bars - 1)) * Math.PI);
        const n = (Math.sin(t / (kind === 'listen' ? 140 : 200) + i * 0.7) + Math.sin(t / 330 + i * 1.3) + 2) / 4;
        const h = Math.max(4, n * env * H * 0.9);
        ctx.fillRect(x - 3, (H - h) / 2, 6, h);
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [kind]);
  return <canvas ref={ref} width={680} height={64} aria-hidden="true" className="h-8 w-full border-b border-white/10 bg-black/30" />;
};
