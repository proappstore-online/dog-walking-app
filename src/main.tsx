import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Schema changes belong to an authenticated deployment, never a guest page load.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
