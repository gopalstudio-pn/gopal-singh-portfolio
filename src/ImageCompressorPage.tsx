import { useState } from 'react';
import { ToolShell } from './components/ToolShell';

const mont = { fontFamily: "'Montserrat', sans-serif" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;

type Item = { id: number; name: string; before: number; after: number; url: string; outName: string; w: number; h: number };

const size = (n: number) => (n >= 1048576 ? (n / 1048576).toFixed(2) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');

async function compress(file: File, quality: number, maxW: number, type: string) {
  const bmp = await createImageBitmap(file);
  const scale = maxW && bmp.width > maxW ? maxW / bmp.width : 1;
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  if (type === 'image/jpeg') {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, type, quality));
  if (!blob) throw new Error('Could not compress this image.');
  return { blob, w, h };
}

export default function ImageCompressorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(75);
  const [maxW, setMaxW] = useState(1600);
  const [type, setType] = useState('image/jpeg');
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = (list: FileList | null) => {
    items.forEach((i) => URL.revokeObjectURL(i.url));
    setItems([]);
    setError('');
    setFiles(Array.from(list || []).filter((f) => f.type.startsWith('image/')).slice(0, 20));
  };

  const run = async () => {
    setBusy(true);
    setError('');
    items.forEach((i) => URL.revokeObjectURL(i.url));
    const out: Item[] = [];
    for (const [idx, f] of files.entries()) {
      try {
        const { blob, w, h } = await compress(f, quality / 100, maxW, type);
        const ext = type === 'image/webp' ? 'webp' : 'jpg';
        out.push({
          id: idx,
          name: f.name,
          before: f.size,
          after: blob.size,
          url: URL.createObjectURL(blob),
          outName: f.name.replace(/\.[^.]+$/, '') + '-compressed.' + ext,
          w,
          h,
        });
      } catch {
        setError('Some images could not be compressed.');
      }
    }
    setItems(out);
    setBusy(false);
  };

  const btn = 'border border-[#8C6D4F]/50 px-4 py-2 text-[10px] tracking-[0.25em] text-[#EAD8C7] transition-colors hover:border-[#D4AF37]';
  const sel = 'mt-2 w-full border border-[#8C6D4F]/50 bg-black px-3 py-2 text-sm text-[#EAD8C7]';

  return (
    <ToolShell
      title="Image Compressor & Resizer"
      desc="Compress and resize photos online. Make JPG or WebP images smaller without losing quality. Free, private, runs on your device."
    >
      <section className="pb-10 pt-4 text-center">
        <p className="text-[10px] tracking-[0.4em] text-[#C9A66B]" style={mont}>FREE TOOL · PRIVATE</p>
        <h1 className="mt-5 text-[clamp(2.4rem,7vw,5rem)] uppercase leading-[0.9]" style={bebas}>
          <span className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] bg-clip-text text-transparent">Image compressor</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm font-light text-white/50" style={mont}>
          Make photos smaller in seconds. Your images never leave your phone.
        </p>
      </section>

      <div className="mx-auto max-w-2xl space-y-4">
        <div className="border border-[#8C6D4F]/40 bg-white/[0.02] p-5 sm:p-6" style={mont}>
          <label htmlFor="imgs" className="text-[10px] tracking-[0.3em] text-[#C9A66B]">CHOOSE PHOTOS (UP TO 20)</label>
          <input id="imgs" type="file" accept="image/*" multiple onChange={(e) => pick(e.target.files)} className="mt-3 block w-full text-sm text-white/60" />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-[10px] tracking-[0.3em] text-[#C9A66B]">QUALITY: {quality}%</label>
              <input type="range" min={20} max={95} value={quality} onChange={(e) => setQuality(+e.target.value)} className="mt-3 w-full accent-[#D4AF37]" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.3em] text-[#C9A66B]">MAX WIDTH</label>
              <select value={maxW} onChange={(e) => setMaxW(+e.target.value)} className={sel}>
                <option value={0}>Original size</option>
                <option value={3000}>3000 px</option>
                <option value={1920}>1920 px (Full HD)</option>
                <option value={1600}>1600 px</option>
                <option value={1080}>1080 px (Instagram)</option>
                <option value={800}>800 px</option>
                <option value={400}>400 px</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] tracking-[0.3em] text-[#C9A66B]">FORMAT</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={sel}>
                <option value="image/jpeg">JPG (works everywhere)</option>
                <option value="image/webp">WebP (smaller)</option>
              </select>
            </div>
          </div>

          <button type="button" onClick={run} disabled={!files.length || busy} className={btn + ' mt-6 disabled:opacity-40'} style={{ cursor: 'pointer' }}>
            {busy ? 'WORKING…' : files.length ? `COMPRESS ${files.length} PHOTO${files.length > 1 ? 'S' : ''}` : 'CHOOSE PHOTOS FIRST'}
          </button>
          {error ? <p className="mt-4 text-sm text-red-300/80">{error}</p> : null}
        </div>

        {items.map((i) => {
          const saved = Math.round((1 - i.after / i.before) * 100);
          return (
            <div key={i.id} className="flex items-center gap-4 border border-[#8C6D4F]/40 bg-white/[0.02] p-4" style={mont}>
              <img src={i.url} alt="" className="h-16 w-16 shrink-0 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-[#EAD8C7]">{i.name}</p>
                <p className="mt-1 text-xs text-white/50">
                  {size(i.before)} → {size(i.after)} · {i.w}×{i.h}
                </p>
                <p className={'mt-1 text-xs ' + (saved > 0 ? 'text-[#C9A66B]' : 'text-white/40')}>
                  {saved > 0 ? `Saved ${saved}%` : 'Already small. Try lower quality or width.'}
                </p>
              </div>
              <a href={i.url} download={i.outName} className={btn}>DOWNLOAD</a>
            </div>
          );
        })}
      </div>
    </ToolShell>
  );
}
