import React from 'react';
import { motion } from 'framer-motion';

const socials = [
  {
    name: 'Instagram',
    label: '@gopalsingh.pn',
    icon: '/instagram.png',
    href: 'https://www.instagram.com/gopalsingh.pn?stkn=bzZrZ2pxMXZ4NTdo',
  },
  {
    name: 'Facebook',
    label: 'Connect on Facebook',
    icon: '/facebook.png',
    href: 'https://www.facebook.com/share/19Qz3uV7y6/',
  },
  {
    name: 'YouTube',
    label: '@gopalsingh-rr6yi',
    icon: '/youtube.png',
    href: 'https://youtube.com/@gopalsingh-rr6yi',
  },
  {
    name: 'WhatsApp',
    label: 'Chat with Gopal',
    icon: '/whatsapp.png',
    href: 'https://wa.me/9779707727608',
  },
  {
    name: 'TikTok',
    label: '@gopalsingh.7',
    icon: '/tiktok.png',
    href: 'https://www.tiktok.com/@gopalsingh.7',
  },
  {
    name: 'Gmail',
    label: 'gopalsingh.pn@gmail.com',
    icon: '/gmail.png',
    href: 'mailto:gopalsingh.pn@gmail.com',
  },
];

const ConnectPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#090807] text-[#F1E8DD] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/[0.06] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#8C6D4F]/[0.08] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 sm:py-16">
        <motion.a
          href="/books"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-[#8C6D4F] hover:text-[#D4AF37] transition-colors"
        >
          ← BACK TO LIBRARY
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-16 text-center"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]">
            LET'S CONNECT
          </p>

          <h1
            className="mt-4 text-5xl sm:text-7xl tracking-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            गोपाल से गप करु
          </h1>

          <p className="mt-5 max-w-md mx-auto text-xs sm:text-sm leading-6 text-[#9A8878]">
            Find me around the internet, send a message, or simply say hello.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target={social.name === 'Gmail' ? undefined : '_blank'}
              rel={social.name === 'Gmail' ? undefined : 'noopener noreferrer'}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
              }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-5 p-5 sm:p-6 border border-[#8C6D4F]/25 bg-[#11100E]/80 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/60 hover:bg-[#17130E]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex-shrink-0 flex items-center justify-center w-14 h-14 border border-[#8C6D4F]/30 bg-[#0A0908] group-hover:border-[#D4AF37]/60 transition-all duration-500">
                <img
                  src={social.icon}
                  alt={social.name}
                  className="w-7 h-7 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                />
              </div>

              <div className="relative min-w-0 flex-1">
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#D4AF37]">
                  {social.name}
                </p>

                <p className="mt-2 text-xs text-[#A8988B] truncate group-hover:text-[#F1E8DD] transition-colors">
                  {social.label}
                </p>
              </div>

              <span className="relative text-lg text-[#8C6D4F] group-hover:text-[#D4AF37] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                ↗
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-14 text-center"
        >
          <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

          <p className="mt-6 text-[8px] tracking-[0.3em] uppercase text-[#62564C]">
            GOPAL SINGH • PORTFOLIO 2026
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default ConnectPage;
