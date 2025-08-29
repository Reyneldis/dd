// src/components/shared/CategoryImage.tsx
'use client';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface CategoryImageProps
  extends Omit<ImageProps, 'src' | 'alt' | 'onError'> {
  src: string;
  alt: string;
  fallback?: string;
}

export default function CategoryImage({
  src,
  alt,
  fallback = '/img/placeholder-category.jpg',
  ...props
}: CategoryImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Construir la URL completa para depuración
  const getImageUrl = (imageSrc: string) => {
    console.log(`Procesando URL de imagen: ${imageSrc}`);

    // Si la imagen ya es una URL completa, devolverla tal cual
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }

    // Si la imagen es el placeholder, devolverla tal cual
    if (imageSrc === '/img/placeholder-category.jpg') {
      return imageSrc;
    }

    // Si la imagen comienza con /img/, devolverla tal cual
    if (imageSrc.startsWith('/img/')) {
      return imageSrc;
    }

    // Si la imagen comienza con /uploads/, devolverla tal cual
    if (imageSrc.startsWith('/uploads/')) {
      return imageSrc;
    }

    // Si la imagen comienza con /api/, devolverla tal cual
    if (imageSrc.startsWith('/api/')) {
      return imageSrc;
    }

    // Si no, construir la URL usando la API
    const apiUrl = `/api/images/${imageSrc.replace(/^\//, '')}`;
    console.log(`URL construida para la API: ${apiUrl}`);
    return apiUrl;
  };

  const handleError = () => {
    console.error(`Error al cargar la imagen: ${imgSrc}`);
    if (!hasError) {
      setImgSrc(fallback);
      setHasError(true);
    }
  };

  return (
    <>
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-10">
          <p className="text-red-500 text-xs p-2">Error al cargar imagen</p>
        </div>
      )}
      <Image
        {...props}
        src={getImageUrl(imgSrc)}
        alt={alt}
        onError={handleError}
        unoptimized={imgSrc.startsWith('/api/')} // Desactivar optimización para imágenes de la API
      />
    </>
  );
}
