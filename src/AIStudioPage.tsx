
import React, { useState } from 'react';

const ratios = ['1:1', '4:3', '3:4', '16:9', '9:16'];

const models = [
  { id: 'flux-klein-4b', name: 'FLUX.2 Klein 4B', provider: 'Cloudflare' },
  { id: 'flux-klein-9b', name: 'FLUX.2 Klein 9B', provider: 'Cloudflare' },
  { id: 'flux-dev', name: 'FLUX.2 Dev', provider: 'Cloudflare' },
  { id: 'flux-schnell', name: 'FLUX.1 Schnell', provider: 'Cloudflare' },
  { id: 'nano-banana', name: 'Nano Banana', provider: 'Google' },
  { id: 'nano-banana-2', name: 'Nano Banana 2', provider: 'Google' },
  { id: 'nano-banana-pro', name: 'Nano Banana Pro', provider: 'Google' },
];

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

      formData.append('prompt', prompt.trim());
      formData.append('ratio', ratio);
      formData.append('model', model);

      if (reference) {
        setStage('PROCESSING REFERENCE');
        formData.append('reference', reference);
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

  return (
    <div className="min-h-screen bg-[#080808] text-[#E8DFD8]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <a
            href="/"
            className="text-xs tracking-[0.35em] text-[#E8DFD8] transition-opacity hover:opacity-60"
          >
            GOPAL
          </a>

          <div className="text-[10px] tracking-[0.35em] text-white/40">
            AI STUDIO
          </div>

          <a
            href="/"
            className="text-[10px] tracking-[0.25em] text-white/50 transition-colors hover:text-white"
          >
            ← BACK
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-10 md:pt-24">
        <div className="max-w-4xl">
          <p className="mb-5 text-[10px] tracking-[0.4em] text-[#BFA98E]">
            GOPAL AI STUDIO
          </p>

          <h1 className="text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-8xl">
            CREATE
            <br />
            WITHOUT
            <br />
            LIMITS.
          </h1>

          <p className="mt-8 max-w-xl text-sm leading-7 text-white/50 md:text-base">
            Turn an idea, image, or reference into something completely new.
          </p>
        </div>

        <section className="mb-6 border border-white/10 bg-white/[0.025]">
  <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
    <span className="text-[10px] tracking-[0.3em] text-white/50">
      AI MODEL
    </span>
    <span className="text-[9px] tracking-[0.2em] text-white/25">
      CHOOSE ENGINE
    </span>
  </div>

  <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
    {models.map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => setModel(item.id)}
        disabled={generating}
        className={`min-h-[90px] bg-[#080808] px-5 py-4 text-left transition-all ${
          model === item.id
            ? 'bg-[#BFA98E]/10 text-[#E8DFD8]'
            : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
        }`}
      >
        <div className="text-[11px] tracking-[0.12em]">
          {item.name}
        </div>
        <div className="mt-2 text-[8px] tracking-[0.2em] text-white/25">
          {item.provider}
        </div>
      </button>
    ))}
  </div>
</section>

<section className="mt-20 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="border border-white/10 bg-white/[0.025]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <span className="text-[10px] tracking-[0.3em] text-white/50">
                01 — PROMPT
              </span>

              <span className="text-[9px] tracking-[0.2em] text-white/25">
                TEXT TO IMAGE
              </span>
            </div>

            <div className="p-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={1000}
                disabled={generating}
                placeholder="Describe the image you want to create..."
                className="min-h-[240px] w-full resize-none bg-transparent text-lg font-light leading-8 text-white outline-none placeholder:text-white/20 disabled:opacity-50"
              />

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-[9px] tracking-[0.2em] text-white/25">
                  {prompt.length}/1000
                </span>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="border border-[#BFA98E]/40 px-7 py-3 text-[10px] tracking-[0.25em] text-[#E8DFD8] transition-all hover:bg-[#BFA98E] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {generating ? 'GENERATING...' : 'GENERATE ↗'}
                </button>
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.025]">
            <div className="border-b border-white/10 px-6 py-5">
              <span className="text-[10px] tracking-[0.3em] text-white/50">
                02 — REFERENCE
              </span>
            </div>

            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              className={`m-6 flex min-h-[250px] cursor-pointer flex-col items-center justify-center border border-dashed transition-all ${
                dragActive
                  ? 'border-[#BFA98E] bg-[#BFA98E]/5'
                  : 'border-white/15 hover:border-white/30'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {reference ? (
                <div className="px-6 text-center">
                  <p className="text-sm text-white/80">
                    {reference.name}
                  </p>

                  <p className="mt-2 text-[9px] tracking-[0.2em] text-[#BFA98E]">
                    REFERENCE READY
                  </p>
                </div>
              ) : (
                <>
                  <span className="text-3xl font-light text-white/20">
                    +
                  </span>

                  <span className="mt-4 text-[10px] tracking-[0.25em] text-white/45">
                    ADD REFERENCE IMAGE
                  </span>

                  <span className="mt-2 text-[9px] text-white/20">
                    JPG · PNG · WEBP
                  </span>
                </>
              )}
            </label>
          </div>
        </section>

        <section className="mt-6 border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/10 px-6 py-5">
            <span className="text-[10px] tracking-[0.3em] text-white/50">
              03 — FORMAT
            </span>
          </div>

          <div className="grid grid-cols-5">
            {ratios.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRatio(item)}
                disabled={generating}
                className={`border-r border-white/10 p-5 text-center transition-all last:border-r-0 ${
                  ratio === item
                    ? 'bg-[#BFA98E] text-black'
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <span className="text-sm tracking-[0.15em]">
                  {item}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 px-6 py-4">
            <p className="text-[9px] tracking-[0.2em] text-white/25">
              SELECT OUTPUT RATIO · {ratio}
            </p>
          </div>
        </section>

        {generating && (
          <section className="mt-6 border border-[#BFA98E]/20 bg-[#BFA98E]/[0.03] px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#BFA98E]" />

              <div>
                <p className="text-[9px] tracking-[0.3em] text-[#BFA98E]">
                  AI ENGINE
                </p>

                <p className="mt-2 text-sm tracking-[0.12em] text-white/60">
                  {stage}
                </p>
              </div>
            </div>
          </section>
        )}

        {error && (
          <section className="mt-6 border border-red-300/10 bg-red-300/[0.03] px-6 py-5">
            <p className="text-[10px] tracking-[0.15em] text-red-200/70">
              {error}
            </p>
          </section>
        )}

        {generatedImage && (
          <section className="mt-20">
            <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-[10px] tracking-[0.3em] text-[#BFA98E]">
                  04 — RESULT
                </p>

                <p className="mt-3 text-2xl font-light tracking-[-0.02em] text-white/90">
                  Your creation.
                </p>
              </div>

              <span className="text-[9px] tracking-[0.25em] text-white/25">
                GENERATED BY GOPAL AI
              </span>
            </div>

            <div className="border border-white/10 bg-white/[0.02] p-3 md:p-5">
              <img
                src={generatedImage}
                alt="AI generated result"
                className="mx-auto max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="border border-[#BFA98E]/40 px-6 py-3 text-[10px] tracking-[0.25em] text-[#E8DFD8] transition-all hover:bg-[#BFA98E] hover:text-black"
              >
                DOWNLOAD IMAGE ↗
              </button>

              <button
                type="button"
                onClick={handleCreateAgain}
                className="border border-white/10 px-6 py-3 text-[10px] tracking-[0.25em] text-white/50 transition-all hover:border-white/30 hover:text-white"
              >
                CREATE AGAIN
              </button>
            </div>
          </section>
        )}

        <section className="mt-20 border-t border-white/10 pt-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-[9px] tracking-[0.3em] text-white/25">
                POWERED BY
              </p>

              <p className="mt-2 text-sm tracking-[0.15em] text-white/50">
                GOPAL AI ENGINE
              </p>
            </div>

            <p className="text-[9px] tracking-[0.25em] text-[#BFA98E]/60">
              GENERATION ENGINE · ONLINE
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-7xl justify-between text-[9px] tracking-[0.25em] text-white/20">
          <span>GOPAL AI STUDIO</span>
          <span>CREATE · TRANSFORM · EDIT</span>
        </div>
      </footer>
    </div>
  );
}

export default AIStudioPage;
