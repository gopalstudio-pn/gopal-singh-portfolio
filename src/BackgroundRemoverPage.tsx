import { useEffect, useState } from 'react';
import { ToolShell } from './components/ToolShell';

const mont = { fontFamily: "'Montserrat', sans-serif" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;

const checker = {
  backgroundImage:
    'linear-gradient(45deg,#222 25%,transparent 25%),linear-gradient(-45deg,#222 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#222 75%),linear-gradient(-45deg,transparent 75%,#222 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0,0 10px,10px -10px,-10px 0',
  backgroundColor: '#111',
} as const;

async function shrink(file: File, max: number): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  c.getContext('2d')!.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/jpeg', 0.92));
  if (!blob) throw new Error('Could not read this image.');
  return blob;
}

export default function BackgroundRemoverPage() {
  const [origUrl, setOrigUrl] = useState('');
  const [outUrl, setOutUrl] = useState('');
  const [outName, setOutName] = useState('background-removed.png');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (origUrl) URL.revokeObjectURL(origUrl);
    if (outUrl) URL.revokeObjectURL(outUrl);
  }, [origUrl, outUrl]);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    setOutUrl('');
    setOrigUrl(URL.createObjectURL(file));
    setOutName(file.name.replace(/\.[^.]+$/, '') + '-no-bg.png');
    setBusy(true);
    setStatus('Preparing photo…');
    try {
      const small = await shrink(file, 1600);
      setStatus('Loading AI model (first time only)…');
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(small, {
        model: 'isnet_fp16',
        output: { format: 'image/png' },
        progress: (key: string, current: number, total: number) => {
          if (key.startsWith('fetch') && total) {
            setStatus('Downloading AI model… ' + Math.round((current / total) * 100) + '%');
          } else if (key.startsWith('compute')) {
            setStatus('Removing background…');
          }
        },
      });
      setOutUrl(URL.createObjectURL(blob));
      setStatus('');
    } catch {
      setError('Something went wrong. Try a smaller photo or check your internet.');
      setStatus('');
    }
    setBusy(false);
  };

  const btn = 'inline-block border border-[#8C6D4F]/50 px-4 py-2 text-[10px] tracking-[0.25em] text-[#EAD8C7] transition-colors hover:border-[#D4AF37]';

  return (
    <ToolShell
      title="AI Background Remover"
      desc="Remove the background from any photo and download a transparent PNG. Free, private, runs on your device."
    >
      <section className="pb-10 pt-4 text-center">
        <p className="text-[10px] tracking-[0.4em] text-[#C9A66B]" style={mont}>FREE TOOL · PRIVATE</p>
        <h1 className="mt-5 text-[clamp(2.4rem,7vw,5rem)] uppercase leading-[0.9]" style={bebas}>
          <span className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] bg-clip-text text-transparent">Background remover</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm font-light text-white/50" style={mont}>
          Get a transparent PNG in seconds. Your photo never leaves your phone.
        </p>
      </section>

      <div className="mx-auto max-w-2xl space-y-4" style={mont}>
        <div className="border border-[#8C6D4F]/40 bg-white/[0.02] p-5 sm:p-6">
          <label htmlFor="bg" className="text-[10px] tracking-[0.3em] text-[#C9A66B]">CHOOSE A PHOTO</label>
          <input id="bg" type="file" accept="image/*" disabled={busy} onChange={(e) => pick(e.target.files?.[0])} className="mt-3 block w-full text-sm text-white/60" />
          <p className="mt-3 text-xs text-white/40">First use downloads a 40-80 MB AI model, then it is cached. Works best with people, products and animals.</p>
          {status ? <p className="mt-4 text-sm text-[#C9A66B]">{status}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-300/80">{error}</p> : null}
        </div>

        {origUrl ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-[#8C6D4F]/40 p-3">
              <p className="mb-2 text-[10px] tracking-[0.3em] text-white/40">BEFORE</p>
              <img src={origUrl} alt="Original" className="w-full object-contain" />
            </div>
            <div className="border border-[#8C6D4F]/40 p-3">
              <p className="mb-2 text-[10px] tracking-[0.3em] text-white/40">AFTER</p>
              <div style={checker}>
                {outUrl ? <img src={outUrl} alt="Background removed" className="w-full object-contain" /> : <div className="flex aspect-square items-center justify-center text-xs text-white/30">{busy ? 'Working…' : ''}</div>}
              </div>
              {outUrl ? <a href={outUrl} download={outName} className={btn + ' mt-3'}>DOWNLOAD PNG</a> : null}
            </div>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
