// src/components/shared/products/AddToCartButton.tsx
'use client';

import { useCart } from '@/hooks/use-cart';
import { useCartModal } from '@/hooks/use-cart-modal';
import { toast } from 'sonner';

type Product = {
  id: string;
  productName: string;
  price: number | string;
  images?: (string | { url: string; isPrimary?: boolean })[];
  slug: string;
  stock?: number;
};

export default function AddToCartButton({
  product,
  buttonClassName,
  children,
  icon,
  quantity = 1,
  openModalOnSuccess = true,
}: {
  product: Product;
  buttonClassName?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  quantity?: number;
  openModalOnSuccess?: boolean;
}) {
  const { addItem, isInCart, loading } = useCart();
  const { openCartModal } = useCartModal();

  const alreadyInCart = isInCart(product.slug);

  const handleAdd = () => {
    if (alreadyInCart) {
      toast.info('Este producto ya está en tu carrito');
      if (openModalOnSuccess) {
        openCartModal();
      }
      return;
    }

    if (product.stock !== undefined && product.stock < quantity) {
      toast.error('No hay suficiente stock para este producto.');
      return;
    }

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
      quantity: quantity,
    });

    if (openModalOnSuccess) {
      openCartModal();
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading || alreadyInCart}
      className={
        buttonClassName ||
        'w-full mt-2 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2 rounded-md hover:brightness-110 shadow transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
      }
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children
        ? children
        : alreadyInCart
        ? 'Ya en el carrito'
        : 'Añadir al carrito'}
    </button>
  );
}