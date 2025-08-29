import { useEffect, useState } from 'react';

interface UseImagePreloaderOptions {
  images: string[];
  priority?: boolean;
}

export function useImagePreloader({
  images,
  priority = false,
}: UseImagePreloaderOptions) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!images.length) {
      setIsLoading(false);
      return;
    }

    const preloadImages = async () => {
      const imagePromises = images.map(src => {
        return new Promise<void>(resolve => {
          const img = new Image();

          img.onload = () => {
            setLoadedImages(prev => new Set(Array.from(prev).concat(src)));
            resolve();
          };

          img.onerror = () => {
            console.warn(`Failed to preload image: ${src}`);
            resolve(); // Resolvemos para no bloquear otras imágenes
          };

          // Agregar timestamp para evitar caché en imágenes locales
          const optimizedSrc =
            src.startsWith('/') && !src.includes('?')
              ? `${src}?t=${Date.now()}`
              : src;

          img.src = optimizedSrc;
        });
      });

      try {
        if (priority) {
          // Para imágenes prioritarias, esperar a que carguen
          await Promise.all(imagePromises);
        } else {
          // Para imágenes no prioritarias, cargar en paralelo sin bloquear
          Promise.all(imagePromises);
        }
      } catch (error) {
        console.error('Error preloading images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [images, priority]);

  const isImageLoaded = (src: string) => loadedImages.has(src);

  return {
    isLoading,
    loadedImages: Array.from(loadedImages),
    isImageLoaded,
  };
}
