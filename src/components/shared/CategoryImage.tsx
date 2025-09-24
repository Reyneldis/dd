// src/components/shared/CategoryImage.tsx
'use client';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface CategoryImageProps
  extends Omit<ImageProps, 'src' | 'alt' | 'onError'> {
  src: string;
  alt?: string; // Hacer alt opcional con valor por defecto
  fallback?: string;
}

export default function CategoryImage({
  src,
  alt = 'Imagen de categoría', // Valor por defecto
  fallback = '/img/placeholder-category.jpg',
  ...props
}: CategoryImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const getImageUrl = (imageSrc: string) => {
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }
    if (imageSrc === '/img/placeholder-category.jpg') {
      return imageSrc;
    }
    if (
      imageSrc.startsWith('/img/') ||
      imageSrc.startsWith('/uploads/') ||
      imageSrc.startsWith('/api/')
    ) {
      return imageSrc;
    }
    return `/api/images/${imageSrc.replace(/^\//, '')}`;
  };

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallback);
      setHasError(true);
    }
  };

  // Generar texto alt descriptivo basado en la URL si no se proporciona
  const generateAltText = () => {
    if (alt && alt !== 'Imagen de categoría') return alt;

    // Intentar extraer el nombre del archivo para un alt más descriptivo
    const filename = src.split('/').pop()?.split('.')[0] || '';
    if (filename) {
      return `Imagen de ${filename.replace(/[-_]/g, ' ')}`;
    }

    return 'Imagen de categoría';
  };

  const altText = generateAltText();

  return (
    <div className="relative w-full h-full">
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 rounded">
          <p className="text-gray-500 text-xs p-2">Imagen no disponible</p>
        </div>
      )}
      <Image
        {...props}
        src={getImageUrl(imgSrc)}
        alt={altText}
        fill
        onError={handleError}
        className="object-cover"
        unoptimized={imgSrc.startsWith('/api/')}
      />
    </div>
  );
}
