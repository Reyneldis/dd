'use client';
import AnimatedSection from '@/components/shared/AnimatedSection';
import {
  Database,
  Eye,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  Trash2,
} from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center pt-3.5">
            <AnimatedSection animation="slideDown" delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Política de Privacidad
              </h1>
            </AnimatedSection>
            <AnimatedSection animation="slideUp" delay={0.3}>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Tu privacidad es importante para nosotros. Esta política explica
                cómo recopilamos, usamos y protegemos tu información personal.
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
                <Shield className="h-8 w-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Compromiso con tu Privacidad
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                En Delivery Express, nos comprometemos a proteger tu privacidad
                y asegurar que tu información personal esté segura. Esta
                política de privacidad describe cómo recopilamos, usamos y
                protegemos tu información cuando utilizas nuestro sitio web y
                servicios.
              </p>
            </div>
          </AnimatedSection>

          {/* Recopilación de información */}
          <AnimatedSection animation="slideLeft" delay={0.3}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Database className="h-8 w-8 text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Información que Recopilamos
                </h2>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Información Personal
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nombre, dirección de correo electrónico, número de teléfono,
                    dirección de envío y datos de pago cuando realizas una
                    compra.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Información de Uso
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Datos sobre cómo interactúas con nuestro sitio web, como las
                    páginas que visitas, el tiempo que pasas en ellas y los
                    productos que ves.
                  </p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Cookies y Tecnologías Similares
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Utilizamos cookies para mejorar tu experiencia, recordar tus
                    preferencias y analizar el tráfico en nuestro sitio web.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Uso de la información */}
          <AnimatedSection animation="slideRight" delay={0.4}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="h-8 w-8 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Cómo Usamos tu Información
                </h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Para procesar y completar tus pedidos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Para comunicarnos contigo sobre tu cuenta o pedidos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Para mejorar nuestros productos, servicios y experiencia de
                    usuario
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Para enviarte ofertas, promociones y marketing (con tu
                    consentimiento)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Para cumplir con obligaciones legales y regulaciones
                  </span>
                </li>
              </ul>
            </div>
          </AnimatedSection>

          {/* Protección de datos */}
          <AnimatedSection animation="fadeIn" delay={0.5}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="h-8 w-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Protección de tus Datos
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Implementamos medidas de seguridad técnicas y organizativas
                adecuadas para proteger tu información personal contra acceso no
                autorizado, pérdida, destrucción o daño. Estas incluyen:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Cifrado SSL
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Todos los datos transmitidos entre tu navegador y nuestro
                    sitio están cifrados.
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Acceso Restringido
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Solo el personal autorizado puede acceder a tu información
                    personal.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Actualizaciones Regulares
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Mantenemos nuestros sistemas actualizados con las últimas
                    medidas de seguridad.
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Formación del Personal
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Nuestro equipo recibe formación regular sobre protección de
                    datos.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Tus derechos */}
          <AnimatedSection animation="slideUp" delay={0.6}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Trash2 className="h-8 w-8 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tus Derechos de Privacidad
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Tienes derechos sobre tus datos personales, incluyendo:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong>Acceso:</strong> Solicitar una copia de tus datos
                    personales
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong>Rectificación:</strong> Corregir datos inexactos o
                    incompletos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong>Eliminación:</strong> Solicitar la eliminación de
                    tus datos personales
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong>Portabilidad:</strong> Recibir tus datos en un
                    formato estructurado
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong>Oposición:</strong> Oponerte al procesamiento de tus
                    datos
                  </span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-gray-600 dark:text-gray-300">
                  Para ejercer estos derechos, contáctanos en:
                  <a
                    href="mailto:privacy@deliveryexpress.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  >
                    privacy@deliveryexpress.com
                  </a>
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Cambios a la política */}
          <AnimatedSection animation="slideDown" delay={0.7}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="h-8 w-8 text-indigo-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Cambios a esta Política
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Podemos actualizar esta política de privacidad periódicamente
                para reflejar cambios en nuestras prácticas o por razones
                operativas, legales o regulatorias. Te notificaremos sobre
                cualquier cambio significativo publicando la nueva política en
                esta página y actualizando la fecha de última actualización.
              </p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Última actualización: 1 de enero de 2025
              </div>
            </div>
          </AnimatedSection>

          {/* Contacto */}
          <AnimatedSection animation="fadeIn" delay={0.8}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contacto
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Si tienes preguntas o preocupaciones sobre esta política de
                privacidad o sobre cómo manejamos tus datos personales, no dudes
                en contactarnos:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <a
                    href="mailto:privacy@deliveryexpress.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    privacy@deliveryexpress.com
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
