'use client';

import AddToCartButton from '@/components/shared/FeaturedProducts/AddToCartButton';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types';
import { SignInButton, useAuth } from '@clerk/nextjs';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
  product?: Product;
  loading?: boolean;
}

export function ProductActions({
  product,
  loading = false,
}: ProductActionsProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleBuyNow = () => {
    if (isSignedIn) {
      router.push('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 mt-6">
        <Skeleton className="h-14 w-full rounded-full" />
        <Skeleton className="h-14 w-full rounded-full" />
        <Skeleton className="h-8 w-32 rounded-full mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col gap-6 mt-6">
        <div className="text-center text-red-500 font-semibold">
          Error: Producto no disponible.
        </div>
        <button
          onClick={() => router.back()}
          className="group text-base text-neutral-400 dark:text-neutral-500 font-medium px-0 py-2 bg-transparent transition-all relative focus:outline-none hover:text-primary"
        >
          Volver
          <span className="block mx-auto mt-0.5 h-0.5 w-0 group-hover:w-2/3 bg-primary rounded-full transition-all duration-300"></span>
        </button>
      </div>
    );
  }

  // Adaptar el producto para el botón de carrito
  const cartProduct = {
    id: product.id, // Usar el id como string
    productName: product.productName,
    price: product.price,
    image:
      product.images && product.images.length > 0
        ? product.images[0].url
        : '/img/placeholder-product.jpg',
    slug: product.slug,
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <AddToCartButton product={cartProduct} />
      {isSignedIn ? (
        <button
          onClick={handleBuyNow}
          className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            Comprar Ahora
          </span>
        </button>
      ) : (
        <SignInButton mode="modal">
          <button className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none">
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              Comprar Ahora
            </span>
          </button>
        </SignInButton>
      )}
      <button
        onClick={() => router.back()}
        className="group text-base text-neutral-400 dark:text-neutral-500 font-medium px-0 py-2 bg-transparent transition-all relative focus:outline-none hover:text-primary"
      >
        Volver
        <span className="block mx-auto mt-0.5 h-0.5 w-0 group-hover:w-2/3 bg-primary rounded-full transition-all duration-300"></span>
      </button>
    </div>
  );
}
