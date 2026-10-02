import { Suspense, lazy, useEffect, useRef, useState } from 'react';

const GlobeScene = lazy(() => import('./GlobeScene'));

export const GlobeSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [weak] = useState(() => {
    const nav: any = navigator;
    return !!(nav.hardwareConcurrency && nav.hardwareConcurrency <= 2);
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || weak) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [weak]);

  return (
    <section className="relative w-full overflow-hidden bg-black px-6 py-20 sm:px-12 lg:px-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-[#C9A66B]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            BASED IN
          </p>
          <h2 className="mt-4 text-[clamp(4rem,10vw,8rem)] uppercase leading-[0.85]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            <span className="bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A] bg-clip-text text-transparent">NEPAL</span>
          </h2>
          <p className="mt-5 text-sm font-light tracking-wide text-white/50" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Golbazar, Siraha, Nepal.
          </p>
        </div>
        {!weak && (
          <div ref={ref} aria-hidden="true" className="relative h-[320px] w-full sm:h-[380px]">
            {load && (
              <Suspense fallback={null}>
                <GlobeScene />
              </Suspense>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
