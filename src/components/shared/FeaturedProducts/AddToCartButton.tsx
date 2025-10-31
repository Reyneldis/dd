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

    // Verificamos si el producto ya está en el carrito
    const alreadyInCart = isInCartHook(product.slug);

    const handleAdd = async () => {
      if (product.stock === 0) {
        toast.error('Este producto está agotado');
        return;
      }

      // === INICIO: LÓGICA DE NOTIFICACIÓN CUANDO YA ESTÁ EN EL CARRITO ===
      // Si el producto ya está en el carrito, mostramos una notificación y abrimos el modal.
      if (alreadyInCart) {
        toast.info('Este producto ya está en tu carrito');
        // Opcional: Abrimos el modal para que el usuario pueda verlo o modificar la cantidad.
        if (openModalOnSuccess) {
          openCartModal();
        }
        return; // Detenemos la función aquí para no agregarlo de nuevo.
      }
      // === FIN: LÓGICA DE NOTIFICACIÓN ===

      setIsAdding(true);
      try {
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
        // El botón se deshabilita si ya está en el carrito, si está cargando o si no hay stock.
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
              ? 'Ya en el carrito' // El texto del botón también cambia
              : 'Añadir al carrito'}
          </>
        )}
      </button>
    );
  },
);

AddToCartButton.displayName = 'AddToCartButton';

export default AddToCartButton;
