import { ReactNode, useEffect, useState } from 'react';

const mont = { fontFamily: "'Montserrat', sans-serif" } as const;

export const ToolShell = ({ title, desc, children }: { title: string; desc: string; children: ReactNode }) => {
  const [note, setNote] = useState('');

  useEffect(() => {
    document.title = title + ' | Gopal Studio';
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', desc);
  }, [title, desc]);

  const share = async () => {
    const url = window.location.href;
    try {
      const nav: any = navigator;
      if (nav.share) {
        await nav.share({ title: title + ' | Gopal Studio', text: desc, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setNote('LINK COPIED ✓');
      window.setTimeout(() => setNote(''), 1800);
    } catch {}
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-[#E8DFD8]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]"
        style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, #000 0%, transparent 70%)',
          maskImage: 'radial-gradient(ellipse at 50% 0%, #000 0%, transparent 70%)',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-12rem] h-[30rem] w-[44rem] max-w-full -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.07] blur-[120px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="/" className="flex items-center gap-3">
          <img src="/gopal-logo.png" alt="" className="h-8 w-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <span className="text-xl tracking-[0.18em] text-[#EAD8C7]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>GOPAL</span>
        </a>
        <nav className="flex items-center gap-5 text-[10px] tracking-[0.3em] text-[#C4B29E]" style={mont}>
          <a href="/tools" className="transition-colors hover:text-white">TOOLS</a>
          <a href="/books" className="hidden transition-colors hover:text-white sm:inline">LIBRARY</a>
          <a href="/ai-studio" className="hidden transition-colors hover:text-white sm:inline">AI STUDIO</a>
          <a href="/" className="transition-colors hover:text-white">HOME</a>
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-6 sm:px-8">{children}</main>

      <footer className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between border-t border-white/10 px-5 py-8 text-[10px] tracking-[0.3em] sm:px-8" style={mont}>
        <a href="/" className="text-white/35 transition-colors hover:text-[#C9A66B]">MADE AT GOPAL STUDIO</a>
        <button type="button" onClick={share} className="border border-[#8C6D4F]/50 px-4 py-2 text-[#EAD8C7] transition-colors hover:border-[#D4AF37]" style={{ cursor: 'pointer' }}>
          {note || 'SHARE ↗'}
        </button>
      </footer>
    </div>
  );
};
