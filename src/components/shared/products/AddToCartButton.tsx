// src/components/shared/products/AddToCartButton.tsx

'use client';
import { useCart } from '@/hooks/use-cart';
import { useCartStore } from '@/store/cart-store';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

type Product = {
  id: string;
  productName: string;
  price: number | string;
  images?: (string | { url: string; isPrimary?: boolean })[];
  slug: string;
};

export default function AddToCartButton({
  product,
  buttonClassName,
  children,
  icon,
}: {
  product: Product;
  buttonClassName?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const { addItem } = useCart();
  const { user } = useUser();
  const setCart = useCartStore(state => state.setCart);

  // Para usuarios no logueados, guardar el productId en localStorage
  useEffect(() => {
    if (!user) {
      const handleStorageChange = () => {
        const cartData = localStorage.getItem('cart-storage');
        if (cartData) {
          try {
            const parsedCart = JSON.parse(cartData);
            if (parsedCart.state && parsedCart.state.items) {
              setCart(parsedCart.state.items);
            }
          } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [user, setCart]);

  const handleAdd = () => {
    addItem({
      id: product.id,
      productName: product.productName,
      price:
        typeof product.price === 'string'
          ? parseFloat(product.price)
          : product.price,
      image:
        product.images && product.images.length > 0
          ? typeof product.images[0] === 'string'
            ? product.images[0]
            : (
                product.images.find(
                  img => typeof img !== 'string' && img.isPrimary,
                ) as { url: string } | undefined
              )?.url || (product.images[0] as { url: string }).url
          : '/img/placeholder-product.jpg',
      slug: product.slug,
      quantity: 1, // <-- ¡SOLUCIÓN! Añadimos la cantidad por defecto.
    });
  };

  return (
    <button
      onClick={handleAdd}
      className={
        buttonClassName ||
        'w-full mt-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2 rounded-md hover:brightness-110 shadow transition-all duration-200'
      }
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children ? children : 'Añadir al carrito'}
    </button>
  );
}
