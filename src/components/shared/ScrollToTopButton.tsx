'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, Rocket } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Efecto para mostrar/ocultar el botón y el progreso
  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.pageYOffset;
      const maxHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxHeight > 0 ? (scrolled / maxHeight) * 100 : 0;

      setScrollProgress(progress);
      setIsVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // FUNCIÓN DE SCROLL ROBUSTA
  const scrollToTop = () => {
    if (isScrolling) return;

    setIsScrolling(true);
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / 800, 1); // Duración de 800ms

      // Easing function para una animación suave (easeOutCubic)
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const run = easeOutCubic(progress);

      window.scrollTo(0, startPosition * (1 - run));

      if (run < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <>
      {/* Efecto de "Hipervelocidad" durante el scroll */}
      <AnimatePresence>
        {isScrolling && (
          <motion.div
            className="fixed inset-0 z-[60] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.5 } }}
          >
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '-100%', opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.03,
                    ease: 'linear',
                  }}
                  style={{
                    width: `${Math.random() * 60 + 20}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
            <motion.div
              className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ transform: 'translate(-50%, -50%)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            ref={buttonRef}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 group"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            disabled={isScrolling}
            aria-label="Volver arriba"
          >
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    rotate: isHovered && !isScrolling ? -10 : 0,
                    y: isScrolling ? -50 : 0,
                    opacity: isScrolling ? 0 : 1,
                  }}
                  transition={{
                    rotate: { type: 'spring', stiffness: 300, damping: 20 },
                    y: { duration: 0.4, ease: 'easeOut' },
                    opacity: { duration: 0.4 },
                  }}
                >
                  {isHovered && !isScrolling ? (
                    <Rocket className="w-6 h-6 text-primary-foreground" />
                  ) : (
                    <ChevronUp className="w-6 h-6 text-primary-foreground" />
                  )}
                </motion.div>
              </div>
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
                    animate={
                      isScrolling
                        ? { opacity: 0 }
                        : {
                            opacity: [0, 1, 0],
                            x: [
                              '50%',
                              `${
                                50 + Math.cos((i * 60 * Math.PI) / 180) * 40
                              }%`,
                            ],
                            y: [
                              '50%',
                              `${
                                50 + Math.sin((i * 60 * Math.PI) / 180) * 40
                              }%`,
                            ],
                            scale: [0, 1, 0],
                          }
                    }
                    transition={{
                      duration: 2,
                      repeat: isScrolling ? 0 : Infinity,
                      delay: i * 0.2,
                      repeatDelay: 1,
                    }}
                  />
                ))}
              </div>
            </div>
            {!isScrolling && (
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
            )}
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
    </>
  );
}
