import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LanguageProvider } from './components/LanguageContext';
import { initAnalytics } from './analytics';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

initAnalytics();

// #root contains build-time prerendered HTML for crawlers; createRoot replaces it with the live app
// (no hydration, so the visitor's stored language and URL hash can differ from the prerendered state).
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
