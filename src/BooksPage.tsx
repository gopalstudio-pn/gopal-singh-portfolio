import React from 'react';

const books = [
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    cover: '/books/the-money.jpg',
    pdf: '/books/the-psychology-of-money.pdf',
    description:
      'An exploration of how people think about money, wealth, behaviour, and the decisions that shape financial life.',
  },
];

export const BooksPage: React.FC = () => {
  return (
    <main
      className="min-h-screen text-[#E8DFD8] bg-[#171411] bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "linear-gradient(rgba(12,10,8,0.78), rgba(12,10,8,0.88)), url('/books/book-page.png')" }}
    >
      <div className="min-h-screen px-6 py-16 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <a
            href="/"
            className="inline-flex mb-14 text-xs tracking-[0.25em] uppercase text-[#D4AF37] hover:text-[#FFF5EB] transition-colors"
          >
            ← BACK HOME
          </a>

          <header className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] text-[#D4AF37] mb-5">
              GOPAL&apos;S LIBRARY
            </p>

            <h1 className="text-5xl sm:text-7xl uppercase leading-none">
              BOOKS.
              <span className="block text-[#C99E5D]">
                IDEAS THAT MATTER.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm sm:text-base leading-7 text-[#C9BEB3]">
              A quiet collection of books that inspire ideas, perspectives,
              learning, and personal growth.
            </p>
          </header>

          <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {books.map((book) => (
              <article
                key={book.title}
                className="group bg-[#EEE5D7] text-[#171411] p-5 shadow-2xl"
              >
                <div className="bg-[#D8CCBC] p-5 flex justify-center">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full max-w-[280px] aspect-[2/3] object-cover shadow-xl"
                  />
                </div>

                <div className="pt-7 px-1 pb-2">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[#8C6D4F]">
                    BOOK / 01
                  </p>

                  <h2 className="mt-3 text-2xl uppercase leading-tight">
                    {book.title}
                  </h2>

                  <p className="mt-2 text-xs tracking-[0.18em] uppercase text-[#806F60]">
                    {book.author}
                  </p>

                  <p className="mt-5 text-sm leading-7 text-[#51483F]">
                    {book.description}
                  </p>

                  <div className="mt-7 flex items-center gap-3">
                    <a
                      href={book.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex px-6 py-3 bg-[#171411] text-[#F1E8DD] text-[10px] tracking-[0.2em] uppercase hover:bg-[#3A3027] transition-colors"
                    >
                      READ BOOK →
                    </a>

                    <a
                      href={book.pdf}
                      download
                      aria-label={`Download ${book.title}`}
                      className="inline-flex items-center justify-center w-11 h-11 border border-[#8C6D4F] text-[#171411] hover:bg-[#171411] hover:text-[#F1E8DD] transition-all duration-300"
                    >
                      ↓
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
};

export default BooksPage;
