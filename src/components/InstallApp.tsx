import { useEffect, useState } from 'react';

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

const dismissedRecently = () => {
  try {
    const t = Number(localStorage.getItem('installDismissedAt') || 0);
    return !!t && Date.now() - t < 14 * 24 * 3600 * 1000;
  } catch {
    return false;
  }
};

const detect = () => {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMacSafari = !isIOS && /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua);
  return isIOS ? 'ios' : isMacSafari ? 'mac' : null;
};

export const InstallApp = () => {
  const [deferred, setDeferred] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [hidden, setHidden] = useState(() => isStandalone() || dismissedRecently());
  const platform = detect();

  useEffect(() => {
    if (hidden) return;
    let intro = true;
    try {
      intro = sessionStorage.getItem('introSeen') !== '1';
    } catch {}
    const t = setTimeout(() => setVisible(true), intro ? 3800 : 1500);
    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => {
      setHidden(true);
      setDeferred(null);
      setSheet(false);
    };
    window.addEventListener('beforeinstallprompt', onBip);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      clearTimeout(t);
      window.removeEventListener('beforeinstallprompt', onBip);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [hidden]);

  const install = async () => {
    if (deferred) {
      deferred.prompt();
      try {
        const c = await deferred.userChoice;
        if (c.outcome === 'accepted') setHidden(true);
      } catch {}
      setDeferred(null);
      return;
    }
    setSheet(true);
  };

  const dismiss = () => {
    try {
      localStorage.setItem('installDismissedAt', String(Date.now()));
    } catch {}
    setHidden(true);
  };

  if (hidden || !visible || (!deferred && !platform)) return null;

  const steps =
    platform === 'mac'
      ? ['In the Safari menu bar, click File', 'Choose Add to Dock…', 'Click Add']
      : ['Tap the Share button in Safari', 'Choose Add to Home Screen', 'Tap Add'];

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[39] flex justify-center">
        <div
          className="pointer-events-auto flex items-center overflow-hidden rounded-b-2xl border border-t-0 border-[#D4AF37]/35 bg-black/60 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md"
          style={{ animation: 'installDrop .8s cubic-bezier(.16,1,.3,1) both' }}
        >
          <button type="button" onClick={install} aria-label="Download the Gopal app" className="group flex items-center gap-2.5 py-1.5 pl-4 pr-3" style={{ cursor: 'pointer' }}>
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#D4AF37]/60 text-[#D4AF37] transition-transform duration-300 group-hover:translate-y-[1px]">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 1.5v7M3 6l3 3 3-3M2 10.5h8" />
              </svg>
            </span>
            <span className="text-[9px] tracking-[0.34em] text-[#EAD8C7] transition-colors duration-300 group-hover:text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              DOWNLOAD APP
            </span>
          </button>
          <span className="h-3 w-px bg-white/15" />
          <button type="button" onClick={dismiss} aria-label="Dismiss" className="px-3 py-1.5 text-[11px] leading-none text-white/40 transition-colors hover:text-white" style={{ cursor: 'pointer' }}>
            ×
          </button>
        </div>
      </div>

      {sheet && (
        <div onClick={() => setSheet(false)} className="fixed inset-0 z-[140] flex items-center justify-center bg-black/80 px-6" style={{ animation: 'eggIn .4s ease-out both' }}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm border border-[#D4AF37]/30 bg-[#0b0906] p-8 text-center shadow-[0_0_60px_rgba(212,175,55,0.12)]"
            style={{ animation: 'sheetIn .6s cubic-bezier(.16,1,.3,1) both' }}
          >
            <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <p className="mt-6 text-[10px] tracking-[0.4em] text-[#D4AF37]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              INSTALL GOPAL APP
            </p>
            <ol className="mt-7 space-y-4 text-left">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-4 text-sm font-light text-white/70" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/50 text-[10px] text-[#D4AF37]">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => setSheet(false)} className="mt-8 border border-[#8C6D4F]/50 px-6 py-2 text-[10px] tracking-[0.3em] text-[#EAD8C7] transition-colors hover:border-[#D4AF37]" style={{ cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}>
              GOT IT
            </button>
          </div>
        </div>
      )}
    </>
  );
};
