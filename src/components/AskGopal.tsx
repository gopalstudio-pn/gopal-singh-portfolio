import React, { useEffect, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

export const AskGopal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: "Hi! I'm Ask Gopal AI. Ask me about Gopal's skills, his Library or his AI Studio." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...msgs, { role: 'user', content: text }];
    setMsgs(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json();
      const reply = data.success ? data.reply : data.error || 'Please try again.';
      setMsgs([...next, { role: 'assistant', content: reply }]);
    } catch {
      setMsgs([...next, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {open && (
        <div className="mb-3 flex h-[420px] w-[min(92vw,340px)] flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[#0d0d0d]/95 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-[10px] tracking-[0.3em] text-[#D4AF37]">ASK GOPAL AI</span>
            <button type="button" onClick={() => setOpen(false)} className="text-white/50 hover:text-white">✕</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={`inline-block max-w-[88%] rounded-xl px-3 py-2 text-[12px] leading-5 ${m.role === 'user' ? 'bg-[#D4AF37]/15 text-[#F1E8DD]' : 'bg-white/5 text-white/75'}`}>{m.content}</span>
              </div>
            ))}
            {busy && <p className="text-[10px] tracking-[0.25em] text-[#BFA98E]">THINKING...</p>}
            <div ref={endRef} />
          </div>
          <div className="flex items-center gap-2 border-t border-white/10 px-3 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              maxLength={300}
              placeholder="Ask anything about Gopal..."
              className="flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/25"
            />
            <button type="button" onClick={send} disabled={busy} className="text-[#D4AF37] disabled:opacity-40">↗</button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Ask Gopal AI"
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-black text-xl text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-transform hover:scale-105"
      >
        {open ? '✕' : '✦'}
      </button>
    </div>
  );
};
