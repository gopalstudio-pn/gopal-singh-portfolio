import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const BentoCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', x * 100 + '%');
    el.style.setProperty('--my', y * 100 + '%');
    rx.set((0.5 - y) * 10);
    ry.set((x - 0.5) * 10);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onPointerMove={move}
      onPointerLeave={leave}
      className="glass-card group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-white/10 p-7 transition-colors duration-500 hover:border-[#C9A66B]/50"
    >
      {children}
    </motion.div>
  );
};
