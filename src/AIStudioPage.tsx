import React, { useState } from 'react';

function AIStudioPage() {
  const [prompt, setPrompt] = useState('');
  const [reference, setReference] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file?: File) => {
    if (file && file.type.startsWith('image/')) {
      setReference(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#E8DFD8]">
      {/* Header */}
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

      {/* Hero */}
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

        {/* Creator */}
        <section className="mt-20 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Prompt */}
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
                placeholder="Describe the image you want to create..."
                className="min-h-[240px] w-full resize-none bg-transparent text-lg font-light leading-8 text-white outline-none placeholder:text-white/20"
              />

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-[9px] tracking-[0.2em] text-white/25">
                  {prompt.length}/1000
                </span>

                <button
                  type="button"
                  className="border border-[#BFA98E]/40 px-7 py-3 text-[10px] tracking-[0.25em] text-[#E8DFD8] transition-all hover:bg-[#BFA98E] hover:text-black"
                >
                  GENERATE ↗
                </button>
              </div>
            </div>
          </div>

          {/* Reference */}
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
                  <p className="text-sm text-white/80">{reference.name}</p>
                  <p className="mt-2 text-[9px] tracking-[0.2em] text-[#BFA98E]">
                    REFERENCE READY
                  </p>
                </div>
              ) : (
                <>
                  <span className="text-3xl font-light text-white/20">+</span>
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

        {/* Creative controls */}
        <section className="mt-6 border border-white/10 bg-white/[0.025]">
          <div className="border-b border-white/10 px-6 py-5">
            <span className="text-[10px] tracking-[0.3em] text-white/50">
              03 — CREATIVE DIRECTION
            </span>
          </div>

          <div className="grid md:grid-cols-3">
            <button className="border-b border-white/10 p-6 text-left transition-colors hover:bg-white/[0.03] md:border-r">
              <span className="text-[9px] tracking-[0.25em] text-[#BFA98E]">
                STYLE
              </span>
              <p className="mt-3 text-sm text-white/70">Cinematic</p>
            </button>

            <button className="border-b border-white/10 p-6 text-left transition-colors hover:bg-white/[0.03] md:border-r">
              <span className="text-[9px] tracking-[0.25em] text-[#BFA98E]">
                LIGHTING
              </span>
              <p className="mt-3 text-sm text-white/70">Studio</p>
            </button>

            <button className="p-6 text-left transition-colors hover:bg-white/[0.03]">
              <span className="text-[9px] tracking-[0.25em] text-[#BFA98E]">
                FORMAT
              </span>
              <p className="mt-3 text-sm text-white/70">1 : 1</p>
            </button>
          </div>
        </section>

        {/* Status / future generation area */}
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

            <p className="text-[9px] tracking-[0.25em] text-white/20">
              GENERATION ENGINE · COMING ONLINE
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
