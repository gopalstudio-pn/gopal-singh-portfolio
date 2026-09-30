import { useEffect, useRef } from "react";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        section.classList.toggle("about-visible", entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section relative min-h-screen overflow-hidden bg-black"
    >
<picture className="absolute inset-0 block h-full w-full">
  <source
    media="(orientation: portrait)"
    srcSet="/mobile.png"
  />
  <img
    src="/desktop.png"
    alt="Gopal Singh"
    className="about-image h-full w-full object-cover object-center"
  />
</picture>
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />

      <div className="about-light pointer-events-none absolute left-[-20%] top-[-20%] h-[140%] w-[35%] rotate-[12deg] bg-white/[0.035] blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="w-full px-7 py-24 sm:px-12 md:px-16 lg:px-20 xl:px-28">
          <div className="max-w-[560px]">
            <div className="about-item about-label mb-8 text-[10px] font-medium uppercase tracking-[0.35em] text-white/50">
              01 — About
            </div>

            <h2 className="about-item about-name mb-7 font-serif text-[clamp(3rem,6vw,6.5rem)] font-light uppercase leading-[0.88] tracking-[0.08em] text-white">
              Gopal Singh
            </h2>

            <h3 className="about-item about-heading mb-6 max-w-[430px] text-[clamp(1.5rem,2.5vw,2.4rem)] font-light leading-[1.1] tracking-[-0.02em] text-white">
              Curious by nature.
              <br />
              Creating with purpose.
            </h3>

            <p className="about-item about-copy max-w-[470px] text-sm font-light leading-7 tracking-[0.01em] text-white/75 sm:text-base">
              I’m interested in the space where creativity meets technology —
              photography, AI, digital experiences, and the process of turning
              curiosity into something tangible.
            </p>

            <div className="mt-12 space-y-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <div className="about-item" style={{ transitionDelay: '0.42s' }}>
                <div className="flex items-center gap-3 text-[#D4AF37]">
                  <svg width="14" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.6" /></svg>
                  <span className="text-[11px] font-medium tracking-[0.35em]">GOLBAZAR, SIRAHA, NEPAL</span>
                </div>
                <div className="mt-3 h-px w-40 bg-gradient-to-r from-[#D4AF37] to-transparent" />
              </div>

              <div className="about-item" style={{ transitionDelay: '0.5s' }}>
                <p className="mb-4 text-[10px] tracking-[0.35em] text-white/40">THE JOURNEY</p>
                <div className="space-y-3 border-l border-[#D4AF37]/40 pl-5">
                  <p className="text-xs leading-6 text-white/70"><span className="mr-3 text-[#D4AF37]">2018</span>SEE · JVM Higher Secondary School, Golbazar</p>
                  <p className="text-xs leading-6 text-white/70"><span className="mr-3 text-[#D4AF37]">2020</span>+2 Science · Mount Everest Boarding School</p>
                </div>
              </div>

              <div className="about-item" style={{ transitionDelay: '0.58s' }}>
                <p className="mb-3 text-[10px] tracking-[0.35em] text-white/40">BEYOND THE SCREEN</p>
                <p className="text-xs tracking-[0.2em] text-white/70">CRICKET <span className="mx-2 text-[#D4AF37]">•</span> BOOKS <span className="mx-2 text-[#D4AF37]">•</span> TRAVEL</p>
              </div>

              <div className="about-item" style={{ transitionDelay: '0.66s' }}>
                <p className="mb-3 text-[10px] tracking-[0.35em] text-white/40">LANGUAGES</p>
                <p className="text-xs leading-6 tracking-[0.2em] text-white/70">ENGLISH <span className="mx-1 text-[#D4AF37]">•</span> MAITHILI <span className="mx-1 text-[#D4AF37]">•</span> NEPALI <span className="mx-1 text-[#D4AF37]">•</span> HINDI <span className="mx-1 text-[#D4AF37]">•</span> BHOJPURI</p>
              </div>

              <div className="about-item" style={{ transitionDelay: '0.74s' }}>
                <p className="mb-4 text-[10px] tracking-[0.35em] text-white/40">FAVORITES</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  {[['CRICKETER', 'MS Dhoni'], ['IPL TEAM', 'Chennai Super Kings'], ['NPL TEAM', 'Janakpur Bolts'], ['PLACE', 'Vrindavan'], ['MOVIE', 'Ranjhana'], ['BOOK', 'The Psychology of Money']].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[9px] tracking-[0.3em] text-[#D4AF37]/80">{k}</p>
                      <p className="mt-1 text-xs text-white/75">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[9px] tracking-[0.3em] text-[#D4AF37]/80">ACTORS</p>
                <p className="mt-1 text-xs text-white/75">Robert Downey Jr. · Hrithik Roshan · Ranveer Kapoor</p>
              </div>

              <div className="about-item" style={{ transitionDelay: '0.82s' }}>
                <p className="font-serif text-lg font-light italic text-[#D4AF37]">“Millionaire, one day.”</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .about-item {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 1s cubic-bezier(.16,1,.3,1),
            transform 1s cubic-bezier(.16,1,.3,1),
            letter-spacing 1.2s cubic-bezier(.16,1,.3,1);
        }

        .about-label {
          transition-delay: 0s;
        }

        .about-name {
          transform: translateY(32px);
          letter-spacing: .18em;
          transition-delay: .08s;
        }

        .about-heading {
          transition-delay: .18s;
        }

        .about-copy {
          transition-delay: .30s;
        }

        .about-visible .about-item {
          opacity: 1;
          transform: translateY(0);
        }

        .about-visible .about-name {
          letter-spacing: .08em;
        }

        .about-image {
          transform: scale(1);
          transition: transform 2.2s cubic-bezier(.16,1,.3,1);
        }

        .about-visible .about-image {
          transform: scale(1.018);
        }

        .about-light {
          opacity: .15;
          transform: translateX(-10%) rotate(12deg);
          transition:
            transform 2.5s cubic-bezier(.16,1,.3,1),
            opacity 2.5s ease;
        }

        .about-visible .about-light {
          opacity: .75;
          transform: translateX(30%) rotate(12deg);
        }

        @media (prefers-reduced-motion: reduce) {
          .about-item,
          .about-image,
          .about-light {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
