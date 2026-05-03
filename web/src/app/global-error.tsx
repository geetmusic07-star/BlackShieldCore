'use client';
import React from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-4">{error.message}</p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
