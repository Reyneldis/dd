// src/app/500/page.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ServerErrorPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-9xl font-bold text-gray-200 mb-6">500</div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error del Servidor
          </h1>

          <p className="text-gray-600 mb-6">
            Lo sentimos, ha ocurrido un error en el servidor. Por favor,
            inténtalo de nuevo más tarde.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>

            <Button asChild variant="outline">
              <Link href="/contact">Contactar Soporte</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
