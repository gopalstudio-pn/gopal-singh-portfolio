import { Suspense, lazy, useEffect, useRef, useState } from 'react';

const BookShelfScene = lazy(() => import('./BookShelfScene'));

type Book = { title: string; cover: string };

export const BookShelfSection = ({ books }: { books: Book[] }) => {
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

  const pick = (title: string) => {
    const el = document.getElementById('book-' + title.replace(/[^a-z0-9]/gi, '-'));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (weak) return null;
  return (
    <div className="mt-16">
      <div ref={ref} className="relative h-[340px] w-full sm:h-[420px]">
        {load && (
          <Suspense fallback={null}>
            <BookShelfScene books={books} onPick={pick} />
          </Suspense>
        )}
      </div>
      <p className="mt-2 text-center text-[9px] tracking-[0.3em] text-[#8C6D4F]">TAP A BOOK TO PULL IT OUT · TAP AGAIN TO JUMP TO IT</p>
    </div>
  );
};
