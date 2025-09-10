// 'use client';

// import { Button } from '@/components/ui/button';
// import { useCart } from '@/hooks/use-cart';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import { z } from 'zod';

// // Esquema de validación con Zod para los datos del formulario
// const checkoutFormSchema = z.object({
//   contactInfo: z.object({
//     name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
//     email: z.string().email('Por favor, introduce un correo válido'),
//     phone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
//   }),
//   shippingAddress: z.object({
//     street: z.string().min(1, 'La dirección es requerida'),
//     city: z.string().min(1, 'La ciudad es requerida'),
//     state: z.string().min(1, 'El estado/provincia es requerido'),
//     zip: z.string().min(1, 'El código postal es requerido'),
//     country: z.string().optional(),
//   }),
//   notes: z.string().optional(),
// });

// type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// export default function CheckoutForm() {
//   const { items, clearCart } = useCart();

//   const total = items.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0,
//   );
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<CheckoutFormData>({
//     resolver: zodResolver(checkoutFormSchema),
//   });

//   const formData = watch();
//   // Construye el mensaje de WhatsApp con los datos actuales del formulario y carrito
//   const buildWhatsappMessage = () => {
//     return `Nuevo Pedido:\n\nNombre: ${formData.contactInfo?.name || ''}\nTeléfono: ${formData.contactInfo?.phone || ''}\nEmail: ${formData.contactInfo?.email || ''}\nDirección: ${formData.shippingAddress?.street || ''}, ${formData.shippingAddress?.city || ''}\n\nProductos:\n${items
//       .map(item => `${item.quantity}x ${item.productName} - $${item.price}`)
//       .join(
//         '\n',
//       )}\n\nTotal: $${total.toFixed(2)}\n\nNotas: ${formData.notes || ''}`;
//   };
//   // Enlace del botón manual de WhatsApp: apunta al primer admin si está configurado
//   const adminButtonHref = (() => {
//     const adminNumbersEnv = process.env.NEXT_PUBLIC_WHATSAPP_ADMINS || '';
//     const adminNumbers = adminNumbersEnv
//       .split(',')
//       .map(n => n.trim())
//       .filter(n => n.length > 0);
//     const firstAdmin = adminNumbers[0];
//     const base = firstAdmin
//       ? `https://wa.me/${firstAdmin.replace(/\D/g, '')}`
//       : 'https://wa.me/';
//     const message = buildWhatsappMessage();
//     return `${base}?text=${encodeURIComponent(message)}`;
//   })();

//   const onSubmit = async (data: CheckoutFormData) => {
//     const { contactInfo, shippingAddress } = data;
//     setIsSubmitting(true);
//     toast.loading('Procesando tu pedido...');

//     const payload = {
//       contactInfo,
//       shippingAddress: {
//         ...shippingAddress,
//         country: shippingAddress.country || 'Cuba',
//       },
//       items: items.map(item => ({
//         slug: item.slug,
//         quantity: Number(item.quantity),
//         price: Number(item.price),
//         name: item.productName,
//       })),
//     };

//     try {
//       const response = await fetch('/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.error || 'Hubo un problema al crear tu pedido.');
//       }

//       toast.dismiss();
//       toast.success('¡Pedido realizado con éxito!');

//       // Notificación por WhatsApp (cliente) a admins vía wa.me si está configurado
//       try {
//         const adminNumbersEnv = process.env.NEXT_PUBLIC_WHATSAPP_ADMINS || '';
//         const adminNumbers = adminNumbersEnv
//           .split(',')
//           .map(n => n.trim())
//           .filter(n => n.length > 0);

//         if (adminNumbers.length > 0) {
//           const total = items.reduce(
//             (acc, item) => acc + item.price * item.quantity,
//             0,
//           );
//           const message =
//             `🛒 NUEVO PEDIDO ${result?.orderNumber || ''}\n\n` +
//             `👤 Cliente: ${contactInfo.name}\n` +
//             `📞 Tel: ${contactInfo.phone}\n` +
//             `✉️ Email: ${contactInfo.email}\n` +
//             `📍 Dirección: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip || ''}\n\n` +
//             `🧾 Productos:\n${items.map(it => `• ${it.productName} x${it.quantity} - $${(it.price * it.quantity).toFixed(2)}`).join('\n')}\n\n` +
//             `💰 Total: $${total.toFixed(2)}`;

//           adminNumbers.forEach((num, idx) => {
//             const url = `https://wa.me/${num.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
//             setTimeout(() => window.open(url, '_blank'), idx * 400);
//           });
//         }
//       } catch {
//         // Ignorar errores de apertura de ventanas
//       }

//       clearCart();
//       router.push('/');
//     } catch (error) {
//       console.error('Error al enviar el formulario:', error);
//       toast.dismiss();
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : 'No se pudo completar el pedido.',
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Mensaje manual ya integrado en adminButtonHref a través de buildWhatsappMessage()

//   if (items.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-semibold">Tu carrito está vacío</h2>
//         <p className="mt-2 text-gray-500">
//           Añade productos para poder continuar con la compra.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//       <div>
//         <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
//         <div className="space-y-4">
//           {items.map(item => (
//             <div key={item.id} className="flex justify-between items-center">
//               <div>
//                 <p className="font-semibold">{item.productName}</p>
//                 <p className="text-sm text-gray-500">
//                   Cantidad: {item.quantity}
//                 </p>
//               </div>
//               <p className="font-semibold">
//                 ${(item.price * item.quantity).toFixed(2)}
//               </p>
//             </div>
//           ))}
//         </div>
//         <div className="border-t mt-6 pt-6">
//           <div className="flex justify-between font-bold text-lg">
//             <p>Total</p>
//             <p>${total.toFixed(2)}</p>
//           </div>
//         </div>
//       </div>

//       <div>
//         <h2 className="text-2xl font-bold mb-6">Información de Envío</h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="space-y-1">
//             <label
//               htmlFor="contactInfo.name"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Nombre Completo
//             </label>
//             <input
//               id="contactInfo.name"
//               {...register('contactInfo.name')}
//               placeholder="Ana Martínez"
//               className="w-full px-3 py-2 border rounded-md"
//             />
//             {errors.contactInfo?.name && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.contactInfo.name.message}
//               </p>
//             )}
//           </div>

//           <div className="space-y-1">
//             <label
//               htmlFor="contactInfo.email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Correo Electrónico
//             </label>
//             <input
//               id="contactInfo.email"
//               {...register('contactInfo.email')}
//               placeholder="ana.martinez@correo.com"
//               className="w-full px-3 py-2 border rounded-md"
//             />
//             {errors.contactInfo?.email && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.contactInfo.email.message}
//               </p>
//             )}
//           </div>

//           <div className="space-y-1">
//             <label
//               htmlFor="contactInfo.phone"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Teléfono
//             </label>
//             <input
//               id="contactInfo.phone"
//               {...register('contactInfo.phone')}
//               placeholder="55551234"
//               className="w-full px-3 py-2 border rounded-md"
//             />
//             {errors.contactInfo?.phone && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.contactInfo.phone.message}
//               </p>
//             )}
//           </div>

//           <div className="space-y-1">
//             <label
//               htmlFor="shippingAddress.street"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Dirección (Calle y Número)
//             </label>
//             <input
//               id="shippingAddress.street"
//               {...register('shippingAddress.street')}
//               placeholder="Avenida de la Independencia #456"
//               className="w-full px-3 py-2 border rounded-md"
//             />
//             {errors.shippingAddress?.street && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.shippingAddress.street.message}
//               </p>
//             )}
//           </div>

//           <div className="space-y-1">
//             <label
//               htmlFor="shippingAddress.city"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Ciudad
//             </label>
//             <input
//               id="shippingAddress.city"
//               {...register('shippingAddress.city')}
//               placeholder="La Habana"
//               className="w-full px-3 py-2 border rounded-md"
//             />
//             {errors.shippingAddress?.city && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.shippingAddress.city.message}
//               </p>
//             )}
//           </div>

//           <div className="space-y-1">
//             <label
//               htmlFor="shippingAddress.state"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Estado/Provincia
//             </label>
//             <input
//               id="shippingAddress.state"
//               {...register('shippingAddress.state')}
//               placeholder="Plaza de la Revolución"
//               className="w-full px-3 py-2 border rounded-md"
//             />
//             {errors.shippingAddress?.state && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.shippingAddress.state.message}
//               </p>
//             )}
//           </div>

//           <div className="space-y-1">
//             <label
//               htmlFor="shippingAddress.zip"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Código Postal
//             </label>
//             <input
//               id="shippingAddress.zip"
//               {...register('shippingAddress.zip')}
//               placeholder="10600"
//               className="w-full px-3 py-2 border rounded-md"
//             />
//             {errors.shippingAddress?.zip && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.shippingAddress.zip.message}
//               </p>
//             )}
//           </div>

//           <div className="space-y-1">
//             <label
//               htmlFor="notes"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Notas Adicionales (Opcional)
//             </label>
//             <textarea
//               id="notes"
//               {...register('notes')}
//               placeholder="Entregar después de las 2 PM, por favor."
//               className="w-full px-3 py-2 border rounded-md"
//             />
//           </div>

//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
//           >
//             {isSubmitting ? 'Procesando...' : 'Finalizar Compra'}
//           </Button>
//           <a
//             href={adminButtonHref}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-block w-full"
//           >
//             <Button
//               type="button"
//               className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4"
//             >
//               O Enviar por WhatsApp
//             </Button>
//           </a>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Esquema de validación con Zod para los datos del formulario
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

export default function CheckoutForm() {
  const { items, clearCart } = useCart();
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
  });
  const formData = watch();

  // Construye el mensaje de WhatsApp con los datos actuales del formulario y carrito
  const buildWhatsappMessage = () => {
    return `Nuevo Pedido:\n\nNombre: ${
      formData.contactInfo?.name || ''
    }\nTeléfono: ${formData.contactInfo?.phone || ''}\nEmail: ${
      formData.contactInfo?.email || ''
    }\nDirección: ${formData.shippingAddress?.street || ''}, ${
      formData.shippingAddress?.city || ''
    }\n\nProductos:\n${items
      .map(item => `${item.quantity}x ${item.productName} - $${item.price}`)
      .join('\n')}\n\nTotal: $${total.toFixed(2)}\n\nNotas: ${
      formData.notes || ''
    }`;
  };

  // Enlace del botón manual de WhatsApp: apunta al primer admin si está configurado
  const adminButtonHref = (() => {
    const adminNumbersEnv = process.env.NEXT_PUBLIC_WHATSAPP_ADMINS || '';
    const adminNumbers = adminNumbersEnv
      .split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0);
    const firstAdmin = adminNumbers[0];
    const base = firstAdmin
      ? `https://wa.me/${firstAdmin.replace(/\D/g, '')}`
      : 'https://wa.me/';
    const message = buildWhatsappMessage();
    return `${base}?text=${encodeURIComponent(message)}`;
  })();

  const onSubmit = async (data: CheckoutFormData) => {
    const { contactInfo, shippingAddress } = data;
    setIsSubmitting(true);
    toast.loading('Procesando tu pedido...');

    const payload = {
      contactInfo,
      shippingAddress: {
        ...shippingAddress,
        country: shippingAddress.country || 'Cuba',
      },
      items: items.map(item => ({
        slug: item.slug,
        quantity: Number(item.quantity),
        price: Number(item.price),
        name: item.productName,
      })),
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // Si no es JSON, obtener como texto
        const text = await response.text();
        throw new Error(`Respuesta no válida: ${text}`);
      }

      if (!response.ok) {
        throw new Error(result.error || 'Hubo un problema al crear tu pedido.');
      }

      toast.dismiss();
      toast.success('¡Pedido realizado con éxito!');

      // Notificación por WhatsApp (cliente) a admins vía wa.me si está configurado
      try {
        const adminNumbersEnv = process.env.NEXT_PUBLIC_WHATSAPP_ADMINS || '';
        const adminNumbers = adminNumbersEnv
          .split(',')
          .map(n => n.trim())
          .filter(n => n.length > 0);

        if (adminNumbers.length > 0) {
          const total = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          );

          const message =
            `🛒 NUEVO PEDIDO ${result?.orderNumber || ''}\n\n` +
            `👤 Cliente: ${contactInfo.name}\n` +
            `📞 Tel: ${contactInfo.phone}\n` +
            `✉️ Email: ${contactInfo.email}\n` +
            `📍 Dirección: ${shippingAddress.street}, ${
              shippingAddress.city
            }, ${shippingAddress.state} ${shippingAddress.zip || ''}\n\n` +
            `🧾 Productos:\n${items
              .map(
                it =>
                  `• ${it.productName} x${it.quantity} - $${(
                    it.price * it.quantity
                  ).toFixed(2)}`,
              )
              .join('\n')}\n\n` +
            `💰 Total: $${total.toFixed(2)}`;

          adminNumbers.forEach((num, idx) => {
            const url = `https://wa.me/${num.replace(
              /\D/g,
              '',
            )}?text=${encodeURIComponent(message)}`;
            setTimeout(() => window.open(url, '_blank'), idx * 400);
          });
        }
      } catch {
        // Ignorar errores de apertura de ventanas
      }

      clearCart();
      router.push('/');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      toast.dismiss();
      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo completar el pedido.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mensaje manual ya integrado en adminButtonHref a través de buildWhatsappMessage()
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
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
      <div>
        <h2 className="text-2xl font-bold mb-6">Información de Envío</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="contactInfo.name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre Completo
            </label>
            <input
              id="contactInfo.name"
              {...register('contactInfo.name')}
              placeholder="Ana Martínez"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.contactInfo?.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactInfo.name.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label
              htmlFor="contactInfo.email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              id="contactInfo.email"
              {...register('contactInfo.email')}
              placeholder="ana.martinez@correo.com"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.contactInfo?.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactInfo.email.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label
              htmlFor="contactInfo.phone"
              className="block text-sm font-medium text-gray-700"
            >
              Teléfono
            </label>
            <input
              id="contactInfo.phone"
              {...register('contactInfo.phone')}
              placeholder="55551234"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.contactInfo?.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactInfo.phone.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label
              htmlFor="shippingAddress.street"
              className="block text-sm font-medium text-gray-700"
            >
              Dirección (Calle y Número)
            </label>
            <input
              id="shippingAddress.street"
              {...register('shippingAddress.street')}
              placeholder="Avenida de la Independencia #456"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.shippingAddress?.street && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shippingAddress.street.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label
              htmlFor="shippingAddress.city"
              className="block text-sm font-medium text-gray-700"
            >
              Ciudad
            </label>
            <input
              id="shippingAddress.city"
              {...register('shippingAddress.city')}
              placeholder="La Habana"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.shippingAddress?.city && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shippingAddress.city.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label
              htmlFor="shippingAddress.state"
              className="block text-sm font-medium text-gray-700"
            >
              Estado/Provincia
            </label>
            <input
              id="shippingAddress.state"
              {...register('shippingAddress.state')}
              placeholder="Plaza de la Revolución"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.shippingAddress?.state && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shippingAddress.state.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label
              htmlFor="shippingAddress.zip"
              className="block text-sm font-medium text-gray-700"
            >
              Código Postal
            </label>
            <input
              id="shippingAddress.zip"
              {...register('shippingAddress.zip')}
              placeholder="10600"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.shippingAddress?.zip && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shippingAddress.zip.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notas Adicionales (Opcional)
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              placeholder="Entregar después de las 2 PM, por favor."
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? 'Procesando...' : 'Finalizar Compra'}
          </Button>
          <a
            href={adminButtonHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full"
          >
            {/* <Button
              type="button"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4"
            >
              O Enviar por WhatsApp
            </Button> */}
          </a>
        </form>
      </div>
    </div>
  );
}
