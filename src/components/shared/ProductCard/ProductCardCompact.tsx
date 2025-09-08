// components/shared/ProductCard/ProductCardCompact.tsx
'use client';

import { useCart } from '@/hooks/use-cart'; // Esta importación es correcta
import { ProductFull } from '@/types/product';
import { SignInButton, useAuth } from '@clerk/nextjs';
import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardCompactProps {
  product: ProductFull;
}

export default function ProductCardCompact({
  product,
}: ProductCardCompactProps) {
  // Desestructurar solo las funciones que necesitas
  const { addItem, isInCart } = useCart();
  const { isSignedIn } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isSignedIn) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    if (!product.slug) {
      console.error('El producto no tiene slug válido:', product);
      toast.error('Producto no válido');
      return;
    }

    setIsAdding(true);

    try {
      const mainImage =
        product.images.find(img => img.isPrimary) || product.images[0];
      const imageUrl = mainImage?.url || '/img/placeholder-category.jpg';

      const cartItem = {
        productName: product.productName,
        price: product.price,
        slug: product.slug,
        image: imageUrl,
        quantity: 1,
      };

      if (isInCart(product.slug)) {
        toast.warning(`${product.productName} ya está en el carrito`);
      } else {
        addItem(cartItem);
        toast.success(`${product.productName} agregado al carrito`);
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error('Error al agregar el producto al carrito');
    } finally {
      setIsAdding(false);
    }
  };

  const mainImage =
    product.images.find(img => img.isPrimary) || product.images[0];
  const imageUrl = mainImage?.url || '/img/placeholder-category.jpg';

  // Mock rating
  const rating = 4.6;
  const maxStars = 5;
  const filledStars = Math.floor(rating);

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-[1.02] flex flex-col h-[320px]">
      {/* Imagen */}
      <div className="relative w-full h-[180px] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
        <Link
          href={`/products/${product.slug}`}
          className="block w-full h-full"
        >
          <Image
            src={imageUrl}
            alt={product.productName}
            width={300}
            height={180}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            priority={false}
          />
        </Link>
        {/* Botón favorito */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 ${
            isWishlisted
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart
            className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-current' : ''}`}
          />
        </button>
        {/* Badge destacado */}
        {product.featured && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-md">
              ⭐
            </span>
          </div>
        )}
      </div>
      {/* Contenido */}
      <div className="flex-1 flex flex-col p-4 space-y-3">
        {/* Nombre y rating */}
        <div className="space-y-2">
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.productName}
            </h3>
          </Link>
          {/* Rating compacto */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[...Array(filledStars)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 text-yellow-400 fill-yellow-400"
                />
              ))}
              {[...Array(maxStars - filledStars)].map((_, i) => (
                <Star key={i + 'empty'} className="h-3 w-3 text-slate-300" />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
              {rating}
            </span>
          </div>
        </div>
        {/* Categoría */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {product.category?.categoryName || 'Sin categoría'}
          </span>
        </div>
        {/* Precio y botones */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-lg font-bold text-yellow-500 dark:text-white">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex items-center gap-1.5">
            <Link
              href={`/products/${product.slug}`}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              aria-label="Ver detalles"
            >
              <Eye className="h-4 w-4" />
            </Link>
            {isSignedIn ? (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                  isInCart(product.slug)
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={
                  isInCart(product.slug)
                    ? 'Producto en el carrito'
                    : 'Añadir al carrito'
                }
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  aria-label="Inicia sesión para comprar"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
    </div>
  );
}
