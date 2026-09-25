import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import BooksPage from './BooksPage';
import AIStudioPage from './AIStudioPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/ai-studio" element={<AIStudioPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
