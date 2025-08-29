'use client';

import { imageCache } from '@/lib/image-cache';
import { useEffect } from 'react';

interface CategoryImagePreloaderProps {
  categories: Array<{ mainImage?: string }>;
}

export function CategoryImagePreloader({
  categories,
}: CategoryImagePreloaderProps) {
  useEffect(() => {
    // Extraer URLs de imágenes de las categorías
    const imageUrls = categories
      .map(category => category.mainImage)
      .filter(Boolean) as string[];

    // Precargar imágenes en segundo plano
    if (imageUrls.length > 0) {
      imageCache.preloadMultiple(imageUrls).catch(error => {
        console.warn('Error preloading category images:', error);
      });
    }
  }, [categories]);

  // Este componente no renderiza nada visible
  return null;
}
