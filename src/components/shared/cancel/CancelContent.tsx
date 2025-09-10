// src/components/cancel/CancelContent.tsx
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function CancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const reason = searchParams.get('reason') || 'cancelado';

  useEffect(() => {
    // Si no hay un ID de pedido, redirigir después de un tiempo
    if (!orderId) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [orderId, router]);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pedido {reason === 'cancelado' ? 'Cancelado' : 'No Completado'}
        </h1>

        <p className="text-gray-600 mb-6">
          {orderId
            ? `Tu pedido #${orderId} ha sido ${reason}. Si esto fue un error o necesitas ayuda, por favor contáctanos.`
            : 'No se pudo completar tu pedido. Serás redirigido a la página principal en unos segundos.'}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Volver al Inicio</Link>
          </Button>

          {orderId && (
            <Button asChild>
              <Link href="/contact">Contactar Soporte</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
