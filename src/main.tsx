import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { AskGopal } from './components/AskGopal';
import { SmoothScroll } from './components/SmoothScroll';
import { CinematicFX } from './components/CinematicFX';
import { CursorGlow, Magnetic, PageCurtain, EasterEgg } from './components/Interactions';
import { DepthTilt } from './components/DepthTilt';
import { InstallApp } from './components/InstallApp';
import './index.css';

const BooksPage = lazy(() => import('./BooksPage'));
const AIStudioPage = lazy(() => import('./AIStudioPage'));
const ConnectPage = lazy(() => import('./ConnectPage'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SmoothScroll />
      <CinematicFX />
      <CursorGlow />
      <Magnetic />
      <PageCurtain />
      <EasterEgg />
      <DepthTilt />
      <InstallApp />
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/ai-studio" element={<AIStudioPage />} />
          <Route path="/connect" element={<ConnectPage />} />
        </Routes>
      </Suspense>
      <AskGopal />
    </BrowserRouter>
  </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
