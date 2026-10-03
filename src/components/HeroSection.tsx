import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import watermarkImg from '../assets/watermark.png';
import { SplitText } from './SplitText';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.2,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const navItems = [
  { name: 'ABOUT', href: '#about' },
  { name: 'LIBRARY', href: '/books' },
  { name: 'AI STUDIO', href: '/ai-studio' },
  { name: 'TOOLS', href: '/tools' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'EDUCATION', href: '#experience' },
  { name: 'CONTACT', href: '#contact' },
];

export const HeroSection: React.FC = () => {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const sx = useSpring(mx, { damping: 30, stiffness: 350, mass: 0.5 });
  const sy = useSpring(my, { damping: 30, stiffness: 350, mass: 0.5 });
  const [cursorOn, setCursorOn] = useState(false);
  const { scrollY } = useScroll();
  const bgScale = useTransform(scrollY, [0, 600], [1, 1.12]);
  const bgY = useTransform(scrollY, [0, 600], [0, 50]);
  const bgFade = useTransform(scrollY, [0, 600], [1, 0.35]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setCursorOn(true);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-black text-[#E8DFD8] font-sans selection:bg-[#cbb59d] selection:text-black cursor-none">
      {/* ================= 1. MINIMAL CUSTOM CURSOR ================= */}
      {cursorOn && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-[#D4AF37]/40 flex items-center justify-center backdrop-blur-[1px]"
          animate={{
            marginLeft: isHovered ? -24 : -5,
            marginTop: isHovered ? -24 : -5,
            width: isHovered ? 48 : 10,
            height: isHovered ? 48 : 10,
            backgroundColor: isHovered ? 'rgba(212, 175, 55, 0.1)' : 'rgba(235, 215, 195, 0.95)',
          }}
          style={{ x: sx, y: sy }}
          transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.5 }}
        />
      )}

{/* ================= 2. FIXED IMAGE HERO LAYER ================= */}
<motion.div style={{ scale: bgScale, y: bgY, opacity: bgFade }} className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black will-change-transform">

<picture>
<source
  media="(min-width: 768px) and (orientation: landscape)"
  srcSet="/gopalsinghdesktop.png"
/>  <img
    src="/maingape.jpg"
    alt=""
    className="      absolute inset-0
      w-full h-full
      object-cover 
md:landscape:object-contain
      object-[62%_center]
      sm:object-[65%_center]
      md:object-[72%_center]
      lg:object-[74%_center]
      xl:object-[76%_center]
    "
  />
</picture>
  {/* Cinematic dark blend for website text */}
  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />

  {/* Subtle overall cinematic shadow */}
  <div className="absolute inset-0 bg-black/10" />

</motion.div>
      {/* ================= 4. CONTENT LAYER ================= */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full px-6 sm:px-12 lg:px-16 pt-6 pb-8 pointer-events-none">
        
        {/* Navigation Bar */}
        <header className="relative flex items-center justify-between w-full pointer-events-auto">
          <a
            data-egg href="#"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-[#EAD8C7] hover:opacity-75 transition-opacity"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            GOPAL
          </a>

          {/* Navigation Links */}
          <nav
            className="hidden md:flex items-center space-x-8 lg:space-x-10 text-[11px] tracking-[0.28em] font-light uppercase text-[#C4B5A5] absolute left-1/2 -translate-x-1/2"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative group py-1 transition-colors duration-300 hover:text-[#FFF5EB]"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37]/50 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <a
            data-magnetic href="#contact"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group flex items-center space-x-2 text-[11px] tracking-[0.24em] font-light uppercase py-2 px-4 border border-[#8C6D4F]/50 hover:border-[#D4AF37] text-[#EAD8C7] transition-all duration-300 backdrop-blur-sm ml-auto md:ml-0"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <span>LET&apos;S TALK</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">
              ↗
            </span>
          </a>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative z-[60] flex items-center justify-center w-10 h-10 border border-[#8C6D4F]/50 text-[#EAD8C7] pointer-events-auto"
            aria-label="Open menu"
          >
            <span className="text-xl leading-none">☰</span>
          </button>
        </header>

        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 pointer-events-auto">
            <div
              className="absolute inset-0 bg-black/35 backdrop-blur-xl"
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="absolute top-20 left-5 right-5 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
              <nav className="flex flex-col py-8">
                {navItems.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-8 py-4 text-sm tracking-[0.3em] uppercase text-[#EAD8C7] hover:text-[#D4AF37] transition-all duration-300"
                    style={{
                      animation: `menuItem 0.45s ease-out ${index * 70}ms both`,
                    }}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Hero Row */}
        <div className="relative flex flex-col md:flex-row items-center justify-between w-full pt-4 pb-2 my-auto">
          
          {/* LEFT: Balanced Headline & Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-[37rem] xl:max-w-[40rem] pointer-events-auto z-20"
          >
            {/* Massive Condensed Headline */}
            <motion.div variants={fadeUpVariants} data-depth="1" className="relative mb-3.5 select-none">
              <h1
                className="text-6xl sm:text-7xl md:text-[length:min(6rem,13vh)] lg:text-[length:min(7.2rem,13vh)] xl:text-[length:min(7.8rem,13vh)] tracking-tight uppercase leading-[0.83]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {/* Line 1: I BUILD */}
                <span className="block drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                  <SplitText text="IDEAS" gradient="text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#D5CBC0] to-[#605448]" delay={0.3} /></span>

                {/* Line 2: DIGITAL */}
                <span className="block drop-shadow-[0_8px_25px_rgba(201,158,93,0.35)]">
                  <SplitText text="INTO" gradient="text-transparent bg-clip-text bg-gradient-to-b from-[#F7E7C4] via-[#C99E5D] to-[#543B1A]" delay={0.7} /></span>

                {/* Line 3: EXPERIENCES */}
                <span className="block drop-shadow-[0_10px_30px_rgba(155,118,64,0.4)]">
                  <SplitText text="REALITY" gradient="text-transparent bg-clip-text bg-gradient-to-b from-[#DFBE8A] via-[#9B7640] to-[#342410]" delay={1.1} /></span>
              </h1>
            </motion.div>

            {/* Subtitle Technologies */}
            <motion.div variants={fadeUpVariants} className="mb-4">
              <p
                className="text-[10px] sm:text-[11px] md:text-xs font-normal tracking-[0.28em] uppercase text-[#C4B29E]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                CREATOR <span className="text-[#8C6D4F] mx-1">•</span> DEVELOPER <span className="text-[#8C6D4F] mx-1">•</span> LIFELONG LEARNER
              </p>
            </motion.div>

            {/* 3-Line Description */}
            <motion.div
              variants={fadeUpVariants}
              className="text-xs sm:text-sm md:text-[13.5px] font-light text-[#A8988B] leading-[1.8] tracking-wide max-w-lg mb-6 space-y-1"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <p>
                I create clean, modern websites and digital experiences.
                <br />
                Every project starts with an idea and ends with real impact.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-row items-center gap-4 sm:gap-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {/* Explore My Work CTA */}
              <motion.a
                data-magnetic href="/books"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                className="relative inline-flex items-center space-x-3 px-6 sm:px-7 py-3.5 border border-[#8C6D4F] bg-[#120F0C]/80 hover:border-[#D4AF37] text-[#EAD8C7] hover:text-[#FFF5EB] text-[11px] font-medium tracking-[0.24em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.18)]"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E8D7C5]/40 to-transparent pointer-events-none" />
                <span>VIEW MY LIBRARY</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">
                  ↗
                </span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* RIGHT: Floating Quote & Signature Card */}
          <motion.div
            data-depth="2" initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col items-start pointer-events-auto pr-24 xl:pr-36 mr-4 z-20 select-none"
          >
            {/* 1. Quote Mark */}
            <span className="text-xl text-[#C99E5D] leading-none font-serif mb-2">
              “
            </span>

            {/* 2. Compact Two-Line Statement */}
            <div 
              className="text-[9.5px] font-medium tracking-[0.24em] uppercase text-[#E0D3C5] space-y-1 mb-3"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <p>STAY CURIOUS.</p>
              <p>KEEP CREATING.</p>
            </div>

            {/* 3. Gold Accent Line */}
            <div className="w-28 h-[1px] bg-gradient-to-r from-[#D4AF37] via-[#E8D7C5]/70 to-transparent shadow-[0_0_8px_rgba(212,175,55,0.4)] mb-2" />

            {/* 4. Fine Monoline Calligraphy Signature */}
            <div 
              className="text-[2.2rem] text-[#D8AB64] font-normal leading-none -ml-0.5"
              style={{ 
                fontFamily: "'Herr Von Muellerhoff', 'Allura', cursive",
                letterSpacing: '0.04em',
              }}
            >
              Gopal
            </div>
          </motion.div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-2" />
      </div>
    </section>
  );
};

export default HeroSection;
