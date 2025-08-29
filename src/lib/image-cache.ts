class ImageCache {
  private cache = new Map<string, string>();
  private maxSize = 50; // Máximo número de imágenes en caché

  // Agregar imagen al caché
  set(key: string, value: string): void {
    // Si el caché está lleno, eliminar la entrada más antigua
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, value);
  }

  // Obtener imagen del caché
  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  // Verificar si existe en caché
  has(key: string): boolean {
    return this.cache.has(key);
  }

  // Limpiar caché
  clear(): void {
    this.cache.clear();
  }

  // Obtener tamaño del caché
  size(): number {
    return this.cache.size;
  }

  // Optimizar URL de imagen local
  optimizeLocalImage(src: string): string {
    if (!src.startsWith('/')) {
      return src;
    }

    // Si ya está en caché, devolver la versión cacheada
    if (this.has(src)) {
      return this.get(src)!;
    }

    // No agregar timestamp, solo devolver el src original
    this.set(src, src);
    return src;
  }

  // Precargar imagen
  preload(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.set(src, src);
        resolve();
      };

      img.onerror = () => {
        reject(new Error(`Failed to preload image: ${src}`));
      };

      img.src = this.optimizeLocalImage(src);
    });
  }

  // Precargar múltiples imágenes
  async preloadMultiple(images: string[]): Promise<void> {
    const promises = images.map(src =>
      this.preload(src).catch(err => {
        console.warn(err.message);
      }),
    );

    await Promise.all(promises);
  }
}

// Instancia global del caché
export const imageCache = new ImageCache();

// Hook para usar el caché
export function useImageCache() {
  return {
    optimize: (src: string) => imageCache.optimizeLocalImage(src),
    preload: (src: string) => imageCache.preload(src),
    preloadMultiple: (images: string[]) => imageCache.preloadMultiple(images),
    clear: () => imageCache.clear(),
    size: () => imageCache.size(),
  };
}
