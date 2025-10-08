// src/components/shared/FeaturedProducts/FeaturedProductCard.tsx
'use client';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProductFull } from '@/types/product';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AddToCartButton from './AddToCartButton';

function useAnimatedNumber(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    function animate(now: number) {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Number((progress * target).toFixed(2)));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    }
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [target]);
  return value;
}

export default function FeaturedProductCard({
  product,
  loading,
}: {
  product: ProductFull;
  loading?: boolean;
}) {
  const mainImage =
    product?.images && product.images.length > 0
      ? typeof product.images[0] === 'string'
        ? product.images[0]
        : (product.images[0] as { url: string }).url
      : '/img/placeholder-product.jpg';

  // Animación de precio
  const animatedPrice = useAnimatedNumber(Number(product?.price || 0));

  // Animación de entrada
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const controls = useAnimation();
  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0, scale: 1 });
    }
  }, [inView, controls]);

  // Hide if out of stock
  if (!loading && (!product || product.stock <= 0)) {
    return null;
  }

  if (loading) {
    return (
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-border/20 flex flex-col items-center p-4 w-full h-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Skeleton className="w-[120px] h-[120px] rounded-2xl mb-3" />
        <Skeleton className="h-6 w-3/4 rounded mb-2" />
        <Skeleton className="h-4 w-1/2 rounded mb-2" />
        <Skeleton className="h-8 w-full rounded mt-3" />
      </motion.div>
    );
  }

  return (
    <motion.article
      ref={ref}
      className="relative group bg-white dark:bg-slate-900 rounded-2xl shadow-xl hover:shadow-2xl border border-border/20 transition-all duration-300 overflow-hidden flex flex-col items-center p-4 w-[320px] sm:w-[340px] max-w-full h-auto min-h-[340px] justify-between"
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={controls}
      whileHover={{ scale: 1.04, boxShadow: '0 12px 40px 0 rgba(0,0,0,0.18)' }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
    >
      {/* Badge dorado */}
      <span className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-300 text-yellow-700" /> Destacado
      </span>

      {/* Imagen protagonista */}
      <motion.div
        className="w-full flex justify-center items-center pt-4 pb-2"
        whileHover={{ scale: 1.07 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="rounded-2xl shadow-lg overflow-hidden border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainImage}
            alt={product.productName || 'Producto destacado'}
            width="320"
            height="320"
            className="rounded-2xl object-cover"
            loading="lazy"
          />
        </div>
      </motion.div>

      {/* Parte inferior sólida */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-4 pb-4 pt-2 bg-white dark:bg-slate-900 rounded-b-3xl">
        <h3 className="text-lg sm:text-xl font-extrabold text-center text-slate-900 dark:text-blue-200 mb-1">
          {product.productName}
        </h3>

        <p className="text-xs text-muted-foreground mb-2 text-center">
          {typeof product.category === 'string'
            ? product.category
            : product.category &&
              typeof product.category === 'object' &&
              'categoryName' in product.category
            ? (product.category as { categoryName: string }).categoryName
            : ''}
        </p>

        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-lg font-bold text-primary flex items-end gap-1">
            <span className="text-base align-bottom">$</span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="text-2xl font-extrabold tracking-tight animate-pulse"
            >
              {animatedPrice.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </motion.span>
          </span>
        </div>

        {/* Indicador de stock */}
        <div className="flex items-center justify-center gap-1 mb-3">
          <span
            className={`text-xs font-medium ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
          </span>
        </div>

        {/* Botón premium usando el componente que realmente agrega */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-full"
        >
          <AddToCartButton
            product={product}
            buttonClassName="w-full mt-3 bg-primary text-primary-foreground font-bold text-base py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-200 hover:bg-primary/90 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            icon={<ShoppingCart className="w-5 h-5" />}
          >
            Añadir
          </AddToCartButton>
        </motion.div>
      </div>
    </motion.article>
  );
}
