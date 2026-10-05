import { useEffect, useRef, useState } from 'react';

const W = 1800;
const H = 700;
const mont = { fontFamily: "'Montserrat', sans-serif" } as const;
const FONTS: [string, number][] = [
  ['Great Vibes', 400],
  ['Allura', 400],
  ['Herr Von Muellerhoff', 400],
  ['Mrs Saint Delafield', 400],
  ['Sacramento', 400],
  ['Parisienne', 400],
  ['Yellowtail', 400],
  ['Dancing Script', 600],
  ['Satisfy', 400],
];
const INKS: [string, string][] = [
  ['Black', '#111111'],
  ['Blue', '#1B3A8C'],
  ['Navy', '#0B1F4D'],
  ['Gold', '#C9A24B'],
  ['White', '#FFFFFF'],
];
const PENS: [string, number][] = [['FINE', 5], ['MEDIUM', 9], ['BOLD', 15]];
const LINK =
  'https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&family=Sacramento&family=Parisienne&family=Yellowtail&family=Dancing+Script:wght@600&family=Satisfy&display=swap';

type Pt = { x: number; y: number };

const slug = (n: string) => (n.trim() || 'name').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'name';

function drawText(cv: HTMLCanvasElement, text: string, fam: string, weight: number, ink: string, flourish: boolean) {
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  let size = 440;
  ctx.font = weight + ' ' + size + 'px "' + fam + '", cursive';
  while (ctx.measureText(text).width > 1560 && size > 100) {
    size -= 8;
    ctx.font = weight + ' ' + size + 'px "' + fam + '", cursive';
  }
  const tw = ctx.measureText(text).width;
  ctx.save();
  ctx.translate(W / 2, H * 0.44);
  ctx.rotate(-0.035);
  ctx.fillStyle = ink;
  ctx.fillText(text, 0, 0);
  if (flourish) {
    const fy = Math.min(size * 0.36, 330);
    const w = Math.min(tw * 0.92, 1400);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-w / 2, fy + 8);
    ctx.bezierCurveTo(-w / 4, fy - 26, w / 4, fy + 44, w / 2, fy - 8);
    ctx.stroke();
  }
  ctx.restore();
}

function drawStrokes(cv: HTMLCanvasElement, strokes: Pt[][], ink: string, w: number) {
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = w;
  for (const s of strokes) {
    if (s.length === 1) {
      ctx.beginPath();
      ctx.arc(s[0].x, s[0].y, w / 2, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(s[0].x, s[0].y);
    for (let i = 1; i < s.length - 1; i++) {
      const mx = (s[i].x + s[i + 1].x) / 2;
      const my = (s[i].y + s[i + 1].y) / 2;
      ctx.quadraticCurveTo(s[i].x, s[i].y, mx, my);
    }
    const l = s[s.length - 1];
    ctx.lineTo(l.x, l.y);
    ctx.stroke();
  }
}

function trim(src: HTMLCanvasElement, pad: number) {
  const ctx = src.getContext('2d');
  if (!ctx) return src;
  const w = src.width;
  const h = src.height;
  const d = ctx.getImageData(0, 0, w, h).data;
  let x0 = w;
  let y0 = h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (d[(y * w + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < x0) return src;
  x0 = Math.max(0, x0 - pad);
  y0 = Math.max(0, y0 - pad);
  x1 = Math.min(w - 1, x1 + pad);
  y1 = Math.min(h - 1, y1 + pad);
  const out = document.createElement('canvas');
  out.width = x1 - x0 + 1;
  out.height = y1 - y0 + 1;
  const o = out.getContext('2d');
  if (o) o.drawImage(src, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}

export default function SignatureTab({ name }: { name: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Pt[][]>([]);
  const cur = useRef<Pt[] | null>(null);
  const [mode, setMode] = useState<'type' | 'draw'>('type');
  const [fi, setFi] = useState(0);
  const [ink, setInk] = useState('#111111');
  const [flourish, setFlourish] = useState(true);
  const [pen, setPen] = useState(1);
  const [tick, setTick] = useState(0);
  const [ver, setVer] = useState(0);
  const text = name.trim() || 'Your Name';
  const dark = ink === '#FFFFFF' || ink === '#C9A24B';
  const empty = mode === 'draw' && strokes.current.length === 0;

  useEffect(() => {
    let on = true;
    const go = () =>
      Promise.all(FONTS.map(([f, w]) => document.fonts.load(w + ' 64px "' + f + '"', 'Aa')))
        .then(() => {
          if (on) setTick((t) => t + 1);
        })
        .catch(() => {});
    const bump = () => {
      if (on) setTick((t) => t + 1);
    };
    let l = document.getElementById('sig-fonts') as HTMLLinkElement | null;
    if (!l) {
      l = document.createElement('link');
      l.id = 'sig-fonts';
      l.rel = 'stylesheet';
      l.href = LINK;
      l.onload = go;
      document.head.appendChild(l);
    } else go();
    document.fonts.addEventListener('loadingdone', bump);
    return () => {
      on = false;
      document.fonts.removeEventListener('loadingdone', bump);
    };
  }, []);

  const paint = () => {
    const cv = ref.current;
    if (!cv) return;
    if (mode === 'type') drawText(cv, text, FONTS[fi][0], FONTS[fi][1], ink, flourish);
    else drawStrokes(cv, strokes.current, ink, PENS[pen][1]);
  };

  useEffect(() => {
    paint();
  }, [mode, text, fi, ink, flourish, pen, tick, ver]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== 'draw') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    cur.current = [pos(e)];
    strokes.current.push(cur.current);
    paint();
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = cur.current;
    if (!c) return;
    const p = pos(e);
    const l = c[c.length - 1];
    if (Math.hypot(p.x - l.x, p.y - l.y) < 2) return;
    c.push(p);
    paint();
  };
  const up = () => {
    if (!cur.current) return;
    cur.current = null;
    setVer((v) => v + 1);
  };

  const save = (paper: boolean) => {
    const cv = ref.current;
    if (!cv || empty) return;
    const t = trim(cv, 40);
    let src = t;
    if (paper) {
      const c2 = document.createElement('canvas');
      c2.width = t.width;
      c2.height = t.height;
      const c = c2.getContext('2d');
      if (!c) return;
      c.fillStyle = dark ? '#0D0B08' : '#F6F0E6';
      c.fillRect(0, 0, c2.width, c2.height);
      c.drawImage(t, 0, 0);
      src = c2;
    }
    src.toBlob(
      (b) => {
        if (!b) return;
        const url = URL.createObjectURL(b);
        const a = document.createElement('a');
        a.href = url;
        a.download = slug(name) + '-signature.' + (paper ? 'jpg' : 'png');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      },
      paper ? 'image/jpeg' : 'image/png',
      0.95
    );
  };

  const pill = (on: boolean) => 'border px-4 py-2 text-[10px] tracking-[0.25em] transition-colors ' + (on ? 'border-[#D4AF37] text-[#EAD8C7]' : 'border-white/10 text-white/40 hover:border-white/30');

  return (
    <div>
      <div className="flex gap-2" style={mont}>
        <button type="button" onClick={() => setMode('type')} className={pill(mode === 'type')} style={{ cursor: 'pointer' }}>TYPE YOUR NAME</button>
        <button type="button" onClick={() => setMode('draw')} className={pill(mode === 'draw')} style={{ cursor: 'pointer' }}>DRAW IT</button>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-xl border border-white/10" style={{ background: dark ? '#0D0B08' : '#F6F0E6' }}>
        {mode === 'draw' && (
          <div className="pointer-events-none absolute inset-x-[6%] top-[70%] border-t border-dashed" style={{ borderColor: dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)' }}>
            {empty && (
              <span className="absolute -top-7 left-0 text-[10px] tracking-[0.35em]" style={{ ...mont, color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
                ✕ SIGN HERE
              </span>
            )}
          </div>
        )}
        <canvas
          ref={ref}
          width={W}
          height={H}
          className="block h-auto w-full"
          style={{ touchAction: mode === 'draw' ? 'none' : 'auto', cursor: mode === 'draw' ? 'crosshair' : 'default' }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        />
      </div>

      {mode === 'draw' ? (
        <div className="mt-6 flex flex-wrap items-center gap-3" style={mont}>
          <button
            type="button"
            onClick={() => {
              strokes.current.pop();
              setVer((v) => v + 1);
            }}
            className={pill(false)}
            style={{ cursor: 'pointer' }}
          >
            UNDO
          </button>
          <button
            type="button"
            onClick={() => {
              strokes.current = [];
              setVer((v) => v + 1);
            }}
            className={pill(false)}
            style={{ cursor: 'pointer' }}
          >
            CLEAR
          </button>
          <span className="mx-2 h-4 w-px bg-white/15" />
          {PENS.map(([label], i) => (
            <button key={label} type="button" onClick={() => setPen(i)} className={pill(pen === i)} style={{ cursor: 'pointer' }}>
              {label}
            </button>
          ))}
          <p className="w-full text-[10px] tracking-[0.2em] text-white/30">DRAW WITH YOUR FINGER OR MOUSE. TURN YOUR PHONE SIDEWAYS FOR MORE ROOM.</p>
        </div>
      ) : (
        <>
          <p className="mt-10 text-[10px] tracking-[0.35em] text-[#C9A66B]" style={mont}>HANDWRITING</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FONTS.map(([f, w], i) => (
              <button
                key={f}
                type="button"
                onClick={() => setFi(i)}
                className={'overflow-hidden rounded-xl border px-3 py-4 text-center transition-colors ' + (fi === i ? 'border-[#D4AF37] bg-white/[0.04]' : 'border-white/10 hover:border-white/30')}
                style={{ cursor: 'pointer' }}
              >
                <span className="block truncate text-[1.7rem] leading-tight text-[#EAD8C7]" style={{ fontFamily: '"' + f + '", cursive', fontWeight: w }}>
                  {text.slice(0, 14)}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-8">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-[#C9A66B]" style={mont}>INK</p>
          <div className="mt-4 flex gap-3">
            {INKS.map(([label, c]) => (
              <button
                key={c}
                type="button"
                aria-label={label}
                onClick={() => setInk(c)}
                className={'h-8 w-8 rounded-full border-2 transition-transform ' + (ink === c ? 'scale-110 border-[#D4AF37]' : 'border-white/20')}
                style={{ background: c, cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>
        {mode === 'type' && (
          <button type="button" onClick={() => setFlourish(!flourish)} className={pill(flourish)} style={{ cursor: 'pointer', ...mont }}>
            FLOURISH LINE
          </button>
        )}
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => save(false)}
          disabled={empty}
          className="bg-gradient-to-b from-[#E7C98F] to-[#B8923A] py-4 text-[11px] font-semibold tracking-[0.3em] text-black transition-opacity hover:opacity-90 disabled:opacity-30"
          style={{ cursor: 'pointer', ...mont }}
        >
          TRANSPARENT PNG ↓
        </button>
        <button
          type="button"
          onClick={() => save(true)}
          disabled={empty}
          className="border border-[#8C6D4F]/60 py-4 text-[11px] tracking-[0.3em] text-[#EAD8C7] transition-colors hover:border-[#D4AF37] disabled:opacity-30"
          style={{ cursor: 'pointer', ...mont }}
        >
          JPG ON PAPER ↓
        </button>
      </div>
      <p className="mt-4 text-center text-[10px] tracking-[0.2em] text-white/30" style={mont}>CROPPED TO YOUR SIGNATURE · TYPED NAMES WORK BEST WITH ENGLISH LETTERS</p>
    </div>
  );
}
