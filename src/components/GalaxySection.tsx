import { Suspense, lazy, useEffect, useRef, useState } from 'react';

const GalaxyScene = lazy(() => import('./GalaxyScene'));

export const GalaxySection = () => {
  const ref = useRef<HTMLElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nav: any = navigator;
    if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return;
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
  }, []);

  return (
    <section ref={ref} aria-hidden="true" className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08), transparent 60%)' }} />
      {load && (
        <Suspense fallback={null}>
          <GalaxyScene />
        </Suspense>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
      <p className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-[10px] tracking-[0.5em] text-[#D4AF37]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        THE STORY CONTINUES
      </p>
    </section>
  );
};
