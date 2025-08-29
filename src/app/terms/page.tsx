'use client';
import {
  AlertCircle,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShoppingCart,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

import AnimatedSection from '@/components/shared/AnimatedSection';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center pt-3.5">
            <AnimatedSection animation="slideDown" delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Términos y Condiciones
              </h1>
            </AnimatedSection>
            <AnimatedSection animation="slideUp" delay={0.3}>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Estos términos y condiciones rigen el uso de nuestro sitio web y
                la compra de productos en Delivery Express.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {/* Introducción */}
          <AnimatedSection animation="fadeIn" delay={0.2}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-8 w-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Aceptación de los Términos
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Al acceder y utilizar este sitio web, aceptas estar sujeto a
                estos Términos y Condiciones de Uso. Si no estás de acuerdo con
                todos estos términos, no utilices nuestro sitio web ni
                servicios. Delivery Express se reserva el derecho de modificar
                estos términos en cualquier momento, y dichas modificaciones
                entrarán en vigor inmediatamente después de su publicación en
                este sitio.
              </p>
            </div>
          </AnimatedSection>

          {/* Uso del sitio */}
          <AnimatedSection animation="slideLeft" delay={0.3}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <UserCheck className="h-8 w-8 text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Uso del Sitio
                </h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Responsabilidades del Usuario
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Al utilizar nuestro sitio, te comprometes a proporcionar
                    información veraz, precisa, completa y actualizada. Eres
                    responsable de mantener la confidencialidad de tu cuenta y
                    contraseña.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Prohibiciones
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Está prohibido utilizar nuestro sitio para fines ilegales,
                    publicar contenido ofensivo, realizar actividades
                    fraudulentas, intentar acceder a sistemas no autorizados o
                    interrumpir el funcionamiento del sitio.
                  </p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Propiedad Intelectual
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Todo el contenido de este sitio, incluyendo textos,
                    gráficos, logotipos, imágenes y software, es propiedad de
                    Delivery Express o sus proveedores de contenido y está
                    protegido por las leyes de propiedad intelectual.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Compras */}
          <AnimatedSection animation="slideRight" delay={0.4}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="h-8 w-8 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Compras y Pagos
                </h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Proceso de Compra
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Al realizar una compra, aceptas proporcionar información de
                    pago precisa y completa. Nos reservamos el derecho de
                    rechazar cualquier pedido que consideremos inapropiado o
                    sospechoso.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Precios y Disponibilidad
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Los precios de los productos están sujetos a cambios sin
                    previo aviso. Hacemos todo lo posible para garantizar la
                    precisión de la información sobre productos, pero no
                    garantizamos que la información sea precisa, completa o
                    actualizada.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Métodos de Pago
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Aceptamos varios métodos de pago, incluyendo tarjetas de
                    crédito/débito y otros sistemas de pago electrónico. Al
                    proporcionar tu información de pago, garantizas que tienes
                    autorización para usar dicho método.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Envíos y Devoluciones */}
          <AnimatedSection animation="fadeIn" delay={0.5}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Envíos y Devoluciones
                </h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Envíos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Realizamos envíos a las direcciones especificadas durante el
                    proceso de compra. Los plazos de entrega son estimados y
                    pueden variar debido a factores fuera de nuestro control.
                    Los costos de envío se calculan y muestran antes de
                    finalizar la compra.
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Devoluciones y Reembolsos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Si no estás satisfecho con tu compra, puedes devolver los
                    productos dentro de los 30 días posteriores a la recepción.
                    Los productos deben estar en su estado original, sin usar y
                    con todas las etiquetas y embalaje. Los costos de envío de
                    devolución corren por cuenta del cliente, a menos que la
                    devolución se deba a un error nuestro.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Garantías */}
          <AnimatedSection animation="slideUp" delay={0.6}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-8 w-8 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Garantías y Limitaciones de Responsabilidad
                </h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Garantías del Producto
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Todos nuestros productos están cubiertos por la garantía del
                    fabricante. Si recibes un producto defectuoso, contáctanos
                    dentro de los 7 días posteriores a la recepción para
                    gestionar un reemplazo o reembolso.
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Limitación de Responsabilidad
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Delivery Express no será responsable por cualquier daño
                    directo, indirecto, incidental, especial o consecuente que
                    resulte del uso o la imposibilidad de usar nuestros
                    productos o servicios.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Privacidad */}
          <AnimatedSection animation="slideDown" delay={0.7}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Privacidad y Seguridad
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Tu privacidad es importante para nosotros. Nuestra Política de
                Privacidad, disponible en{' '}
                <Link
                  href="/privacy"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  este enlace
                </Link>
                , describe cómo recopilamos, usamos y protegemos tu información
                personal. Al utilizar nuestro sitio, aceptas las prácticas
                descritas en dicha política.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Implementamos medidas de seguridad razonables para proteger tu
                información personal contra pérdida, mal uso y acceso no
                autorizado. Sin embargo, ninguna transmisión por Internet o
                método de almacenamiento electrónico es 100% seguro.
              </p>
            </div>
          </AnimatedSection>

          {/* Propiedad Intelectual */}
          <AnimatedSection animation="slideLeft" delay={0.8}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Propiedad Intelectual
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Todo el contenido de este sitio web, incluyendo textos,
                gráficos, logotipos, imágenes, clips de audio, descargas
                digitales, compilaciones de datos y software, es propiedad de
                Delivery Express o sus proveedores de contenido y está protegido
                por las leyes de propiedad intelectual.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                No se permite reproducir, duplicar, copiar, vender, revender o
                explotar cualquier parte del servicio, uso del servicio o acceso
                al servicio sin el permiso expreso por escrito de Delivery
                Express.
              </p>
            </div>
          </AnimatedSection>

          {/* Ley aplicable */}
          <AnimatedSection animation="slideRight" delay={0.9}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Ley Aplicable y Jurisdicción
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Estos Términos y Condiciones se regirán e interpretarán de
                acuerdo con las leyes del país donde opera Delivery Express, sin
                tener en cuenta sus disposiciones sobre conflictos de leyes.
                Cualquier disputa relacionada con estos términos o el uso de
                nuestro sitio será resuelta en los tribunales competentes de
                dicha jurisdicción.
              </p>
            </div>
          </AnimatedSection>

          {/* Contacto */}
          <AnimatedSection animation="fadeIn" delay={1}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="h-8 w-8 text-indigo-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Contacto
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Si tienes preguntas sobre estos Términos y Condiciones,
                contáctanos en:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <a
                    href="mailto:terms@deliveryexpress.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    terms@deliveryexpress.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    +1 (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Calle Principal 123, Ciudad, País
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
