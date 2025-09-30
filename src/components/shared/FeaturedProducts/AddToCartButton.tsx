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
    // Obtenemos la función isInCart del hook
    const {
      addItem,
      updateQuantity,
      isInCart: isInCartHook,
      loading,
    } = useCart();
    const { openCartModal } = useCartModal();
    const [isAdding, setIsAdding] = useState(false);

    // Usamos la función para determinar el estado DENTRO de este componente
    const alreadyInCart = isInCartHook(product.id);

    const handleAdd = async () => {
      if (product.stock === 0) {
        toast.error('Este producto está agotado');
        return;
      }

      setIsAdding(true);
      try {
        if (alreadyInCart) {
          await updateQuantity(product.id, quantity);
          toast.success(
            `Cantidad de ${product.productName} actualizada a ${quantity}`,
          );
        } else {
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
        }

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
        disabled={isAdding || loading || product.stock === 0}
        className={
          buttonClassName ||
          'w-full mt-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2 rounded-md hover:brightness-110 shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        }
      >
        {icon && <span className="mr-2">{icon}</span>}
        {/* Si se pasan "children", los usamos. Si no, usamos la lógica por defecto. */}
        {children || (
          <>
            {isAdding
              ? 'Agregando...'
              : alreadyInCart
              ? 'Actualizar cantidad'
              : 'Añadir al carrito'}
          </>
        )}
      </button>
    );
  },
);

AddToCartButton.displayName = 'AddToCartButton';

export default AddToCartButton;
