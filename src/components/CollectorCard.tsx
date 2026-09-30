import React, { useEffect, useRef, useState } from 'react';

const stats: [string, number][] = [
  ['WEB & DIGITAL', 90],
  ['AI & TECHNOLOGY', 96],
  ['CREATIVE', 88],
  ['COMMUNICATION', 85],
  ['PERSONAL', 92],
];

export const CollectorCard: React.FC<{ image: string; onClose: () => void }> = ({ image, onClose }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState('GOPAL');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const W = 800;
      const H = 1200;
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#1a1409');
      bg.addColorStop(1, '#050505');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 6;
      ctx.strokeRect(24, 24, W - 48, H - 48);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 40, W - 80, H - 80);
      ctx.fillStyle = '#EAD8C7';
      ctx.font = '84px "Bebas Neue", Impact, sans-serif';
      ctx.fillText(name.toUpperCase().slice(0, 14), 70, 140);
      ctx.fillStyle = '#D4AF37';
      ctx.font = '22px Montserrat, Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('★ LEGENDARY', W - 70, 130);
      ctx.textAlign = 'left';
      const bx = 70;
      const by = 170;
      const bw = 660;
      const bh = 560;
      const s = Math.max(bw / img.width, bh / img.height);
      const sw = bw / s;
      const sh = bh / s;
      ctx.save();
      ctx.beginPath();
      ctx.rect(bx, by, bw, bh);
      ctx.clip();
      ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, bx, by, bw, bh);
      ctx.restore();
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 3;
      ctx.strokeRect(bx, by, bw, bh);
      stats.forEach(([label, value], i) => {
        const y = 790 + i * 60;
        ctx.fillStyle = '#C4B29E';
        ctx.font = '20px Montserrat, Arial, sans-serif';
        ctx.fillText(label, 70, y);
        ctx.fillStyle = '#EAD8C7';
        ctx.textAlign = 'right';
        ctx.fillText(String(value), W - 70, y);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#2a2318';
        ctx.fillRect(70, y + 12, 660, 8);
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(70, y + 12, (660 * value) / 100, 8);
      });
      ctx.fillStyle = '#7a6a55';
      ctx.font = '16px Montserrat, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GOPAL AI STUDIO  ·  No. 001', W / 2, H - 62);
      ctx.textAlign = 'left';
      setReady(true);
    };
    img.src = image;
  }, [image, name]);

  const download = () => {
    const canvas = ref.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'gopal-collector-card.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center overflow-y-auto bg-black/90 px-4 py-8 backdrop-blur">
      <canvas ref={ref} width={800} height={1200} className="w-full max-w-[340px] shadow-[0_0_60px_rgba(212,175,55,0.25)]" />
      {!ready && <p className="mt-4 text-[10px] tracking-[0.3em] text-[#BFA98E]">BUILDING CARD...</p>}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={14}
        className="mt-6 w-full max-w-[340px] border-b border-white/20 bg-transparent py-2 text-center text-sm tracking-[0.3em] text-white outline-none"
        placeholder="YOUR NAME"
      />
      <div className="mt-6 flex gap-8 text-[10px] tracking-[0.25em]">
        <button type="button" onClick={download} className="text-[#BFA98E] hover:text-white">DOWNLOAD ↓</button>
        <button type="button" onClick={onClose} className="text-white/50 hover:text-white">CLOSE</button>
      </div>
    </div>
  );
};
