'use client';

import { useCart } from '@/hooks/use-cart';
import { Eye, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// En el componente ProductCard
interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    productName: string;
    price: number;
    description?: string | null; // Aceptar null
    images?: Array<{
      url: string;
      alt?: string | null; // Aceptar null
    }>;
    category?: {
      categoryName: string;
      description?: string | null; // Aceptar null
    };
    // ... otras propiedades
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = product.images?.[0]?.url || '/img/placeholder-product.jpg';

  return (
    <div className="group relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col animate-fade-in">
      {/* Imagen con placeholder y lazy loading */}
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={product.productName}
          fill
          className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="text-xs text-neutral-700 dark:text-neutral-300 mb-2">
          {product.category?.categoryName || 'Sin categoría'}
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg text-neutral-800 dark:text-yellow-300 mb-2 line-clamp-2 hover:text-primary transition-colors duration-300">
            {product.productName}
          </h3>
        </Link>

        <div className="text-3xl font-bold text-amber-500 dark:text-orange-500 mb-2.5">
          ${product.price.toLocaleString('es')}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Ver detalles
          </Link>
          <button
            onClick={() =>
              addItem({
                id: product.id,
                productName: product.productName,
                price: product.price,
                image: imageUrl,
                slug: product.slug,
              })
            }
            className="flex-1 flex items-center cursor-pointer justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
