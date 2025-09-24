// src/app/500.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">500 - Error del Servidor</h1>
      <p className="text-gray-600 mb-8">Algo salió mal en nuestro servidor.</p>
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
