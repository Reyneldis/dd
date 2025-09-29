'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, MessageCircle, Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OrdenExitosaPage() {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    // Intentar obtener el número de orden de la URL o localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const orderNum =
      urlParams.get('order') || localStorage.getItem('lastOrderNumber');
    if (orderNum) {
      setOrderNumber(orderNum);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icono de éxito */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Tu pedido ha sido procesado exitosamente
            </p>
            {orderNumber && (
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                Número de pedido: {orderNumber}
              </p>
            )}
          </div>

          {/* Información del proceso */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              ¿Qué sigue ahora?
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Mensaje enviado por WhatsApp
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Los administradores han recibido tu pedido por WhatsApp y se
                    pondrán en contacto contigo pronto.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Preparación del pedido
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Una vez confirmado, prepararemos tu pedido para la entrega.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Entrega
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Te contactaremos para coordinar la entrega en la dirección
                    proporcionada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Seguir Comprando
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Volver al Inicio
              </Button>
            </Link>
          </div>

          {/* Información adicional */}
          <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            <p>
              ¿Tienes alguna pregunta? Contáctanos por WhatsApp o revisa tu
              correo electrónico para más detalles sobre tu pedido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
