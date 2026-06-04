import React from 'react';
import ReactDOM from 'react-dom/client';
import { runMigrations } from './lib/app';
import App from './App';
import './index.css';

runMigrations()
  .then(() => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((err: unknown) => {
    console.error('[dog-walking-app] DB migration failed — cannot start app', err);
    throw err;
  });
