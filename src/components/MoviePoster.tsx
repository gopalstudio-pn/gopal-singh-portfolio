import React, { useEffect, useRef, useState } from 'react';

export const MoviePoster: React.FC<{ image: string; onClose: () => void }> = ({ image, onClose }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [title, setTitle] = useState('GOPAL');
  const [tag, setTag] = useState('THE STORY BEGINS');
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
      const s = Math.max(W / img.width, H / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      const top = ctx.createLinearGradient(0, 0, 0, 300);
      top.addColorStop(0, 'rgba(0,0,0,0.75)');
      top.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = top;
      ctx.fillRect(0, 0, W, 300);
      const bot = ctx.createLinearGradient(0, 600, 0, H);
      bot.addColorStop(0, 'rgba(0,0,0,0)');
      bot.addColorStop(0.75, 'rgba(0,0,0,0.92)');
      bot.addColorStop(1, 'rgba(0,0,0,0.97)');
      ctx.fillStyle = bot;
      ctx.fillRect(0, 600, W, 600);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#EAD8C7';
      ctx.font = '20px Montserrat, Arial, sans-serif';
      ctx.fillText('GOPAL AI STUDIO PRESENTS', W / 2, 72);
      const text = title.toUpperCase().slice(0, 14);
      let size = 190;
      ctx.font = size + 'px "Bebas Neue", Impact, sans-serif';
      while (ctx.measureText(text).width > 700 && size > 60) {
        size -= 8;
        ctx.font = size + 'px "Bebas Neue", Impact, sans-serif';
      }
      const gold = ctx.createLinearGradient(0, 780, 0, 990);
      gold.addColorStop(0, '#F7E7C4');
      gold.addColorStop(0.5, '#C99E5D');
      gold.addColorStop(1, '#7a5a2a');
      ctx.fillStyle = gold;
      ctx.fillText(text, W / 2, 985);
      ctx.fillStyle = '#D4AF37';
      ctx.font = '26px Montserrat, Arial, sans-serif';
      ctx.fillText(tag.toUpperCase().slice(0, 34), W / 2, 1050);
      ctx.fillRect(250, 1078, 300, 2);
      ctx.fillStyle = '#8a7a65';
      ctx.font = '15px Montserrat, Arial, sans-serif';
      ctx.fillText('STARRING  ·  DIRECTED BY GOPAL  ·  COMING SOON', W / 2, 1130);
      setReady(true);
    };
    img.src = image;
  }, [image, title, tag]);

  const download = () => {
    const canvas = ref.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'gopal-movie-poster.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center overflow-y-auto bg-black/90 px-4 py-8 backdrop-blur">
      <canvas ref={ref} width={800} height={1200} className="w-full max-w-[340px] shadow-[0_0_60px_rgba(212,175,55,0.25)]" />
      {!ready && <p className="mt-4 text-[10px] tracking-[0.3em] text-[#BFA98E]">BUILDING POSTER...</p>}
      <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={14} className="mt-6 w-full max-w-[340px] border-b border-white/20 bg-transparent py-2 text-center text-sm tracking-[0.3em] text-white outline-none" placeholder="MOVIE TITLE" />
      <input value={tag} onChange={(e) => setTag(e.target.value)} maxLength={34} className="mt-3 w-full max-w-[340px] border-b border-white/20 bg-transparent py-2 text-center text-xs tracking-[0.3em] text-white/70 outline-none" placeholder="TAGLINE" />
      <div className="mt-6 flex gap-8 text-[10px] tracking-[0.25em]">
        <button type="button" onClick={download} className="text-[#BFA98E] hover:text-white">DOWNLOAD ↓</button>
        <button type="button" onClick={onClose} className="text-white/50 hover:text-white">CLOSE</button>
      </div>
    </div>
  );
};
