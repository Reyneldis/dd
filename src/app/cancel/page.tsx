'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-900 dark:via-neutral-800 dark:to-pink-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header de Cancelación */}
          <div className="mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <XCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-red-800 dark:text-red-200 mb-4">
              Pago Cancelado
            </h1>
            <p className="text-xl text-red-600 dark:text-red-400 mb-2">
              Tu pago no pudo ser procesado
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              No te preocupes, no se ha cobrado nada a tu tarjeta
            </p>
          </div>

          {/* Información */}
          <Card className="bg-white dark:bg-neutral-900 border-0 shadow-xl rounded-2xl mb-8">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-t-2xl">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <RefreshCw className="h-6 w-6" />
                ¿Qué pasó?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">
                      1
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Verifica tu información
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Asegúrate de que los datos de tu tarjeta sean correctos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">
                      2
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Saldo suficiente
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Confirma que tu tarjeta tenga fondos disponibles
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">
                      3
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Contacta a tu banco
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Algunos bancos bloquean pagos por seguridad
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/checkout">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Intentar de Nuevo
                </Button>
              </Link>

              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 font-semibold px-6 sm:px-8 py-3 rounded-xl transition-all duration-300"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Volver a la Tienda
                </Button>
              </Link>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
              ¿Necesitas ayuda?{' '}
              <Link
                href="/contact"
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                Contáctanos
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
