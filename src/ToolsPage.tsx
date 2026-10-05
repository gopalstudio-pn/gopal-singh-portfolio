import { ReactNode } from 'react';
import { ToolShell } from './components/ToolShell';
import { BentoCard } from './components/BentoCard';
import { STYLES } from './lib/fancyText';

const mont = { fontFamily: "'Montserrat', sans-serif" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;
const sample = (id: string) => STYLES.find((s) => s.id === id)?.fn('Gopal') || 'Gopal';

const Icon = ({ d }: { d: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Tag = ({ children }: { children: ReactNode }) => (
  <span className="border border-[#D4AF37]/40 px-2 py-1 text-[8px] tracking-[0.3em] text-[#D4AF37]" style={mont}>
    {children}
  </span>
);

const Tool = ({ href, icon, title, desc, preview, tag, delay }: { href?: string; icon: string; title: string; desc: string; preview: ReactNode; tag?: string; delay: number }) => {
  const body = (
    <>
      <span className="flex items-center justify-between">
        <Icon d={icon} />
        {tag ? <Tag>{tag}</Tag> : null}
      </span>
      <span className="block min-h-[64px]">{preview}</span>
      <span className="block">
        <span className="block text-3xl tracking-[0.06em] text-[#EAD8C7]" style={bebas}>{title}</span>
        <span className="mt-2 block text-sm font-light leading-relaxed text-white/50" style={mont}>{desc}</span>
      </span>
      <span className="mt-auto block text-[10px] tracking-[0.3em] text-[#C9A66B]" style={mont}>{href ? 'OPEN →' : 'COMING SOON'}</span>
    </>
  );
  return (
    <BentoCard delay={delay}>
      {href ? (
        <a href={href} className="flex h-full flex-col gap-5">{body}</a>
      ) : (
        <div className="flex h-full flex-col gap-5 opacity-50">{body}</div>
      )}
    </BentoCard>
  );
};

export default function ToolsPage() {
  return (
    <ToolShell title="Free Tools" desc="Free tools by Gopal Studio: stylish name generator, name logo maker and signature maker. No sign-up.">
      <section className="pb-12 pt-4 text-center">
        <p className="text-[10px] tracking-[0.4em] text-[#C9A66B]" style={mont}>FREE TOOLS · NO SIGN-UP</p>
        <h1 className="mt-5 text-[clamp(2.6rem,8vw,5.5rem)] uppercase leading-[0.9]" style={bebas}>
          <span className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] bg-clip-text text-transparent">Tools worth bookmarking</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm font-light text-white/50" style={mont}>Small, fast and free. Built by Gopal, made to be useful.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-3">
          <BentoCard delay={0}>
            <a href="/tools/name-studio" className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <span className="block">
                <span className="flex items-center gap-3">
                  <Tag>POPULAR</Tag>
                  <span className="text-[9px] tracking-[0.3em] text-white/40" style={mont}>FREE · NO SIGN-UP</span>
                </span>
                <span className="mt-5 block text-[clamp(2.4rem,6vw,4rem)] leading-none tracking-[0.04em] text-[#EAD8C7]" style={bebas}>NAME STUDIO</span>
                <span className="mt-3 block max-w-md text-sm font-light leading-relaxed text-white/50" style={mont}>
                  Your name in 60 stylish fonts, as a logo, or as a handwritten signature. Copy it or download it in seconds.
                </span>
                <span className="mt-6 block text-[10px] tracking-[0.3em] text-[#C9A66B]" style={mont}>OPEN NAME STUDIO →</span>
              </span>
              <span className="block space-y-2 text-left md:text-right">
                <span className="block text-3xl text-[#EAD8C7]">{sample('bscript')}</span>
                <span className="block text-3xl text-[#C9A66B]">{sample('smallcaps')}</span>
                <span className="block text-3xl text-[#EAD8C7]/70">{sample('fraktur')}</span>
              </span>
            </a>
          </BentoCard>
        </div>

        <Tool
          href="/tools/name-studio#stylish"
          icon="M4 20L10 4l6 16M6.5 14h7M18 9v11M15 13h6"
          title="STYLISH TEXT"
          desc="60 fancy styles for Instagram, WhatsApp and game names. Tap to copy."
          preview={<span className="block text-2xl text-[#EAD8C7]">{sample('smallcaps')}</span>}
          delay={0.05}
        />
        <Tool
          href="/tools/name-studio#logo"
          icon="M12 3l8 4.5v9L12 21l-8-4.5v-9z"
          title="NAME LOGO"
          desc="Turn your name into a logo or a round profile picture. 8 styles."
          preview={<span className="inline-block bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#7A5A2A] bg-clip-text text-4xl tracking-[0.12em] text-transparent" style={bebas}>GOPAL</span>}
          delay={0.1}
        />
        <Tool
          href="/tools/name-studio#signature"
          icon="M3 17c3-6 5-9 7-9s1 6 3 6 3-4 5-4M3 21h18"
          title="SIGNATURE"
          desc="A handwritten signature as a transparent PNG. 9 handwriting styles."
          preview={<span className="block text-4xl text-[#EAD8C7]" style={{ fontFamily: "'Great Vibes', cursive" }}>Gopal</span>}
          delay={0.15}
        />
        <Tool
          href="/tools/nepali-date"
          icon="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"
          title="NEPALI DATE CONVERTER"
          desc="BS and AD dates, today in Nepal and an exact age calculator."
          preview={<span className="block text-2xl text-[#EAD8C7]" style={mont}>२०८३ ↔ 2026</span>}
          tag="NEW"
          delay={0.2}
        />
        <Tool
          icon="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z"
          title="WHATSAPP LINK & QR"
          desc="Make a click-to-chat link and a QR code in one step."
          preview={<span className="block text-2xl text-white/40" style={mont}>wa.me · QR</span>}
          tag="SOON"
          delay={0.25}
        />
      </div>

      <p className="mt-14 text-center text-xs font-light text-white/40" style={mont}>
        Have an idea for a tool? <a href="/connect" className="text-[#C9A66B] underline-offset-4 hover:underline">Tell me</a>.
      </p>
    </ToolShell>
  );
}
