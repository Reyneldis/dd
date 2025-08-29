'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Test de notificación al cargar la página
  useEffect(() => {
    console.log('Página de contacto cargada');
    toast.info('Página de contacto cargada correctamente', {
      icon: <CheckCircle className="h-4 w-4" />,
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Enviando formulario:', formData);

    try {
      const response = await fetch('/api/contact/gmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Respuesta del servidor:', response.status);
      const result = await response.json();
      console.log('Resultado:', result);

      if (result.success) {
        console.log('Mensaje enviado exitosamente');
        toast.success('¡Mensaje enviado con éxito! Te contactaremos pronto.', {
          icon: <CheckCircle className="h-4 w-4" />,
        });

        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        console.log('Error en el servidor:', result.message);
        toast.error(result.message || 'Error al enviar el mensaje.', {
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    } catch (error) {
      console.error('Error al enviar:', error);
      toast.error('Error al enviar el mensaje. Intenta nuevamente.', {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: 'Teléfono',
      value: '53 595957421',
      description: 'Línea directa 24/7',
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: 'Email',
      value: 'reyneldis537@gmail.com',
      description: 'Respuesta en 24 horas',
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: 'Dirección',
      value: 'Calle Principal ',
      description: 'Ciudad, Cuba',
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Horarios',
      value: 'Lun - Vie: 9:00 - 18:00',
      description: 'Sáb: 9:00 - 14:00',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center pt-3.5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Contáctanos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              ¿Tienes preguntas? ¿Necesitas ayuda? Estamos aquí para ti. Nuestro
              equipo está listo para ayudarte con cualquier consulta.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Información de Contacto */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-neutral-800 border-0 shadow-xl rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <MessageSquare className="h-6 w-6" />
                  Información de Contacto
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Estamos aquí para ayudarte con cualquier consulta
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-neutral-700 rounded-xl"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {info.title}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {info.value}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Información Adicional */}
            <Card className="bg-white dark:bg-neutral-800 border-0 shadow-xl rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <MessageSquare className="h-6 w-6" />
                  Información Adicional
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        Ubicación
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        Camagüey, Cuba
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        Servicio disponible en toda la ciudad
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        Tiempo de Respuesta
                      </h3>
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        Menos de 24 horas
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        Respuesta rápida y eficiente
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        Garantía de Calidad
                      </h3>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">
                        100% Satisfacción Garantizada
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        Productos de alta calidad verificados
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de Contacto */}
          <div>
            <Card className="bg-white dark:bg-neutral-800 border-0 shadow-xl rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-t-2xl">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                  <Send className="h-6 w-6" />
                  Envíanos un Mensaje
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Completa el formulario y te responderemos pronto
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Nombre completo *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="border-gray-300 dark:border-neutral-600 focus:border-blue-500 dark:focus:border-blue-400"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border-gray-300 dark:border-neutral-600 focus:border-blue-500 dark:focus:border-blue-400"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Asunto *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 dark:border-neutral-600 focus:border-blue-500 dark:focus:border-blue-400"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Mensaje *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="border-gray-300 dark:border-neutral-600 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
                      placeholder="Cuéntanos más sobre tu consulta..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Enviar Mensaje
                      </div>
                    )}
                  </Button>

                  {/* Botón de test para notificaciones */}
                  <Button
                    type="button"
                    onClick={() => {
                      console.log('Probando notificación...');
                      toast.success('¡Test de notificación exitoso!', {
                        icon: <CheckCircle className="h-4 w-4" />,
                      });
                    }}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300"
                  >
                    🧪 Probar Notificación
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="bg-white dark:bg-neutral-800 border-0 shadow-xl rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 rounded-t-2xl">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white">
                Preguntas Frecuentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="border-b border-gray-200 dark:border-neutral-700 pb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                    ¿Cuánto tiempo tardan en responder?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Normalmente respondemos en menos de 24 horas durante días
                    laborables.
                  </p>
                </div>
                <div className="border-b border-gray-200 dark:border-neutral-700 pb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                    ¿Puedo hacer pedidos por teléfono?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sí, puedes llamarnos directamente para hacer pedidos o
                    consultas sobre productos.
                  </p>
                </div>
                <div className="border-b border-gray-200 dark:border-neutral-700 pb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                    ¿Tienen servicio de entrega?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sí, ofrecemos entrega a domicilio en toda la ciudad y envíos
                    a otras ciudades.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                    ¿Puedo devolver un producto?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sí, aceptamos devoluciones dentro de los 30 días posteriores
                    a la compra.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
