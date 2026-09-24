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
      { threshold: 0.35 }
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
        <source media="(max-width: 767px)" srcSet="/mobile.png" />
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
