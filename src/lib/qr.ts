import * as Q from 'qrcode-generator';

const qrcode: any = (Q as any).default || Q;
try {
  if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
} catch {}

export type Ecc = 'L' | 'M' | 'Q' | 'H';
export type Shape = 'square' | 'round' | 'dot';
export type Matrix = { size: number; dark: (r: number, c: number) => boolean };
export type QrStyle = { shape: Shape; fg: string; bg: string | null };

export const QUIET = 4;

export const makeMatrix = (text: string, ecc: Ecc): Matrix => {
  const qr = qrcode(0, ecc);
  qr.addData(text);
  qr.make();
  return { size: qr.getModuleCount(), dark: (r: number, c: number) => !!qr.isDark(r, c) };
};

const isFinder = (m: Matrix, r: number, c: number) => (r < 7 && c < 7) || (r < 7 && c >= m.size - 7) || (r >= m.size - 7 && c < 7);

const rr = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
};

export const drawQr = (cv: HTMLCanvasElement, m: Matrix, s: QrStyle) => {
  const n = m.size + QUIET * 2;
  const scale = Math.max(4, Math.floor(1200 / n));
  const px = n * scale;
  cv.width = px;
  cv.height = px;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, px, px);
  if (s.bg) {
    ctx.fillStyle = s.bg;
    ctx.fillRect(0, 0, px, px);
  }
  ctx.fillStyle = s.fg;
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      if (!m.dark(r, c)) continue;
      const x = (c + QUIET) * scale;
      const y = (r + QUIET) * scale;
      if (s.shape === 'square' || isFinder(m, r, c)) ctx.fillRect(x, y, scale, scale);
      else if (s.shape === 'round') rr(ctx, x + scale * 0.04, y + scale * 0.04, scale * 0.92, scale * 0.92, scale * 0.32);
      else {
        ctx.beginPath();
        ctx.arc(x + scale / 2, y + scale / 2, scale * 0.46, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
};

export const qrSvg = (m: Matrix, s: QrStyle) => {
  const n = m.size + QUIET * 2;
  let sq = '';
  let other = '';
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      if (!m.dark(r, c)) continue;
      const x = c + QUIET;
      const y = r + QUIET;
      if (s.shape === 'square' || isFinder(m, r, c)) sq += 'M' + x + ' ' + y + 'h1v1h-1z';
      else if (s.shape === 'round') other += '<rect x="' + (x + 0.04) + '" y="' + (y + 0.04) + '" width="0.92" height="0.92" rx="0.32"/>';
      else other += '<circle cx="' + (x + 0.5) + '" cy="' + (y + 0.5) + '" r="0.46"/>';
    }
  }
  const bg = s.bg ? '<rect width="' + n + '" height="' + n + '" fill="' + s.bg + '"/>' : '';
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" width="1200" height="1200">' +
    bg +
    '<path shape-rendering="crispEdges" fill="' + s.fg + '" d="' + sq + '"/>' +
    (other ? '<g fill="' + s.fg + '">' + other + '</g>' : '') +
    '</svg>'
  );
};

const esc = (s: string) => s.replace(/([\\;,:"])/g, '\\$1');
const vEsc = (s: string) => s.replace(/([\\,;])/g, '\\$1');

export const wifiString = (ssid: string, pass: string, sec: 'WPA' | 'WEP' | 'nopass', hidden: boolean) =>
  'WIFI:T:' + sec + ';S:' + esc(ssid) + ';' + (sec === 'nopass' ? '' : 'P:' + esc(pass) + ';') + (hidden ? 'H:true;' : '') + ';';

export const vcardString = (v: { name: string; phone: string; email: string; url: string; org: string }) =>
  ['BEGIN:VCARD', 'VERSION:3.0', 'FN:' + vEsc(v.name), v.org ? 'ORG:' + vEsc(v.org) : '', v.phone ? 'TEL:' + v.phone : '', v.email ? 'EMAIL:' + v.email : '', v.url ? 'URL:' + v.url : '', 'END:VCARD']
    .filter(Boolean)
    .join('\n');

export const COUNTRIES: [string, string][] = [
  ['Nepal', '977'],
  ['India', '91'],
  ['Bangladesh', '880'],
  ['Pakistan', '92'],
  ['Sri Lanka', '94'],
  ['Bhutan', '975'],
  ['Maldives', '960'],
  ['USA / Canada', '1'],
  ['United Kingdom', '44'],
  ['UAE', '971'],
  ['Qatar', '974'],
  ['Saudi Arabia', '966'],
  ['Kuwait', '965'],
  ['Oman', '968'],
  ['Bahrain', '973'],
  ['Malaysia', '60'],
  ['Singapore', '65'],
  ['Thailand', '66'],
  ['Australia', '61'],
  ['Japan', '81'],
  ['South Korea', '82'],
  ['China', '86'],
  ['Hong Kong', '852'],
  ['Germany', '49'],
  ['France', '33'],
  ['Italy', '39'],
  ['Spain', '34'],
  ['Portugal', '351'],
  ['Israel', '972'],
  ['Cyprus', '357'],
  ['Malta', '356'],
];

export const waLink = (cc: string, input: string, message: string): { url: string } | { error: string } => {
  const raw = input.trim();
  let digits = raw.replace(/\D/g, '');
  if (!digits) return { error: 'Enter a phone number.' };
  let full: string;
  if (raw.startsWith('+')) full = digits;
  else {
    digits = digits.replace(/^0+/, '');
    full = cc + digits;
  }
  if (full.length < 8 || full.length > 15) return { error: 'That number looks too short or too long.' };
  const msg = message.trim();
  return { url: 'https://wa.me/' + full + (msg ? '?text=' + encodeURIComponent(msg) : '') };
};
