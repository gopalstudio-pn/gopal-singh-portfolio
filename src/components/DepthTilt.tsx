import { useEffect } from 'react';

export const DepthTilt = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const apply = () => {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      document.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
        const d = parseFloat(el.dataset.depth || '1');
        el.style.translate = (-cx * 6 * d).toFixed(2) + 'px ' + (-cy * 6 * d).toFixed(2) + 'px';
      });
      raf = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(apply) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    };
    const orient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 25));
      ty = Math.max(-1, Math.min(1, (e.beta - 50) / 25));
      kick();
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('deviceorientation', orient, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('deviceorientation', orient);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
};
