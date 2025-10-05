// src/components/shared/FeaturedProducts/AddToCartButton.tsx
'use client';
import { useCart } from '@/hooks/use-cart';
import { useCartModal } from '@/hooks/use-cart-modal';
import React, { forwardRef, useState } from 'react';
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
  quantity?: number;
  openModalOnSuccess?: boolean;
}

const AddToCartButton = forwardRef<HTMLButtonElement, AddToCartButtonProps>(
  (
    {
      product,
      buttonClassName,
      children,
      icon,
      quantity = 1,
      openModalOnSuccess = true,
    },
    ref,
  ) => {
    const { addItem, isInCart: isInCartHook, loading } = useCart();
    const { openCartModal } = useCartModal();
    const [isAdding, setIsAdding] = useState(false);

    const alreadyInCart = isInCartHook(product.id);

    const handleAdd = async () => {
      if (product.stock === 0) {
        toast.error('Este producto está agotado');
        return;
      }

      // CAMBIO CLAVE: Si ya está en el carrito, notificamos y salimos de la función.
      if (alreadyInCart) {
        toast.info('Este producto ya está en tu carrito');
        // Opcional: podemos abrir el modal para que el usuario lo vea.
        if (openModalOnSuccess) {
          openCartModal();
        }
        return; // Detenemos la ejecución aquí.
      }

      setIsAdding(true);
      try {
        // Si no está en el carrito, lo agregamos.
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
          quantity,
        };
        await addItem(cartItem);
        toast.success(`${product.productName} agregado al carrito`);

        if (openModalOnSuccess) {
          openCartModal();
        }
      } catch (error) {
        console.error('Error al agregar producto:', error);
        toast.error('Error al agregar el producto al carrito');
      } finally {
        setIsAdding(false);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleAdd}
        // CAMBIO: Deshabilitamos el botón si ya está en el carrito para evitar clics.
        disabled={isAdding || loading || product.stock === 0 || alreadyInCart}
        className={
          buttonClassName ||
          'w-full mt-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2 rounded-md hover:brightness-110 shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        }
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children || (
          <>
            {isAdding
              ? 'Agregando...'
              : alreadyInCart
              ? 'Ya en el carrito' // Texto más claro
              : 'Añadir al carrito'}
          </>
        )}
      </button>
    );
  },
);

AddToCartButton.displayName = 'AddToCartButton';

export default AddToCartButton;
