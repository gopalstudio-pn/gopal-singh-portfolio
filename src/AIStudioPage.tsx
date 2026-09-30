
import React, { useEffect, useMemo, useState } from 'react';

const ratios = ['1:1', '4:3', '3:4', '16:9', '9:16'];

const models = [
  { id: 'flux-klein-4b', name: 'FLUX.2 Klein 4B', tag: 'BEST FOR FACES' },
  { id: 'flux-schnell', name: 'FLUX.1 Schnell', tag: 'FAST' },
  { id: 'sdxl-lightning', name: 'SDXL Lightning', tag: 'FASTEST' },
  { id: 'dreamshaper', name: 'DreamShaper 8', tag: 'ARTISTIC' },
  { id: 'sdxl-base', name: 'Stable Diffusion XL', tag: 'DETAILED' },
];

const styles = [
  { id: 'cinematic', name: 'CINEMATIC', text: 'cinematic lighting, film still, dramatic mood' },
  { id: 'realistic', name: 'REALISTIC', text: 'ultra realistic photograph, natural light, sharp detail' },
  { id: 'anime', name: 'ANIME', text: 'anime style, clean lines, vibrant colors' },
  { id: 'cyberpunk', name: 'CYBERPUNK', text: 'cyberpunk city, neon lights, futuristic' },
];


async function shrinkImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 500 / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.92)
    );
    return blob || file;
  } catch {
    return file;
  }
}

function AIStudioPage() {
  const [prompt, setPrompt] = useState('');
  const [reference, setReference] = useState<File | null>(null);
  const [ratio, setRatio] = useState('1:1');
  const [model, setModel] = useState('flux-klein-4b');
  const [dragActive, setDragActive] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [error, setError] = useState('');
  const [stage, setStage] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [style, setStyle] = useState('');

  const handleFile = (file?: File) => {
    if (file && file.type.startsWith('image/')) {
      setReference(file);
      setError('');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Describe the image you want to create.');
      return;
    }

    setGenerating(true);
    setGeneratedImage('');
    setError('');
    setStage('ANALYZING PROMPT');

    try {
      const formData = new FormData();

      formData.append('prompt', prompt.trim() + (styles.find((x) => x.id === style)?.text ? ', ' + styles.find((x) => x.id === style)?.text : ''));
      formData.append('ratio', ratio);
      formData.append('model', model);

      if (reference) {
        setStage('PROCESSING REFERENCE');
        formData.append('reference', await shrinkImage(reference), 'reference.jpg');
      }

      setStage('COMPOSING SCENE');

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Image generation failed.');
      }

      setStage('GENERATING IMAGE');
const imageData = data.image?.image;
const imageUrl = data.image?.image_url || data.image?.url;

if (typeof imageData === 'string' && imageData) {
  setGeneratedImage(
    imageData.startsWith('data:')
      ? imageData
      : `data:image/jpeg;base64,${imageData}`
  );
} else if (typeof imageUrl === 'string' && imageUrl) {
  setGeneratedImage(imageUrl);
} else if (typeof data.image === 'string' && data.image) {
  setGeneratedImage(data.image);
} else {
  throw new Error('The generated image format was not recognized.');
}
      setStage('');
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );

      setStage('');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'gopal-ai-creation.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateAgain = () => {
    setGeneratedImage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

    useEffect(() => {
    if (generatedImage) {
      setHistory((h) =>
        h.includes(generatedImage) ? h : [generatedImage, ...h].slice(0, 6)
      );
    }
  }, [generatedImage]);

  const refUrl = useMemo(
    () => (reference ? URL.createObjectURL(reference) : ''),
    [reference]
  );
  const current = models.find((m) => m.id === model) || models[0];

  return (
    <div className="min-h-screen bg-[#080808] text-[#E8DFD8]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <a href="/" className="text-xs tracking-[0.35em] transition-opacity hover:opacity-60">GOPAL</a>
        <span className="text-[10px] tracking-[0.35em] text-white/40">AI STUDIO</span>
        <a href="/" className="text-[10px] tracking-[0.25em] text-white/50 transition-colors hover:text-white">← BACK</a>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-6">
        <h1
          className="text-center text-6xl uppercase leading-none tracking-tight md:text-8xl"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          <span className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] bg-clip-text text-transparent">
            Create without limits
          </span>
        </h1>
        <p className="mt-4 text-center text-[10px] tracking-[0.3em] text-white/40">
          TURN AN IDEA OR A FACE INTO AN IMAGE
        </p>

        <div className="mt-10 flex min-h-[380px] items-center justify-center border border-[#BFA98E]/20 bg-black/40 p-2">
          {generatedImage ? (
            <img src={generatedImage} alt="AI generated result" className="max-h-[70vh] w-auto max-w-full object-contain" />
          ) : generating ? (
            <div className="text-center">
              <div className="mx-auto mb-4 h-2 w-2 animate-pulse rounded-full bg-[#BFA98E]" />
              <p className="text-[10px] tracking-[0.3em] text-[#BFA98E]">{stage || 'GENERATING'}</p>
            </div>
          ) : (
            <p className="text-[10px] tracking-[0.3em] text-white/20">YOUR IMAGE APPEARS HERE</p>
          )}
        </div>

        {error && <p className="mt-4 text-center text-[11px] tracking-[0.12em] text-red-200/70">{error}</p>}

        {generatedImage && (
          <div className="mt-5 flex justify-center gap-8 text-[10px] tracking-[0.25em]">
            <button type="button" onClick={handleDownload} className="text-[#BFA98E] hover:text-white">DOWNLOAD ↓</button>
            <button type="button" onClick={handleCreateAgain} className="text-white/50 hover:text-white">CREATE AGAIN</button>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6 flex justify-center gap-2">
            {history.map((img) => (
              <button key={img.slice(-24)} type="button" onClick={() => setGeneratedImage(img)} className="h-12 w-12 overflow-hidden border border-white/10 opacity-70 transition-opacity hover:opacity-100">
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={1000}
            rows={3}
            disabled={generating}
            placeholder="Describe the image you want to create..."
            className="w-full resize-none bg-transparent text-base font-light leading-7 text-white outline-none placeholder:text-white/25 disabled:opacity-50"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#BFA98E]/40 text-lg text-[#BFA98E] transition-colors hover:bg-[#BFA98E]/10" title="Add reference face">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                {refUrl ? <img src={refUrl} alt="" className="h-full w-full object-cover" /> : '+'}
              </label>
              {reference && (
                <button type="button" onClick={() => setReference(null)} className="text-[9px] tracking-[0.2em] text-white/40 hover:text-white">REMOVE</button>
              )}
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="border border-[#BFA98E]/40 px-7 py-3 text-[10px] tracking-[0.25em] transition-all hover:bg-[#BFA98E] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {generating ? 'GENERATING...' : 'GENERATE ↗'}
            </button>
          </div>
        </div>
        {reference && model !== 'flux-klein-4b' && (
          <p className="mt-3 text-center text-[9px] tracking-[0.2em] text-[#BFA98E]/70">REFERENCE FACE WORKS WITH FLUX.2 KLEIN 4B</p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="relative">
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} disabled={generating} className="text-[11px] tracking-[0.2em]">
              {current.name} <span className="text-[#BFA98E]">▾</span>
            </button>
            {menuOpen && (
              <div className="absolute bottom-full left-0 z-20 mb-3 w-72 rounded-xl border border-white/10 bg-[#0d0d0d] py-2 shadow-2xl">
                {models.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setModel(item.id); setMenuOpen(false); }}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/5 ${model === item.id ? 'text-[#BFA98E]' : 'text-white/70'}`}
                  >
                    <span className="text-[11px] tracking-[0.12em]">{item.name}</span>
                    <span className="text-[8px] tracking-[0.2em] text-white/30">{item.tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-4">
            {ratios.map((r) => (
              <button key={r} type="button" onClick={() => setRatio(r)} disabled={generating} className={`text-[11px] tracking-[0.15em] ${ratio === r ? 'text-[#BFA98E]' : 'text-white/35 hover:text-white'}`}>{r}</button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {styles.map((st) => (
            <button key={st.id} type="button" onClick={() => setStyle(style === st.id ? '' : st.id)} disabled={generating} className={`text-[10px] tracking-[0.2em] ${style === st.id ? 'text-[#BFA98E]' : 'text-white/35 hover:text-white'}`}>{st.name}</button>
          ))}
        </div>
      </main>

      <footer className="px-6 py-8 text-center text-[9px] tracking-[0.25em] text-white/20">
        GOPAL AI STUDIO · FREE ON CLOUDFLARE
      </footer>
    </div>
  );
}

export default AIStudioPage;
