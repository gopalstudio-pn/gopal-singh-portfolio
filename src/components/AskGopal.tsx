import React, { useEffect, useRef, useState } from 'react';
import { AIOrb, Waveform } from './AIOrb';

type Msg = { role: 'user' | 'assistant'; content: string };

const LANGS = [
  { id: 'en', label: 'EN', speech: 'en-IN', hint: ' (Reply in English.)' },
  { id: 'hi', label: 'हिं', speech: 'hi-IN', hint: ' (Reply in Hindi, in Devanagari script.)' },
  { id: 'mai', label: 'मै', speech: 'hi-IN', hint: ' (Reply in Maithili, in Devanagari script.)' },
];

export const AskGopal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [lang, setLang] = useState('en');
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: "Hi! I'm Ask Gopal AI. Ask me about Gopal's skills, his Library or his AI Studio. You can type or use the mic." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);
  const voiceRef = useRef(false);
  const uRef = useRef<any>(null);

  const SR: any =
    typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const cur = LANGS.find((l) => l.id === lang) || LANGS[0];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  const speak = (text: string) => {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = cur.speech;
    const v = window.speechSynthesis
      .getVoices()
      .find((x) => x.lang.toLowerCase().startsWith(cur.speech.slice(0, 2)));
    if (v) u.voice = v;
    u.rate = 0.95;
    uRef.current = u;
    u.onstart = () => { if (uRef.current === u) setSpeaking(true); };
    u.onend = () => { if (uRef.current === u) setSpeaking(false); };
    u.onerror = () => { if (uRef.current === u) setSpeaking(false); };
    window.speechSynthesis.speak(u);
  };

  const send = async (textArg?: string) => {
    const text = (textArg ?? input).trim();
    if (!text || busy) return;
    const next: Msg[] = [...msgs, { role: 'user', content: text }];
    setMsgs(next);
    setInput('');
    setBusy(true);
    const payload = next.slice(1).map((m, i, arr) =>
      i === arr.length - 1 && m.role === 'user' ? { ...m, content: m.content + cur.hint } : m
    );
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload }),
      });
      const data = await res.json();
      const reply = data.success ? data.reply : data.error || 'Please try again.';
      setMsgs([...next, { role: 'assistant', content: reply }]);
      if (voiceRef.current && data.success) speak(reply);
    } catch {
      setMsgs([...next, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      voiceRef.current = false;
      setBusy(false);
    }
  };

  const listen = () => {
    if (!SR) return;
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = cur.speech;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      voiceRef.current = true;
      send(t);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const close = () => {
    if (canSpeak) window.speechSynthesis.cancel();
    uRef.current = null;
    setSpeaking(false);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {open && (
        <div className="mb-3 flex h-[440px] w-[min(92vw,340px)] flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[#0d0d0d]/95 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-[10px] tracking-[0.3em] text-[#D4AF37]">ASK GOPAL AI</span>
            <div className="flex items-center gap-3">
              {LANGS.map((l) => (
                <button key={l.id} type="button" onClick={() => setLang(l.id)} className={`text-[11px] ${lang === l.id ? 'text-[#D4AF37]' : 'text-white/40 hover:text-white'}`}>{l.label}</button>
              ))}
              <button type="button" onClick={close} className="ml-1 text-white/50 hover:text-white">✕</button>
            </div>
          </div>
          {(listening || speaking) && <Waveform kind={listening ? "listen" : "speak"} />}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={`inline-block max-w-[88%] rounded-xl px-3 py-2 text-[12px] leading-5 ${m.role === 'user' ? 'bg-[#D4AF37]/15 text-[#F1E8DD]' : 'bg-white/5 text-white/75'}`}>{m.content}</span>
                {m.role === 'assistant' && canSpeak && i > 0 && (
                  <button type="button" onClick={() => speak(m.content)} aria-label="Read aloud" className="ml-2 text-[12px] text-[#BFA98E] hover:text-white">🔊</button>
                )}
              </div>
            ))}
            {busy && <p className="text-[10px] tracking-[0.25em] text-[#BFA98E]">THINKING...</p>}
            <div ref={endRef} />
          </div>
          <div className="flex items-center gap-2 border-t border-white/10 px-3 py-3">
            {SR && (
              <button type="button" onClick={listen} aria-label="Speak" className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${listening ? 'animate-pulse border-red-300/60 text-red-200' : 'border-[#D4AF37]/40 text-[#D4AF37]'}`}>🎤</button>
            )}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              maxLength={300}
              placeholder={listening ? 'Listening...' : 'Ask anything about Gopal...'}
              className="flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/25"
            />
            <button type="button" onClick={() => send()} disabled={busy} className="text-[#D4AF37] disabled:opacity-40">↗</button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-label="Ask Gopal AI"
        className="relative overflow-hidden ml-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-black text-xl text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-transform hover:scale-105"
      >
        <AIOrb mode={listening ? 'listening' : speaking ? 'speaking' : busy ? 'thinking' : 'idle'} />
        {open && <span className="absolute text-base text-[#F7E7C4]">✕</span>}
      </button>
    </div>
  );
};
