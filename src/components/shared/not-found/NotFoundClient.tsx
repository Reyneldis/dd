// src/components/shared/not-found/NotFoundClient.tsx
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function NotFoundClient() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Página no encontrada
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <div className="space-y-4">
        <Button asChild>
          <Link href="/">Ir al inicio</Link>
        </Button>
        {from && (
          <Button variant="outline" asChild>
            <Link href={from}>Volver a {from}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
