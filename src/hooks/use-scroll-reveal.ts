// src/hooks/use-scroll-reveal.ts
import { RefObject, useEffect, useState } from 'react';

export const useScrollReveal = (
  ref: RefObject<Element | null>,
  threshold = 0.1,
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentElement = ref.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(currentElement);
        }
      },
      {
        threshold,
        // --- CAMBIO CLAVE: Aumentamos el margen para activar la animación antes ---
        rootMargin: '0px 0px -100px 0px', // Era -50px, ahora -100px
      },
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [ref, threshold]);

  return isVisible;
};
