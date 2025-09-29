'use client';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { OrderResponse } from '@/types/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const checkoutFormSchema = z.object({
  contactInfo: z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string().email('Por favor, introduce un correo válido'),
    phone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  }),
  shippingAddress: z.object({
    street: z.string().min(1, 'La dirección es requerida'),
    city: z.string().min(1, 'La ciudad es requerida'),
    state: z.string().min(1, 'El estado/provincia es requerido'),
    zip: z.string().min(1, 'El código postal es requerido'),
    country: z.string().optional(),
  }),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

interface CheckoutItem {
  slug: string;
  quantity: number;
  price: number;
  name: string;
}

export default function CheckoutForm() {
  const { items, clearCart } = useCart();
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [whatsappLinks, setWhatsappLinks] = useState<string[]>([]);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [orderNumber, setOrderNumber] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingAddress: {
        country: 'Cuba',
      },
    },
  });

  // Función para abrir enlaces de WhatsApp
  const openWhatsAppLinks = () => {
    if (whatsappLinks.length === 0) return;

    // Abrir el primer enlace inmediatamente
    if (currentLinkIndex < whatsappLinks.length) {
      const link = whatsappLinks[currentLinkIndex];
      console.log(`Abriendo enlace ${currentLinkIndex + 1}: ${link}`);

      // Intentar abrir en una nueva pestaña
      const newWindow = window.open(link, '_blank', 'noopener,noreferrer');

      // Si el navegador bloquea la ventana, mostrar mensaje
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === 'boolean'
      ) {
        console.warn(`El navegador bloqueó la ventana emergente para: ${link}`);
        toast.error(
          `Por favor, permite las ventanas emergentes para enviar el pedido por WhatsApp`,
          {
            duration: 8000,
            action: {
              label: 'Abrir manualmente',
              onClick: () => window.open(link, '_blank'),
            },
          },
        );
      }

      // Programar el siguiente enlace
      setCurrentLinkIndex(prev => prev + 1);
    }
  };

  // Efecto para abrir enlaces secuencialmente
  useEffect(() => {
    if (whatsappLinks.length > 0 && currentLinkIndex < whatsappLinks.length) {
      const timer = setTimeout(
        () => {
          openWhatsAppLinks();
        },
        currentLinkIndex === 0 ? 500 : 2000,
      ); // Primero con 500ms, luego 2s entre cada uno

      return () => clearTimeout(timer);
    } else if (
      whatsappLinks.length > 0 &&
      currentLinkIndex >= whatsappLinks.length
    ) {
      // Todos los enlaces han sido procesados
      setTimeout(() => {
        clearCart();
        router.push(`/orden-exitosa?order=${orderNumber}`);
      }, 1000);
    }
  }, [whatsappLinks, currentLinkIndex]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Procesando tu pedido...');

    const payload = {
      contactInfo: data.contactInfo,
      shippingAddress: {
        ...data.shippingAddress,
        country: data.shippingAddress.country || 'Cuba',
      },
      items: items.map(
        (item): CheckoutItem => ({
          slug: item.slug,
          quantity: Number(item.quantity),
          price: Number(item.price),
          name: item.productName,
        }),
      ),
      notes: data.notes,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 'Hubo un problema al crear tu pedido.',
        );
      }

      const result: OrderResponse = await response.json();
      toast.dismiss(loadingToast);

      // Verificar si hay enlaces de WhatsApp
      if (result.whatsappLinks && result.whatsappLinks.length > 0) {
        console.log('Enlaces de WhatsApp generados:', result.whatsappLinks);
        setWhatsappLinks(result.whatsappLinks);
        setOrderNumber(result.order?.orderNumber || '');
        setIsRedirecting(true);
        setIsSubmitting(false);
        toast.success('¡Pedido creado! Enviando a los administradores...');

        // Mostrar mensaje informativo
        toast.info(
          `Se enviará tu pedido a ${result.whatsappLinks.length} administradores por WhatsApp. Por favor, permite las ventanas emergentes.`,
          {
            duration: 8000,
          },
        );
      } else {
        // Manejo de error si no se generaron enlaces
        setIsSubmitting(false);
        toast.error(
          'No se pudieron generar los enlaces de WhatsApp. Contacta al administrador.',
        );
        clearCart();
        router.push(`/orden-exitosa?order=${result.order?.orderNumber || ''}`);
      }

      // Manejo de email
      if (!result.emailSent) {
        toast.error(
          'No se pudo enviar el correo de confirmación. Tu pedido ha sido recibido correctamente.',
          {
            duration: 8000,
          },
        );
      } else {
        toast.success('Correo de confirmación enviado correctamente');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      toast.dismiss(loadingToast);
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo completar el pedido.',
      );
      setIsSubmitting(false);
    }
  };

  if (isRedirecting) {
    return (
      <div className="text-center py-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Enviando pedido a los administradores...
          </h2>

          <div className="mb-4">
            <p className="text-green-700 mb-2">
              {currentLinkIndex < whatsappLinks.length
                ? `Enviando a administrador ${currentLinkIndex + 1} de ${
                    whatsappLinks.length
                  }...`
                : '¡Todos los administradores han sido notificados!'}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-1000"
                style={{
                  width: `${
                    (currentLinkIndex / Math.max(whatsappLinks.length, 1)) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {whatsappLinks.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 font-medium mb-2">
                Si las ventanas no se abren automáticamente, haz clic en los
                enlaces:
              </p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {whatsappLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 truncate text-sm"
                  >
                    Administrador {index + 1}: {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-green-600 mt-4">
            Por favor, espera a que se completen todos los envíos. No cierres
            esta página.
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">Tu carrito está vacío</h2>
        <p className="mt-2 text-gray-500">
          Añade productos para poder continuar con la compra.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Resumen del Pedido */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
        <div className="space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <p className="font-semibold">{item.productName}</p>
                <p className="text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </p>
              </div>
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t mt-6 pt-6">
          <div className="flex justify-between font-bold text-lg">
            <p>Total</p>
            <p>${total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Formulario de Envío */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Información de Envío</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre Completo
            </label>
            <input
              {...register('contactInfo.name')}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Tu nombre completo"
            />
            {errors.contactInfo?.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactInfo.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              {...register('contactInfo.email')}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="tu@email.com"
            />
            {errors.contactInfo?.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactInfo.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              {...register('contactInfo.phone')}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="12345678"
            />
            {errors.contactInfo?.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactInfo.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input
              {...register('shippingAddress.street')}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Calle y número"
            />
            {errors.shippingAddress?.street && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shippingAddress.street.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input
              {...register('shippingAddress.city')}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Tu ciudad"
            />
            {errors.shippingAddress?.city && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shippingAddress.city.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Estado/Provincia
            </label>
            <input
              {...register('shippingAddress.state')}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Tu estado/provincia"
            />
            {errors.shippingAddress?.state && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shippingAddress.state.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Código Postal
            </label>
            <input
              {...register('shippingAddress.zip')}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Código postal"
            />
            {errors.shippingAddress?.zip && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shippingAddress.zip.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notas Adicionales (Opcional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Instrucciones especiales de entrega..."
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {isSubmitting ? 'Procesando...' : 'Finalizar el Pedido'}
          </Button>

          <div className="text-sm text-gray-500 mt-2 p-3 bg-gray-50 rounded-md">
            <p className="font-medium">Importante:</p>
            <p>
              Al finalizar tu pedido, se abrirán automáticamente varias ventanas
              de WhatsApp para notificar a los administradores. Por favor,
              permite las ventanas emergentes en tu navegador.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
