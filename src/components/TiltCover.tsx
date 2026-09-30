import React, { useRef } from 'react';

const css = `
@keyframes bookFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@media (prefers-reduced-motion: reduce) { .book-float { animation: none !important; } }
`;

export const TiltCover: React.FC<{ src: string; alt: string; delay?: number }> = ({ src, alt, delay = 0 }) => {
  const tiltRef = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 22}deg) scale(1.04)`;
  };

  const leave = () => {
    const el = tiltRef.current;
    if (el) el.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
  };

  return (
    <div
      className="book-float w-full max-w-[280px]"
      style={{ perspective: '900px', animation: `bookFloat 5s ease-in-out ${delay}s infinite` }}
    >
      <style>{css}</style>
      <div
        ref={tiltRef}
        onPointerMove={move}
        onPointerLeave={leave}
        onPointerCancel={leave}
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.2s ease-out' }}
      >
        <img src={src} alt={alt} className="aspect-[2/3] w-full object-cover shadow-2xl" />
      </div>
    </div>
  );
};
