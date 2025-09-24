// src/app/global-error.tsx
'use client';

import Link from 'next/link';

export default function GlobalError({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Error crítico
              </h2>

              <p className="text-gray-600 mb-6">
                Ha ocurrido un error crítico en la aplicación. Por favor,
                contacta al soporte técnico.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Intentar de nuevo
                </button>

                <Link
                  href="/"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
