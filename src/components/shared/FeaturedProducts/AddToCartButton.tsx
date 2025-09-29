// components/shared/FeaturedProducts/AddToCartButton.tsx
'use client';
import { useCart } from '@/hooks/use-cart';
import { useCartModal } from '@/hooks/use-cart-modal';
import { useState } from 'react';
import { toast } from 'sonner';

interface Product {
  id: string;
  productName: string;
  price: number | string;
  images?: (string | { url: string; isPrimary?: boolean })[];
  slug: string;
  stock?: number;
}

interface AddToCartButtonProps {
  product: Product;
  buttonClassName?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export default function AddToCartButton({
  product,
  buttonClassName,
  children,
  icon,
}: AddToCartButtonProps) {
  const { addItem, loading, isInCart } = useCart();
  const { openCartModal } = useCartModal();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (product.stock === 0) {
      toast.error('Este producto está agotado');
      return;
    }

    setIsAdding(true);
    try {
      // Preparar el item para el carrito
      const cartItem = {
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
      };

      // Verificar si el producto ya está en el carrito
      if (isInCart(product.id)) {
        toast.warning(`${product.productName} ya está en tu carrito`);
        // Abrir el modal para que el usuario pueda ver/ajustar la cantidad
        openCartModal();
        return;
      }

      // Agregar el producto al carrito
      await addItem(cartItem);

      // Abrir el modal para mostrar el carrito
      openCartModal();
    } catch (error) {
      console.error('Error al agregar producto:', error);
      toast.error('Error al agregar el producto al carrito');
    } finally {
      setIsAdding(false);
    }
  };

  const alreadyInCart = isInCart(product.id);

  return (
    <button
      onClick={handleAdd}
      disabled={isAdding || loading || product.stock === 0}
      className={
        buttonClassName ||
        'w-full mt-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2 rounded-md hover:brightness-110 shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      }
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children ? (
        children
      ) : (
        <>
          {isAdding
            ? 'Agregando...'
            : alreadyInCart
            ? 'Ver en el carrito'
            : 'Añadir al carrito'}
        </>
      )}
    </button>
  );
}
