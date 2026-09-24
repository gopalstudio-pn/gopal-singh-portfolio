import React from 'react';

export const BooksSection: React.FC = () => {
  return (
    <section id="books" className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">

        <p className="text-xs tracking-[0.3em] text-[#D4AF37] mb-6">
          02 / MY BOOKS
        </p>

        <h2 className="text-6xl sm:text-7xl uppercase leading-none">
          BOOKS.
          <span className="block text-[#C99E5D]">
            IDEAS THAT MATTER.
          </span>
        </h2>

        <p className="mt-6 max-w-xl text-sm leading-7 text-[#A8988B]">
          A curated collection of books that inspire ideas,
          perspectives, and personal growth.
        </p>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="flex justify-center">
            <img
              src="/books/the-money.jpg"
              alt="The Psychology of Money"
              className="w-64 rounded-sm shadow-2xl"
            />
          </div>

          <div>
            <p className="text-xs tracking-[0.25em] text-[#8C6D4F] uppercase">
              FEATURED BOOK / 01
            </p>

            <h3 className="mt-5 text-5xl uppercase leading-none">
              The Psychology
              <span className="block text-[#C99E5D]">
                of Money
              </span>
            </h3>

            <p className="mt-4 text-sm tracking-[0.18em] uppercase text-[#A8988B]">
              Morgan Housel
            </p>

            <div className="mt-8 h-px bg-[#8C6D4F]/30" />

            <p className="mt-8 max-w-lg text-sm leading-8 text-[#BDB0A4]">
              An exploration of how people think about money,
              wealth, behaviour, and the decisions that shape
              financial life.
            </p>

            <a
              href="/books/the-psychology-of-money.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-10 px-7 py-3 border border-[#D4AF37] text-xs tracking-[0.2em] uppercase"
            >
              READ BOOK →
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BooksSection;

