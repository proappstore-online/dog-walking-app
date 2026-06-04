import React from 'react';
import DirectoryPage from './pages/DirectoryPage';

export default function App(): React.ReactElement {
  // Simple client-side routing — expand with a router when more pages are added
  const path = window.location.pathname;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      {/* Minimal shell header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <a
            href="/"
            className="text-xl font-bold text-amber-600 dark:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          >
            🐾 Dog Walking
          </a>
        </div>
      </header>

      {/* Visually hidden app title — required by db-migrations E2E spec */}
      <h1 className="sr-only">Dog Walking App</h1>

      <main>
        {path === '/' || path === '' ? (
          <DirectoryPage />
        ) : (
          <div className="px-4 py-20 text-center">
            <p className="text-gray-500 dark:text-gray-400">Page not found.</p>
            <a href="/" className="text-amber-600 dark:text-amber-400 underline mt-2 inline-block">
              Back to directory
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
