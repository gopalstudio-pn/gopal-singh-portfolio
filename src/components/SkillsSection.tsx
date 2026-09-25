import React from 'react';
import { motion } from 'framer-motion';

const skillGroups = [
  {
    number: '01',
    title: 'WEB & DIGITAL',
    skills: ['Web Development', 'Digital Marketing', 'Content Creation', 'Online Research'],
  },
  {
    number: '02',
    title: 'AI & TECHNOLOGY',
    skills: ['Artificial Intelligence', 'Generative AI', 'AI Tools', 'Prompt Engineering'],
  },
  {
    number: '03',
    title: 'CREATIVE',
    skills: ['Photography', 'Photo Editing', 'Video Editing', 'Visual Design'],
  },
  {
    number: '04',
    title: 'COMMUNICATION',
    skills: ['Communication', 'Presentation', 'Public Speaking', 'Teamwork'],
  },
  {
    number: '05',
    title: 'PERSONAL',
    skills: ['Creativity', 'Problem Solving', 'Adaptability', 'Time Management'],
  },
];

export const SkillsSection: React.FC = () => {
  return (
    <section
      id="skills"
      className="relative w-full overflow-hidden bg-black px-6 py-24 text-[#E8DFD8] sm:px-12 lg:px-20 lg:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.035] blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C9A66B]">
              03 — Skills
            </span>
            <div className="h-px w-16 bg-[#C9A66B]/40" />
          </div>

          <h2
            className="text-[clamp(4rem,10vw,9rem)] font-light uppercase leading-[0.8] tracking-[-0.03em] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            SKILLS
          </h2>

          <p className="mt-7 max-w-md text-sm font-light leading-7 tracking-wide text-white/45">
            A blend of digital, creative, technological, and personal skills
            shaped through curiosity and experience.
          </p>
        </motion.div>

        <div className="border-t border-white/15">
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group grid grid-cols-1 gap-6 border-b border-white/10 py-8 transition-colors duration-500 hover:border-[#C9A66B]/40 md:grid-cols-[80px_240px_1fr] md:items-start md:gap-8 lg:py-10"
            >
              <span className="text-[10px] tracking-[0.3em] text-[#C9A66B]/70">
                {group.number}
              </span>

              <h3
                className="text-xl tracking-[0.12em] text-white transition-colors duration-300 group-hover:text-[#E7C98F] sm:text-2xl"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {group.title}
              </h3>

              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm font-light tracking-wide text-white/55 transition-colors duration-300 group-hover:text-white/85"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
