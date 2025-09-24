// src/components/global-not-found/GlobalNotFoundContent.tsx
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function GlobalNotFoundContent() {
  const searchParams = useSearchParams();
  const path = searchParams.get('path') || '';

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-9xl font-bold text-gray-200 mb-6">404</div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Página No Encontrada
        </h1>

        <p className="text-gray-600 mb-6">
          {path
            ? `Lo sentimos, no pudimos encontrar la ruta "${path}".`
            : 'Lo sentimos, la página que buscas no existe o ha sido movida.'}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link href="/">Volver al Inicio</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/products">Ver Productos</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
