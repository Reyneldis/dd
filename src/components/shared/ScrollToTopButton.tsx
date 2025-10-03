// src/components/shared/ScrollToTopButton.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.pageYOffset;
      const maxHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;

      setScrollProgress(progress);

      if (scrolled > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          aria-label="Volver arriba"
        >
          {/* Contenedor principal con efecto de brillo */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg overflow-hidden">
            {/* Efecto de brillo futurista */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Indicador de progreso circular */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="26"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-white/20 dark:text-black/20"
              />
              <circle
                cx="28"
                cy="28"
                r="26"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${
                  2 * Math.PI * 26 * (1 - scrollProgress / 100)
                }`}
                className="text-white/80 dark:text-black/80 transition-all duration-300"
              />
            </svg>

            {/* Contenido del botón */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: isHovered ? -10 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {isHovered ? (
                  <Rocket className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <ChevronUp className="w-6 h-6 text-primary-foreground" />
                )}
              </motion.div>
            </div>

            {/* Efecto de partículas animadas */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{
                    opacity: 0,
                    x: '50%',
                    y: '50%',
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: [
                      '50%',
                      `${50 + Math.cos((i * 60 * Math.PI) / 180) * 40}%`,
                    ],
                    y: [
                      '50%',
                      `${50 + Math.sin((i * 60 * Math.PI) / 180) * 40}%`,
                    ],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    repeatDelay: 1,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Efecto de onda expansiva al hacer hover */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 -z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: isHovered ? [1, 1.5, 2] : 1,
              opacity: isHovered ? [0.5, 0.2, 0] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 0.5,
            }}
          />

          {/* Efecto de sombra dinámica */}
          <motion.div
            className="absolute inset-0 rounded-full bg-black/10 dark:bg-white/10 blur-xl -z-20"
            animate={{
              scale: isHovered ? 1.2 : 1,
              opacity: isHovered ? 0.4 : 0.2,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
