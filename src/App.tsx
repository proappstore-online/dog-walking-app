import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export default function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Dog Walking App</h1>
      </main>
    </BrowserRouter>
  );
}
