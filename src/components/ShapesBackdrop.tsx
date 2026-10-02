import { Suspense, lazy, useEffect, useRef, useState } from 'react';

const ShapesScene = lazy(() => import('./ShapesScene'));

export const ShapesBackdrop = () => {
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
      { rootMargin: '300px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [weak]);

  if (weak) return null;
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-70">
      {load && (
        <Suspense fallback={null}>
          <ShapesScene />
        </Suspense>
      )}
    </div>
  );
};
