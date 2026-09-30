import React, { useEffect, useState } from 'react';

const css = `
@keyframes introGlow { 0% { transform: scale(0.3); opacity: 0; } 60% { opacity: 0.9; } 100% { transform: scale(1.4); opacity: 0.55; } }
@keyframes introText { 0% { opacity: 0; letter-spacing: 0.1em; filter: blur(8px); } 100% { opacity: 1; letter-spacing: 0.5em; filter: blur(0); } }
@keyframes introLine { 0% { width: 0; } 100% { width: 12rem; } }
@keyframes introFade { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
`;

export const IntroSplash: React.FC = () => {
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem('introSeen') !== '1';
    } catch {
      return true;
    }
  });
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem('introSeen', '1');
    } catch {}
    const t1 = setTimeout(() => setFade(true), 2500);
    const t2 = setTimeout(() => setShow(false), 3300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-700 ${fade ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <style>{css}</style>
      <div className="relative flex flex-col items-center">
        <div
          className="absolute h-64 w-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.35), transparent 70%)', animation: 'introGlow 2.2s ease-out forwards' }}
        />
        <img
          src="/gopal-logo.png"
          alt=""
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="relative mb-6 h-16 w-16 object-contain"
          style={{ animation: 'introFade 1.2s ease-out 0.2s both' }}
        />
        <h1
          className="relative text-5xl uppercase text-[#EAD8C7] md:text-7xl"
          style={{ fontFamily: "'Bebas Neue', sans-serif", animation: 'introText 2s ease-out 0.4s both' }}
        >
          Gopal
        </h1>
        <div
          className="relative mt-5 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          style={{ animation: 'introLine 1.6s ease-out 0.9s both' }}
        />
        <p
          className="relative mt-4 text-[10px] tracking-[0.4em] text-[#C4B29E]"
          style={{ fontFamily: "'Montserrat', sans-serif", animation: 'introFade 1.2s ease-out 1.3s both' }}
        >
          PORTFOLIO
        </p>
      </div>
    </div>
  );
};
