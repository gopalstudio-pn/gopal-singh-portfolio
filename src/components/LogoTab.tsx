import { useEffect, useRef, useState } from 'react';

const S = 1200;
const BEBAS = '"Bebas Neue", Impact, sans-serif';
const CINZEL = '"Cinzel", Georgia, serif';
const MONT = '"Montserrat", Arial, sans-serif';
const VIBES = '"Great Vibes", cursive';
const GOLD: [number, string][] = [[0, '#F7E7C4'], [0.5, '#C99E5D'], [1, '#7A5A2A']];
const mont = { fontFamily: "'Montserrat', sans-serif" } as const;

type Opts = { name: string; tagline: string; style: string; round: boolean; transparent: boolean; credit: boolean };

const STYLE_LIST: [string, string][] = [
  ['gold', 'GOLD CINEMA'],
  ['royal', 'ROYAL'],
  ['mono', 'MONOGRAM'],
  ['minimal', 'MINIMAL'],
  ['neon', 'NEON'],
  ['gaming', 'GAMING'],
  ['script', 'SCRIPT'],
  ['sunset', 'SUNSET'],
];

const initials = (n: string) => {
  const w = n.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return 'YN';
  const a = Array.from(w[0])[0] || '';
  const b = w.length > 1 ? Array.from(w[1])[0] || '' : '';
  return (a + b).toUpperCase();
};

const slug = (n: string) => (n.trim() || 'name').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'name';

function draw(cv: HTMLCanvasElement, o: Opts) {
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const cx = S / 2;
  const cy = S / 2;
  ctx.clearRect(0, 0, S, S);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  const raw = o.name.trim();
  const label = (raw || 'Your Name').toUpperCase();
  const tag = o.tagline.trim().toUpperCase();
  const maxW = o.round ? S * 0.56 : S * 0.76;
  let dark = true;

  const sw = (t: string, sp: number) => {
    let w = 0;
    for (const ch of Array.from(t)) w += ctx.measureText(ch).width + sp;
    return Math.max(0, w - sp);
  };
  const fit = (t: string, fam: string, weight: number, mw: number, max: number, min: number, ratio: number) => {
    let s = max;
    while (s > min) {
      ctx.font = weight + ' ' + s + 'px ' + fam;
      if (sw(t, s * ratio) <= mw) break;
      s -= 4;
    }
    ctx.font = weight + ' ' + s + 'px ' + fam;
    return s;
  };
  const spaced = (t: string, x: number, y: number, sp: number, stroke?: boolean) => {
    let px = x - sw(t, sp) / 2;
    for (const ch of Array.from(t)) {
      if (stroke) ctx.strokeText(ch, px, y);
      else ctx.fillText(ch, px, y);
      px += ctx.measureText(ch).width + sp;
    }
  };
  const paintBg = (fn: () => void) => {
    if (o.transparent) return;
    ctx.save();
    if (o.round) {
      ctx.beginPath();
      ctx.arc(cx, cy, S / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    fn();
    ctx.restore();
  };
  const grad = (y0: number, y1: number, stops: [number, string][]) => {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    stops.forEach(([p, c]) => g.addColorStop(p, c));
    return g;
  };
  const radial = (a: string, b: string) => {
    const g = ctx.createRadialGradient(cx, cy, 60, cx, cy, S * 0.75);
    g.addColorStop(0, a);
    g.addColorStop(1, b);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
  };
  const ring = (x: number, y: number, r: number) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  };
  const line = (y: number, w: number, rgb: string) => {
    const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
    g.addColorStop(0, 'rgba(' + rgb + ',0)');
    g.addColorStop(0.5, 'rgba(' + rgb + ',1)');
    g.addColorStop(1, 'rgba(' + rgb + ',0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - w / 2, y - 1, w, 2);
  };
  const diamond = (x: number, y: number, r: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  };
  const tagline = (t: string, y: number, weight: number, size: number, fam: string, color: string, sp: number) => {
    if (!t) return;
    ctx.font = weight + ' ' + size + 'px ' + fam;
    ctx.fillStyle = color;
    spaced(t, cx, y, sp);
  };

  switch (o.style) {
    case 'royal': {
      paintBg(() => radial('#2c0e16', '#0c0508'));
      ctx.strokeStyle = '#D4AF37';
      if (o.round) {
        ctx.lineWidth = 4;
        ring(cx, cy, S / 2 - 40);
        ctx.lineWidth = 1.5;
        ring(cx, cy, S / 2 - 62);
      } else {
        ctx.lineWidth = 4;
        ctx.strokeRect(52, 52, S - 104, S - 104);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(72, 72, S - 144, S - 144);
        ctx.fillStyle = '#D4AF37';
        [[72, 72], [S - 72, 72], [72, S - 72], [S - 72, S - 72]].forEach(([x, y]) => diamond(x, y, 9));
      }
      const ky = cy - 200;
      ctx.fillStyle = grad(ky - 80, ky + 30, GOLD);
      ctx.beginPath();
      ctx.moveTo(cx - 80, ky + 10);
      ctx.lineTo(cx - 80, ky - 50);
      ctx.lineTo(cx - 40, ky - 20);
      ctx.lineTo(cx, ky - 70);
      ctx.lineTo(cx + 40, ky - 20);
      ctx.lineTo(cx + 80, ky - 50);
      ctx.lineTo(cx + 80, ky + 10);
      ctx.closePath();
      ctx.fill();
      [[cx - 80, ky - 58], [cx, ky - 78], [cx + 80, ky - 58]].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillRect(cx - 80, ky + 18, 160, 12);
      const y = cy + 10;
      const size = fit(label, CINZEL, 700, maxW, 160, 64, 0.1);
      ctx.fillStyle = grad(y - size / 2, y + size / 2, GOLD);
      spaced(label, cx, y, size * 0.1);
      const ly = y + size / 2 + 50;
      line(ly, 420, '212,175,55');
      ctx.fillStyle = '#D4AF37';
      diamond(cx, ly, 7);
      tagline(tag, ly + 52, 600, 28, CINZEL, '#D9C29A', 10);
      break;
    }
    case 'mono': {
      paintBg(() => radial('#1c150a', '#050505'));
      const ry = cy - (o.round ? 90 : 60);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 8;
      ring(cx, ry, 250);
      ctx.lineWidth = 2;
      ring(cx, ry, 228);
      const ini = initials(raw || 'Your Name');
      const isz = fit(ini, CINZEL, 700, 330, ini.length > 1 ? 250 : 320, 120, 0.04);
      ctx.fillStyle = grad(ry - isz / 2, ry + isz / 2, GOLD);
      spaced(ini, cx, ry + 6, isz * 0.04);
      const ny = ry + 340;
      const nsz = fit(label, MONT, 600, maxW, 42, 22, 0.4);
      ctx.fillStyle = '#EAD8C7';
      spaced(label, cx, ny, nsz * 0.4);
      tagline(tag, ny + 56, 500, 26, MONT, '#8C6D4F', 8);
      break;
    }
    case 'minimal': {
      dark = false;
      paintBg(() => {
        ctx.fillStyle = '#F4F0EA';
        ctx.fillRect(0, 0, S, S);
      });
      const y = cy - (tag ? 20 : 0);
      const size = fit(label, MONT, 700, maxW, 150, 60, 0.18);
      ctx.fillStyle = '#111111';
      spaced(label, cx, y, size * 0.18);
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(cx, y - size / 2 - 50, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111111';
      ctx.fillRect(cx - 40, y + size / 2 + 40, 80, 3);
      tagline(tag, y + size / 2 + 96, 500, 28, MONT, '#777777', 10);
      break;
    }
    case 'neon': {
      paintBg(() => radial('#17123a', '#07070f'));
      const y = cy - (tag ? 30 : 0);
      const size = fit(label, BEBAS, 400, maxW, 280, 90, 0.06);
      ctx.save();
      ctx.fillStyle = '#ff2bd6';
      ctx.shadowColor = '#ff2bd6';
      ctx.shadowBlur = 80;
      spaced(label, cx, y, size * 0.06);
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 36;
      ctx.fillStyle = '#ffffff';
      spaced(label, cx, y, size * 0.06);
      ctx.shadowColor = '#ff2bd6';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#ff2bd6';
      ctx.fillRect(cx - 150, y + size / 2 + 40, 300, 8);
      if (tag) {
        ctx.font = '600 32px ' + MONT;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#7df9ff';
        spaced(tag, cx, y + size / 2 + 100, 12);
      }
      ctx.restore();
      break;
    }
    case 'gaming': {
      paintBg(() => {
        ctx.fillStyle = '#09090c';
        ctx.fillRect(0, 0, S, S);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.35);
        ctx.fillStyle = 'rgba(255,70,40,0.07)';
        for (let i = -12; i <= 12; i++) ctx.fillRect(-S, i * 96, S * 2, 40);
        ctx.restore();
      });
      const y = cy - (tag ? 20 : 0);
      const size = fit(label, BEBAS, 400, maxW * 0.95, 320, 100, 0.03);
      ctx.save();
      ctx.transform(1, 0, -0.2, 1, 0.2 * y, 0);
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 30;
      spaced(label, cx, y, size * 0.03, true);
      ctx.strokeStyle = '#0b0b0f';
      ctx.lineWidth = 14;
      spaced(label, cx, y, size * 0.03, true);
      ctx.fillStyle = grad(y - size / 2, y + size / 2, [[0, '#FFC400'], [1, '#FF2D1A']]);
      spaced(label, cx, y, size * 0.03);
      ctx.restore();
      tagline(tag ? '// ' + tag + ' //' : '', y + size / 2 + 70, 700, 34, MONT, '#FF5A3C', 8);
      break;
    }
    case 'script': {
      dark = false;
      paintBg(() => {
        ctx.fillStyle = '#F6F0E6';
        ctx.fillRect(0, 0, S, S);
      });
      const text = raw || 'Your Name';
      let size = 380;
      ctx.font = '400 ' + size + 'px ' + VIBES;
      while (ctx.measureText(text).width > maxW && size > 110) {
        size -= 6;
        ctx.font = '400 ' + size + 'px ' + VIBES;
      }
      const y = cy - (tag ? 30 : 0) - 10;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#3B2A1A';
      ctx.fillText(text, cx, y);
      ctx.textAlign = 'left';
      const fy = y + size * 0.42;
      ctx.strokeStyle = '#B8923A';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 240, fy);
      ctx.bezierCurveTo(cx - 120, fy + 26, cx - 40, fy - 22, cx, fy);
      ctx.bezierCurveTo(cx + 40, fy + 22, cx + 120, fy - 26, cx + 240, fy);
      ctx.stroke();
      tagline(tag, fy + 64, 600, 28, CINZEL, '#8A7355', 10);
      break;
    }
    case 'sunset': {
      paintBg(() => {
        const g = ctx.createLinearGradient(0, 0, S, S);
        g.addColorStop(0, '#ff7a59');
        g.addColorStop(0.55, '#c0398f');
        g.addColorStop(1, '#3a1c71');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, S, S);
        const sun = ctx.createRadialGradient(cx, S * 0.42, 0, cx, S * 0.42, 320);
        sun.addColorStop(0, 'rgba(255,230,160,0.55)');
        sun.addColorStop(1, 'rgba(255,230,160,0)');
        ctx.fillStyle = sun;
        ctx.fillRect(0, 0, S, S);
      });
      const y = cy - (tag ? 20 : 0);
      const size = fit(label, MONT, 700, maxW, 170, 64, 0.16);
      ctx.fillStyle = '#ffffff';
      spaced(label, cx, y, size * 0.16);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(cx - 60, y + size / 2 + 44, 120, 3);
      tagline(tag, y + size / 2 + 100, 500, 30, MONT, 'rgba(255,255,255,0.88)', 10);
      break;
    }
    default: {
      paintBg(() => radial('#1c150a', '#050505'));
      ctx.strokeStyle = '#D4AF37';
      if (o.round) {
        ctx.lineWidth = 6;
        ring(cx, cy, S / 2 - 34);
        ctx.lineWidth = 2;
        ring(cx, cy, S / 2 - 56);
      } else {
        ctx.lineWidth = 6;
        ctx.strokeRect(48, 48, S - 96, S - 96);
        ctx.lineWidth = 2;
        ctx.strokeRect(70, 70, S - 140, S - 140);
      }
      const y = cy - (tag ? 40 : 10);
      const size = fit(label, BEBAS, 400, maxW, 270, 90, 0.07);
      ctx.font = '40px ' + MONT;
      ctx.fillStyle = '#D4AF37';
      ctx.textAlign = 'center';
      ctx.fillText('✦', cx, y - size / 2 - 50);
      ctx.textAlign = 'left';
      ctx.font = '400 ' + size + 'px ' + BEBAS;
      ctx.fillStyle = grad(y - size / 2, y + size / 2, GOLD);
      spaced(label, cx, y, size * 0.07);
      const ly = y + size / 2 + 44;
      line(ly, 380, '212,175,55');
      ctx.fillStyle = '#D4AF37';
      diamond(cx, ly, 7);
      tagline(tag, ly + 56, 500, 34, MONT, '#C4B29E', 12);
    }
  }

  if (o.credit) {
    ctx.font = '500 22px ' + MONT;
    ctx.fillStyle = o.transparent ? 'rgba(140,140,140,0.8)' : dark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.38)';
    spaced('MADE AT GOPAL STUDIO', cx, o.round ? S * 0.9 : S - 64, 7);
  }
}

const Switch = ({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex w-full items-center justify-between border-b border-white/10 py-3 text-left" style={{ cursor: 'pointer', ...mont }}>
    <span className="text-[10px] tracking-[0.3em] text-white/60">{label}</span>
    <span className={'relative h-5 w-9 rounded-full border transition-colors ' + (on ? 'border-[#D4AF37] bg-[#D4AF37]/25' : 'border-white/20 bg-white/5')}>
      <span className={'absolute top-[3px] h-3 w-3 rounded-full transition-all ' + (on ? 'left-[19px] bg-[#D4AF37]' : 'left-[3px] bg-white/40')} />
    </span>
  </button>
);

export default function LogoTab({ name }: { name: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [style, setStyle] = useState('gold');
  const [tag, setTag] = useState('');
  const [round, setRound] = useState(false);
  const [transparent, setTransparent] = useState(false);
  const [credit, setCredit] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let on = true;
    const specs = ['64px "Bebas Neue"', '700 64px "Cinzel"', '600 40px "Montserrat"', '700 40px "Montserrat"', '64px "Great Vibes"'];
    Promise.all(specs.map((s) => document.fonts.load(s, 'Aa')))
      .then(() => {
        if (on) setTick((t) => t + 1);
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);

  useEffect(() => {
    if (ref.current) draw(ref.current, { name, tagline: tag, style, round, transparent, credit });
  }, [name, tag, style, round, transparent, credit, tick]);

  const download = () => {
    const cv = ref.current;
    if (!cv) return;
    cv.toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      const a = document.createElement('a');
      a.href = url;
      a.download = slug(name) + '-logo.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, 'image/png');
  };

  const checker = {
    backgroundColor: '#1a1a1a',
    backgroundImage: 'linear-gradient(45deg, #2a2a2a 25%, transparent 25%), linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a2a2a 75%), linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)',
    backgroundSize: '24px 24px',
    backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0',
  };

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,540px)_1fr]">
      <div className="overflow-hidden rounded-xl border border-white/10" style={transparent ? checker : { background: '#0b0b0b' }}>
        <canvas ref={ref} width={S} height={S} className="block h-auto w-full" />
      </div>

      <div className="space-y-8">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-[#C9A66B]" style={mont}>STYLE</p>
          <div className="mt-4 flex flex-wrap gap-2" style={mont}>
            {STYLE_LIST.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setStyle(id)}
                className={'border px-4 py-2 text-[10px] tracking-[0.25em] transition-colors ' + (style === id ? 'border-[#D4AF37] text-[#EAD8C7]' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70')}
                style={{ cursor: 'pointer' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.35em] text-[#C9A66B]" style={mont}>TAGLINE (OPTIONAL)</p>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            maxLength={32}
            placeholder="e.g. Creator · Developer"
            className="mt-3 w-full border-0 border-b border-white/20 bg-transparent py-3 text-sm font-light tracking-[0.1em] text-[#EAD8C7] outline-none transition-colors placeholder:text-white/20 focus:border-[#D4AF37]"
            style={mont}
          />
        </div>

        <div>
          <p className="text-[10px] tracking-[0.35em] text-[#C9A66B]" style={mont}>SHAPE</p>
          <div className="mt-4 flex gap-2" style={mont}>
            {[['SQUARE', false], ['ROUND (PROFILE PICTURE)', true]].map(([label, val]) => (
              <button
                key={String(label)}
                type="button"
                onClick={() => setRound(val as boolean)}
                className={'border px-4 py-2 text-[10px] tracking-[0.2em] transition-colors ' + (round === val ? 'border-[#D4AF37] text-[#EAD8C7]' : 'border-white/10 text-white/40 hover:border-white/30')}
                style={{ cursor: 'pointer' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Switch label="TRANSPARENT BACKGROUND" on={transparent} onClick={() => setTransparent(!transparent)} />
          <Switch label="SMALL CREDIT LINE" on={credit} onClick={() => setCredit(!credit)} />
        </div>

        <div>
          <button
            type="button"
            onClick={download}
            className="w-full bg-gradient-to-b from-[#E7C98F] to-[#B8923A] py-4 text-[11px] font-semibold tracking-[0.35em] text-black transition-opacity hover:opacity-90"
            style={{ cursor: 'pointer', ...mont }}
          >
            DOWNLOAD PNG ↓
          </button>
          <p className="mt-3 text-center text-[10px] tracking-[0.2em] text-white/30" style={mont}>1200 × 1200 · WORKS BEST WITH ENGLISH LETTERS</p>
        </div>
      </div>
    </div>
  );
}
