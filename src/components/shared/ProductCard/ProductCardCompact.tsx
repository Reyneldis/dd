// components/shared/ProductCard/ProductCardCompact.tsx
'use client';
import { useCart } from '@/hooks/use-cart';
import { ProductFull } from '@/types/product';
import { Eye, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardCompactProps {
  product: ProductFull;
}

export default function ProductCardCompact({
  product,
}: ProductCardCompactProps) {
  const { addItem, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Conditional returns must be after all hook calls.
  if (!product) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col h-[320px] items-center justify-center">
        <p className="text-red-500">Producto no disponible</p>
      </div>
    );
  }

  const stock = product.stock || 0;
  const isOutOfStock = stock === 0;

  if (isOutOfStock) {
    return null;
  }

  // All logic that depends on `product` can now safely be defined.
  const handleAddToCart = async () => {
    if (!product || !product.id) {
      toast.error('Producto no válido');
      return;
    }

    setIsAdding(true);
    try {
      const mainImage =
        product.images && product.images.length > 0
          ? product.images.find(img => img.isPrimary) || product.images[0]
          : null;
      const imageUrl = mainImage?.url || '/img/placeholder-product.jpg';

      const cartItem = {
        id: product.id,
        productName: product.productName || '',
        price: typeof product.price === 'number' ? product.price : 0,
        slug: product.slug,
        image: imageUrl,
        quantity: 1,
      };

      const productInCart = isInCart(product.id);
      if (productInCart) {
        toast.warning(`${product.productName} ya está en el carrito`);
      } else {
        await addItem(cartItem);
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
    product.images && product.images.length > 0
      ? product.images.find(img => img.isPrimary) || product.images[0]
      : null;

  const imageUrl = mainImage?.url || '/img/placeholder-product.jpg';

  const rating = 4.6;
  const maxStars = 5;
  const filledStars = Math.floor(rating);
  const isLowStock = stock > 0 && stock < 5;

  // Producto con stock normal
  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-[1.02] flex flex-col h-[320px]">
      {/* Imagen */}
      <div className="relative w-full h-[180px] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
        <Link
          href={product.id ? `/products/${product.id}` : '#'}
          className="block w-full h-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={product.productName || 'Producto'}
            width="300"
            height="180"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        {/* Indicador de stock */}
        <div className="absolute top-2 left-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold shadow-md ${
              isLowStock ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {isLowStock ? `¡Últimas ${stock}!` : `${stock} disponibles`}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col p-4 space-y-3">
        {/* Nombre y rating */}
        <div className="space-y-2">
          <Link
            href={product.id ? `/products/${product.id}` : '#'}
            className="block"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.productName || 'Producto sin nombre'}
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
          <div className="flex flex-col">
            <div className="flex items-end gap-1">
              <span className="text-lg font-bold text-slate-400 dark:text-slate-400 mb-0.5">
                ${' '}
              </span>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 leading-none">
                {typeof product.price === 'number'
                  ? product.price.toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={product.id ? `/products/${product.id}` : '#'}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              aria-label="Ver detalles"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={isAdding || !product.id}
              className={`p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                product.id && isInCart(product.id)
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={
                product.id && isInCart(product.id)
                  ? 'Producto en el carrito'
                  : 'Añadir al carrito'
              }
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
    </div>
  );
}
