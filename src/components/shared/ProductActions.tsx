'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

// Se asume un tipo de producto básico.
// Asegúrate de que coincida con el tipo real de tu producto.
type Product = {
  id: string | number;
  productName: string;
  // ...otras propiedades del producto
};

// Se asume que el componente recibe 'product' como prop.
export default function ProductActions({ product }: { product: Product }) {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleBuyNow = () => {
    if (isSignedIn) {
      console.log('Producto que se agrega al carrito (Buy Now):', product);
      // Aquí deberías añadir el producto al carrito antes de redirigir
      router.push('/checkout');
    } else {
      // Opcional: Redirigir a la página de inicio de sesión si no está autenticado.
      router.push('/sign-in');
    }
  };

  // Aquí iría el JSX que renderiza los botones de acción, por ejemplo:
  return (
    <button onClick={handleBuyNow} className="bg-blue-500 text-white p-2 rounded">
      Comprar Ahora
    </button>
  );
}
