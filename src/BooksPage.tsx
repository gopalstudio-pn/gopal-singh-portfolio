import React, { useState } from 'react';

const books = [
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finance · Psychology',
    cover: '/books/the-money.jpg',
    pdf: '/books/the-psychology-of-money.pdf',
    description:
      'An exploration of how people think about money, wealth, behaviour, and the decisions that shape financial life.',
  },
  {
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    category: 'Self-Development · Communication',
    cover: '/books/how-to-win-friends-and-influence-people.jpg',
    pdf: '/books/how-to-win-friends-and-influence-people.pdf',
    description:
      'A classic guide to building better relationships, communicating effectively, and understanding people.',
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Business · Entrepreneurship',
    cover: '/books/the-lean-startup.jpg',
    pdf: '/books/the-lean-startup.pdf',
    description:
      'A practical approach to building businesses through experimentation, learning, and continuous improvement.',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Development · Habits',
    cover: '/books/atomic-habits.jpg',
    pdf: '/books/atomic-habits.pdf',
    description:
      'A practical guide to building good habits, breaking bad ones, and making small changes that lead to remarkable results.',
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    category: 'Finance · Personal Growth',
    cover: '/books/rich-dad-poor-dad.jpg',
    pdf: '/books/rich-dad-poor-dad.pdf',
    description:
      'A personal-finance book exploring different approaches to money, investing, work, and financial independence.',
  },
  {
    title: 'The 4-Hour Workweek',
    author: 'Timothy Ferriss',
    category: 'Business · Productivity',
    cover: '/books/the-4-hour-workweek.jpg',
    pdf: '/books/the-4-hour-workweek.pdf',
    description:
      'A guide to rethinking traditional work, improving productivity, and creating more freedom in everyday life.',
  },
  {
    title: 'The Intelligent Investor',
    author: 'Benjamin Graham',
    category: 'Finance · Investing',
    cover: '/books/the-intelligent-investor.jpg',
    pdf: '/books/the-intelligent-investor.pdf',
    description:
      'A classic introduction to value investing, disciplined decision-making, and long-term approaches to the market.',
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Business · Startups',
    cover: '/books/zero-to-one.jpg',
    pdf: '/books/zero-to-one.pdf',
    description:
      'A perspective on startups, innovation, and creating new things rather than simply copying what already exists.',
  },
  {
    title: 'The 48 Laws of Power',
    author: 'Robert Greene',
    category: 'Psychology · Strategy',
    cover: '/books/48-laws-of-power.jpg',
    pdf: '/books/48-laws-of-power.pdf',
    description:
      'A collection of historical observations and strategies about power, influence, and human behaviour.',
  },
  {
    title: "Esquire's The New Rules for Men",
    author: 'Esquire',
    category: 'Lifestyle · Personal Growth',
    cover: '/books/new-rules-for-men.jpg',
    pdf: '/books/new-rules-for-men.pdf',
    description:
      'A guide covering style, relationships, work, confidence, and practical aspects of modern men’s life.',
  },
];

export const BooksPage: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [downloadBook, setDownloadBook] = useState<(typeof books)[number] | null>(null);
  const [downloadPassword, setDownloadPassword] = useState('');
  const [downloadError, setDownloadError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author} ${book.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main
      className="min-h-screen text-[#E8DFD8] bg-[#171411] bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "linear-gradient(rgba(12,10,8,0.78), rgba(12,10,8,0.9)), url('/books/book-page.png')",
      }}
    >
      <div className="min-h-screen px-6 py-10 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">

          <header className="flex items-center justify-between">
            <a
              href="/"
              className="text-xs tracking-[0.25em] uppercase text-[#D4AF37] hover:text-[#FFF5EB] transition-colors"
            >
              ← BACK HOME
            </a>

            <button
              type="button"
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (searchOpen) setSearch('');
              }}
              aria-label="Search books"
              className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#D4AF37] hover:text-[#FFF5EB] transition-colors"
            >
              <span className="text-xl leading-none">⌕</span>
              <span className="hidden sm:inline">SEARCH</span>
            </button>
          </header>

          <section className="pt-20 sm:pt-28 max-w-3xl">
            <p className="text-xs tracking-[0.3em] text-[#D4AF37] mb-5">
              GOPAL&apos;S LIBRARY
            </p>

            <h1 className="text-6xl sm:text-8xl uppercase leading-[0.85]">
              LIBRARY.
            </h1>

            <p className="mt-7 max-w-xl text-sm sm:text-base leading-7 text-[#C9BEB3]">
              Books, ideas, and perspectives worth keeping.
            </p>
          </section>

          {searchOpen && (
            <div className="mt-10 max-w-xl">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search books, authors..."
                className="w-full bg-black/30 backdrop-blur-xl border-b border-[#D4AF37]/50 px-2 py-4 text-sm text-[#F1E8DD] outline-none placeholder:text-[#8C7C6D]"
              />
            </div>
          )}

          <div className="mt-20 flex items-center gap-5">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C6D4F]">
              MY COLLECTION
            </p>
            <div className="h-px flex-1 bg-[#8C6D4F]/30" />
          </div>

          {filteredBooks.length > 0 ? (
            <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredBooks.map((book, index) => (
                <article
                  key={book.title}
                  className="group bg-[#EEE5D7] text-[#171411] p-5 shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="bg-[#D8CCBC] p-6 flex justify-center overflow-hidden">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full max-w-[280px] aspect-[2/3] object-cover shadow-xl transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="pt-7 px-1 pb-2">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-[#8C6D4F]">
                      BOOK / {String(index + 1).padStart(2, '0')}
                    </p>

                    <h2 className="mt-3 text-2xl sm:text-3xl uppercase leading-tight">
                      {book.title}
                    </h2>

                    <p className="mt-3 text-xs tracking-[0.18em] uppercase text-[#806F60]">
                      {book.author}
                    </p>

                    <p className="mt-2 text-[10px] tracking-[0.15em] uppercase text-[#9A8878]">
                      {book.category}
                    </p>

                    <div className="mt-6 h-px bg-[#8C6D4F]/25" />

                    <p className="mt-6 text-sm leading-7 text-[#51483F]">
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

                      <button
                        type="button"
                        onClick={() => {
                          setDownloadBook(book);
                          setDownloadPassword('');
                          setDownloadError(false);
                          setDownloading(false);
                        }}
                        aria-label={`Download ${book.title}`}
                        className="inline-flex items-center justify-center w-11 h-11 border border-[#8C6D4F] text-[#171411] hover:bg-[#171411] hover:text-[#F1E8DD] transition-all duration-300"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <div className="mt-16 py-20 text-center border border-[#8C6D4F]/20 bg-black/20 backdrop-blur-sm">
              <p className="text-xs tracking-[0.25em] uppercase text-[#D4AF37]">
                NO BOOKS FOUND
              </p>
              <p className="mt-3 text-sm text-[#A8988B]">
                Try another title or author.
              </p>
            </div>
          )}

          <footer className="py-28 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#D4AF37]">
              MORE BOOKS. MORE PERSPECTIVES.
            </p>
            <p className="mt-4 text-sm text-[#A8988B]">
              A personal collection, growing one idea at a time.
            </p>
          </footer>

        </div>
      </div>

      {downloadBook && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5 bg-black/75 backdrop-blur-md"
          onClick={() => {
            if (!downloading) setDownloadBook(null);
          }}
        >
          <div
            key={shakeKey}
            className="w-full max-w-md bg-[#171411]/95 border border-[#8C6D4F]/40 shadow-2xl p-7 sm:p-9"
            style={{
              animation: downloadError
                ? 'download-shake 0.5s ease-in-out'
                : 'download-modal-in 0.35s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @keyframes download-modal-in {
                from {
                  opacity: 0;
                  transform: translateY(18px) scale(0.96);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }

              @keyframes download-shake {
                0%, 100% { transform: translateX(0); }
                15% { transform: translateX(-9px); }
                30% { transform: translateX(8px); }
                45% { transform: translateX(-7px); }
                60% { transform: translateX(6px); }
                75% { transform: translateX(-4px); }
                90% { transform: translateX(3px); }
              }
            `}</style>

            <div className="flex items-center justify-center w-14 h-14 mx-auto border border-[#D4AF37]/50 rounded-full text-[#D4AF37] text-xl">
              🔐
            </div>

            <p className="mt-6 text-center text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]">
              PRIVATE ACCESS
            </p>

            <h3 className="mt-3 text-center text-2xl text-[#F1E8DD]">
              Download Book
            </h3>

            <p className="mt-3 text-center text-xs leading-6 text-[#9A8878]">
              Enter your access key to download
              <br />
              <span className="text-[#CBB59D]">{downloadBook.title}</span>
            </p>

            <input
              autoFocus
              type="password"
              value={downloadPassword}
              onChange={(e) => {
                setDownloadPassword(e.target.value);
                setDownloadError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  document.getElementById('unlock-book-button')?.click();
                }
              }}
              placeholder="Enter access key"
              className="mt-6 w-full bg-black/30 border border-[#8C6D4F]/50 px-4 py-4 text-sm text-[#F1E8DD] outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#75685D]"
            />

            {downloadError && (
              <p className="mt-3 text-center text-sm text-[#D4AF37]">
                नाई मिलल password
              </p>
            )}

            <button
              id="unlock-book-button"
              type="button"
              disabled={downloading || !downloadPassword}
              onClick={async () => {
                if (!downloadPassword || downloading) return;

                setDownloadError(false);
                setDownloading(true);

                try {
                  const file = downloadBook.pdf.split('/').pop();

                  const res = await fetch(`/api/download/${file}`, {
                    method: 'POST',
                    headers: {
                      'x-download-password': downloadPassword,
                    },
                  });

                  if (!res.ok) {
                    setDownloading(false);
                    setDownloadError(true);
                    setShakeKey((value) => value + 1);
                    return;
                  }

                  const blob = await res.blob();

                  if (blob.type !== 'application/pdf') {
                    throw new Error('Invalid PDF response');
                  }

                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');

                  link.href = url;
                  link.download = `${downloadBook.title}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  link.remove();

                  URL.revokeObjectURL(url);

                  setDownloading(false);
                  setDownloadBook(null);
                  setDownloadPassword('');
                } catch {
                  setDownloading(false);
                  setDownloadError(true);
                  setShakeKey((value) => value + 1);
                }
              }}
              className="mt-5 w-full py-4 bg-[#D4AF37] text-[#171411] text-[10px] tracking-[0.25em] uppercase hover:bg-[#E2C45A] disabled:opacity-40 transition-colors"
            >
              {downloading ? 'UNLOCKING...' : 'UNLOCK ↗'}
            </button>

            <a
              href="/#contact"
              onClick={() => setDownloadBook(null)}
              className="mt-5 group flex items-center justify-center gap-3 w-full py-4 border border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#F1E8DD] text-[10px] tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-[#171411] hover:border-[#D4AF37] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.08)] hover:shadow-[0_0_28px_rgba(212,175,55,0.22)]"
            >
              <span>गोपाल से गप करु</span>
              <span className="text-[#D4AF37] group-hover:text-[#171411] group-hover:translate-x-1 transition-all duration-300">
                ↗
              </span>
            </a>

            <button
              type="button"
              disabled={downloading}
              onClick={() => setDownloadBook(null)}
              className="mt-4 w-full text-[9px] tracking-[0.2em] uppercase text-[#75685D] hover:text-[#F1E8DD] transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

    </main>
  );
};

export default BooksPage;
