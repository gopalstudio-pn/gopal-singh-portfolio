import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ToolShell } from './components/ToolShell';
import { COUNTRIES, drawQr, makeMatrix, qrSvg, vcardString, waLink, wifiString } from './lib/qr';
import type { Shape } from './lib/qr';

const mont = { fontFamily: "'Montserrat', sans-serif" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;
const fieldCls = 'w-full border-0 border-b border-white/20 bg-transparent py-3 text-base font-light text-[#EAD8C7] outline-none transition-colors placeholder:text-white/25 focus:border-[#D4AF37]';
const tiny = 'text-[9px] tracking-[0.3em] text-white/35';

const TABS: [string, string][] = [['wa', 'WHATSAPP'], ['link', 'LINK / TEXT'], ['wifi', 'WI-FI'], ['card', 'CONTACT CARD']];
const PRESETS: [string, string, string][] = [
  ['CLASSIC', '#111111', '#FFFFFF'],
  ['NAVY', '#0B1F4D', '#FFFFFF'],
  ['FOREST', '#0B3D2E', '#FFFFFF'],
  ['BURGUNDY', '#5A0F1F', '#FFFFFF'],
  ['GOLDEN INK', '#6B4E12', '#FFF8E7'],
];
const SHAPES: [string, string][] = [['square', 'SQUARE'], ['round', 'ROUNDED'], ['dot', 'DOTS']];
const SECS: [string, string][] = [['WPA', 'WPA / WPA2 / WPA3'], ['WEP', 'WEP'], ['nopass', 'NO PASSWORD']];

const checker = {
  backgroundColor: '#e8e8e8',
  backgroundImage: 'linear-gradient(45deg, #cfcfcf 25%, transparent 25%), linear-gradient(-45deg, #cfcfcf 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cfcfcf 75%), linear-gradient(-45deg, transparent 75%, #cfcfcf 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block" style={mont}>
    <span className={tiny}>{label}</span>
    {children}
  </label>
);

const Pills = ({ items, value, onChange }: { items: [string, string][]; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-wrap gap-2" style={mont}>
    {items.map(([id, label]) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        className={'border px-4 py-2 text-[10px] tracking-[0.25em] transition-colors ' + (value === id ? 'border-[#D4AF37] text-[#EAD8C7]' : 'border-white/10 text-white/40 hover:border-white/30')}
        style={{ cursor: 'pointer' }}
      >
        {label}
      </button>
    ))}
  </div>
);

const Copy = ({ text }: { text: string }) => {
  const [done, setDone] = useState(false);
  const go = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement('textarea');
      t.value = text;
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand('copy');
      } catch {}
      document.body.removeChild(t);
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1500);
  };
  return (
    <button type="button" onClick={go} className={'text-[10px] tracking-[0.25em] transition-colors ' + (done ? 'text-[#D4AF37]' : 'text-[#C9A66B] hover:text-[#EAD8C7]')} style={{ cursor: 'pointer', ...mont }}>
      {done ? 'COPIED ✓' : 'COPY LINK'}
    </button>
  );
};

export default function QrPage() {
  const [type, setType] = useState(() => {
    const h = window.location.hash.replace('#', '');
    return TABS.some((t) => t[0] === h) ? h : 'wa';
  });
  const [cc, setCc] = useState('977');
  const [num, setNum] = useState('');
  const [msg, setMsg] = useState('');
  const [link, setLink] = useState('');
  const [ssid, setSsid] = useState('');
  const [pass, setPass] = useState('');
  const [sec, setSec] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  const [card, setCard] = useState({ name: '', phone: '', email: '', url: '', org: '' });
  const [shape, setShape] = useState('square');
  const [pi, setPi] = useState(0);
  const [clear, setClear] = useState(false);
  const cv = useRef<HTMLCanvasElement>(null);

  const go = (t: string) => {
    setType(t);
    history.replaceState(null, '', '#' + t);
  };

  const built = useMemo((): { text: string } | { error: string } | null => {
    if (type === 'wa') {
      if (!num.trim()) return null;
      const r = waLink(cc, num, msg);
      return 'url' in r ? { text: r.url } : r;
    }
    if (type === 'link') {
      const t = link.trim();
      return t ? { text: t } : null;
    }
    if (type === 'wifi') {
      if (!ssid.trim()) return null;
      return { text: wifiString(ssid.trim(), pass, sec as 'WPA' | 'WEP' | 'nopass', hidden) };
    }
    if (!card.name.trim()) return null;
    return { text: vcardString({ name: card.name.trim(), phone: card.phone.trim(), email: card.email.trim(), url: card.url.trim(), org: card.org.trim() }) };
  }, [type, cc, num, msg, link, ssid, pass, sec, hidden, card]);

  const result = useMemo(() => {
    if (!built || 'error' in built) return null;
    try {
      return { m: makeMatrix(built.text, shape === 'square' ? 'M' : 'Q'), text: built.text };
    } catch {
      return { error: 'That is too long for a QR code. Try something shorter.' };
    }
  }, [built, shape]);

  const style = useMemo(() => ({ shape: shape as Shape, fg: PRESETS[pi][1], bg: clear ? null : PRESETS[pi][2] }), [shape, pi, clear]);

  useEffect(() => {
    if (cv.current && result && 'm' in result) drawQr(cv.current, result.m, style);
  }, [result, style]);

  const ready = !!(result && 'm' in result);
  const fileBase = ({ wa: 'whatsapp', link: 'link', wifi: 'wifi', card: 'contact' } as Record<string, string>)[type] + '-qr';
  const saveBlob = (b: Blob, file: string) => {
    const url = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  const png = () => {
    if (cv.current) cv.current.toBlob((b) => b && saveBlob(b, fileBase + '.png'), 'image/png');
  };
  const svg = () => {
    if (result && 'm' in result) saveBlob(new Blob([qrSvg(result.m, style)], { type: 'image/svg+xml' }), fileBase + '.svg');
  };

  const errorMsg = built && 'error' in built ? built.error : result && 'error' in result ? result.error : '';
  const waUrl = type === 'wa' && built && 'text' in built ? built.text : '';
  const setC = (k: string, v: string) => setCard({ ...card, [k]: v });

  return (
    <ToolShell title="WhatsApp Link & QR Maker" desc="Free WhatsApp link and QR code maker. Also makes QR codes for links, Wi-Fi and contact cards. No sign-up, made on your device.">
      <section className="pb-8 pt-4 text-center">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-[10px] tracking-[0.4em] text-[#C9A66B]" style={mont}>
          WHATSAPP LINK & QR · FREE
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="mt-5 text-[clamp(2.6rem,8vw,5.5rem)] uppercase leading-[0.9]" style={bebas}>
          <span className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] bg-clip-text text-transparent">Make a QR in seconds</span>
        </motion.h1>
        <p className="mx-auto mt-5 max-w-md text-sm font-light text-white/50" style={mont}>WhatsApp chat links, website QR codes, Wi-Fi and contact cards. Made on your device, nothing is uploaded.</p>
      </section>

      <div role="tablist" className="mx-auto flex max-w-2xl flex-wrap justify-center gap-1 border-b border-white/10" style={mont}>
        {TABS.map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={type === id}
            type="button"
            onClick={() => go(id)}
            className={'relative px-4 py-3 text-[10px] tracking-[0.3em] transition-colors sm:px-6 ' + (type === id ? 'text-[#EAD8C7]' : 'text-white/40 hover:text-white/70')}
            style={{ cursor: 'pointer' }}
          >
            {label}
            {type === id && <motion.span layoutId="qr-tab" className="absolute inset-x-3 -bottom-px h-px bg-[#D4AF37]" />}
          </button>
        ))}
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,420px)]">
        <div className="space-y-6">
          {type === 'wa' && (
            <>
              <Field label="COUNTRY">
                <select value={cc} onChange={(e) => setCc(e.target.value)} className={fieldCls} style={{ colorScheme: 'dark' }}>
                  {COUNTRIES.map(([n, c]) => (
                    <option key={n} value={c}>{n + ' +' + c}</option>
                  ))}
                </select>
              </Field>
              <Field label="PHONE NUMBER">
                <input value={num} onChange={(e) => setNum(e.target.value)} inputMode="tel" autoComplete="off" placeholder="98XXXXXXXX" maxLength={20} className={fieldCls} />
              </Field>
              <Field label="MESSAGE (OPTIONAL)">
                <textarea value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={500} rows={3} placeholder="Hi! I found you on your website." className={fieldCls + ' resize-none'} />
              </Field>
              <p className="text-xs font-light leading-relaxed text-white/35" style={mont}>No need to type the country code. If your number already includes it, start with +.</p>
              {waUrl && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                  <p className={tiny} style={mont}>YOUR WHATSAPP LINK</p>
                  <p className="mt-2 break-all text-sm font-light text-[#EAD8C7]" style={mont}>{waUrl}</p>
                  <div className="mt-4 flex items-center gap-6">
                    <Copy text={waUrl} />
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.25em] text-[#C9A66B] transition-colors hover:text-[#EAD8C7]" style={mont}>
                      TEST IT ↗
                    </a>
                  </div>
                </div>
              )}
            </>
          )}

          {type === 'link' && (
            <Field label="WEBSITE LINK OR ANY TEXT">
              <textarea value={link} onChange={(e) => setLink(e.target.value)} maxLength={1000} rows={4} placeholder="https://yourwebsite.com" className={fieldCls + ' resize-none'} />
            </Field>
          )}

          {type === 'wifi' && (
            <>
              <Field label="WI-FI NAME">
                <input value={ssid} onChange={(e) => setSsid(e.target.value)} maxLength={60} autoComplete="off" placeholder="My Home WiFi" className={fieldCls} />
              </Field>
              {sec !== 'nopass' && (
                <Field label="PASSWORD">
                  <input value={pass} onChange={(e) => setPass(e.target.value)} maxLength={80} autoComplete="off" placeholder="Wi-Fi password" className={fieldCls} />
                </Field>
              )}
              <div>
                <p className={tiny} style={mont}>SECURITY</p>
                <div className="mt-3">
                  <Pills items={SECS} value={sec} onChange={setSec} />
                </div>
              </div>
              <button type="button" onClick={() => setHidden(!hidden)} className={'border px-4 py-2 text-[10px] tracking-[0.25em] transition-colors ' + (hidden ? 'border-[#D4AF37] text-[#EAD8C7]' : 'border-white/10 text-white/40')} style={{ cursor: 'pointer', ...mont }}>
                HIDDEN NETWORK
              </button>
            </>
          )}

          {type === 'card' && (
            <>
              <Field label="FULL NAME">
                <input value={card.name} onChange={(e) => setC('name', e.target.value)} maxLength={60} autoComplete="off" placeholder="Gopal Singh" className={fieldCls} />
              </Field>
              <Field label="PHONE">
                <input value={card.phone} onChange={(e) => setC('phone', e.target.value)} inputMode="tel" maxLength={25} autoComplete="off" placeholder="+977 98XXXXXXXX" className={fieldCls} />
              </Field>
              <Field label="EMAIL">
                <input value={card.email} onChange={(e) => setC('email', e.target.value)} inputMode="email" maxLength={80} autoComplete="off" placeholder="you@example.com" className={fieldCls} />
              </Field>
              <Field label="WEBSITE">
                <input value={card.url} onChange={(e) => setC('url', e.target.value)} maxLength={120} autoComplete="off" placeholder="https://yourwebsite.com" className={fieldCls} />
              </Field>
              <Field label="COMPANY OR TITLE (OPTIONAL)">
                <input value={card.org} onChange={(e) => setC('org', e.target.value)} maxLength={80} autoComplete="off" placeholder="Creator" className={fieldCls} />
              </Field>
            </>
          )}
          {errorMsg && <p className="text-sm text-[#E0A38F]" style={mont}>{errorMsg}</p>}
        </div>

        <div className="lg:sticky lg:top-6">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            {ready ? (
              <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-lg" style={clear ? checker : { background: '#FFFFFF' }}>
                <canvas ref={cv} className="block h-auto w-full" />
              </div>
            ) : (
              <div className="mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center rounded-lg border border-dashed border-white/15 p-8 text-center text-[10px] leading-relaxed tracking-[0.3em] text-white/30" style={mont}>
                YOUR QR WILL APPEAR HERE
              </div>
            )}

            <p className={'mt-6 ' + tiny} style={mont}>SHAPE</p>
            <div className="mt-3">
              <Pills items={SHAPES} value={shape} onChange={setShape} />
            </div>

            <p className={'mt-6 ' + tiny} style={mont}>COLOR</p>
            <div className="mt-3 flex flex-wrap gap-2" style={mont}>
              {PRESETS.map(([label, fg, bg], i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setPi(i)}
                  className={'flex items-center gap-2 border px-3 py-2 text-[9px] tracking-[0.2em] transition-colors ' + (pi === i ? 'border-[#D4AF37] text-[#EAD8C7]' : 'border-white/10 text-white/40 hover:border-white/30')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="h-3 w-3 rounded-full border border-white/30" style={{ background: fg, boxShadow: 'inset 0 0 0 2px ' + bg }} />
                  {label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setClear(!clear)} className={'mt-3 border px-4 py-2 text-[10px] tracking-[0.25em] transition-colors ' + (clear ? 'border-[#D4AF37] text-[#EAD8C7]' : 'border-white/10 text-white/40')} style={{ cursor: 'pointer', ...mont }}>
              TRANSPARENT BACKGROUND
            </button>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={png} disabled={!ready} className="bg-gradient-to-b from-[#E7C98F] to-[#B8923A] py-4 text-[11px] font-semibold tracking-[0.3em] text-black transition-opacity hover:opacity-90 disabled:opacity-30" style={{ cursor: 'pointer', ...mont }}>
                PNG ↓
              </button>
              <button type="button" onClick={svg} disabled={!ready} className="border border-[#8C6D4F]/60 py-4 text-[11px] tracking-[0.3em] text-[#EAD8C7] transition-colors hover:border-[#D4AF37] disabled:opacity-30" style={{ cursor: 'pointer', ...mont }}>
                SVG ↓
              </button>
            </div>
            <p className="mt-4 text-center text-[10px] leading-relaxed tracking-[0.15em] text-white/30" style={mont}>SCAN IT WITH YOUR PHONE CAMERA BEFORE YOU PRINT.</p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
