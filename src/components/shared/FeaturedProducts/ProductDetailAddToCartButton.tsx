// src/components/shared/FeaturedProducts/ProductDetailAddToCartButton.tsx

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

interface ProductDetailAddToCartButtonProps {
  product: Product;
  quantity: number; // Esta prop es OBLIGATORIA para este componente
  buttonClassName?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  openModalOnSuccess?: boolean;
}

const ProductDetailAddToCartButton = forwardRef<
  HTMLButtonElement,
  ProductDetailAddToCartButtonProps
>(
  (
    {
      product,
      quantity,
      buttonClassName,
      children,
      icon,
      openModalOnSuccess = true,
    },
    ref,
  ) => {
    const { addItem, isInCart: isInCartHook, loading } = useCart();
    const { openCartModal } = useCartModal();
    const [isAdding, setIsAdding] = useState(false);

    const alreadyInCart = isInCartHook(product.slug);

    const handleAdd = async () => {
      if (product.stock === 0) {
        toast.error('Este producto está agotado');
        return;
      }

      // --- LÓGICA CORREGIDA ---
      // Si el producto ya está en el carrito, solo notificamos y abrimos el modal.
      if (alreadyInCart) {
        toast.info('Este producto ya está en tu carrito');
        if (openModalOnSuccess) {
          openCartModal();
        }
        return; // Detenemos la ejecución aquí.
      }
      // --- FIN DE LA LÓGICA ---

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
        toast.success(
          `${product.productName} (x${quantity}) agregado al carrito`,
        );

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
          'flex items-center justify-center gap-2 px-6 py-3 font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        }
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children || (
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
  },
);

ProductDetailAddToCartButton.displayName = 'ProductDetailAddToCartButton';

export default ProductDetailAddToCartButton;
