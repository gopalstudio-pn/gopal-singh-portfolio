import { useEffect, useRef } from 'react';

export const Carousel3D = ({ images, onSelect }: { images: string[]; onSelect: (src: string) => void }) => {
  const ring = useRef<HTMLDivElement>(null);
  const rot = useRef(0);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const slots = Math.max(images.length, 5);
  const step = 360 / slots;
  const radius = 210;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const tick = () => {
      if (!drag.current && !reduced) rot.current -= 0.14;
      if (ring.current) ring.current.style.transform = 'translateZ(' + -radius + 'px) rotateY(' + rot.current + 'deg)';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="relative mx-auto mt-6 h-[170px] w-full max-w-md select-none"
      style={{ perspective: '900px', touchAction: 'pan-y' }}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, moved: false };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        if (Math.abs(dx) > 3) d.moved = true;
        rot.current += dx * 0.35;
        d.x = e.clientX;
      }}
      onPointerUp={() => {
        setTimeout(() => {
          drag.current = null;
        }, 0);
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
    >
      <div ref={ring} className="absolute left-1/2 top-1/2 -ml-[55px] -mt-[55px] h-[110px] w-[110px]" style={{ transformStyle: 'preserve-3d' }}>
        {images.map((img, i) => (
          <button
            key={img.slice(-24)}
            type="button"
            onClick={() => {
              if (drag.current && drag.current.moved) return;
              onSelect(img);
            }}
            className="absolute inset-0 overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_24px_rgba(212,175,55,0.25)]"
            style={{ transform: 'rotateY(' + i * step + 'deg) translateZ(' + radius + 'px)', backfaceVisibility: 'hidden' }}
          >
            <img src={img} alt="" draggable={false} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
