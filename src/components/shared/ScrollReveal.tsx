// --- CAMBIO CLAVE: Añadir la directiva "use client" ---
'use client';

import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { motion, Variants } from 'framer-motion';
import { ReactNode, useRef } from 'react';

// --- Variante de animación existente ---
const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

// --- NUEVA VARIANTE CLAVE: Con efecto de desenfoque (blur) ---
const fadeInUpBlurVariants: Variants = {
  hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

// --- Añadimos la nueva variante al tipo ---
type AnimationType = 'fadeInUp' | 'fadeInUpBlur' | 'fadeInLeft' | 'scaleIn';

interface ScrollRevealProps {
  children: ReactNode;
  animationType?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScrollReveal = ({
  children,
  animationType = 'fadeInUp', // Por defecto, usamos la nueva variante para el efecto mágico
  delay = 0,
  duration = 0.6,
  className = '',
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(ref);

  // Selecciona la variante de animación basada en la prop
  const variants = {
    fadeInUp: fadeInUpVariants,
    fadeInUpBlur: fadeInUpBlurVariants, // <-- Añadimos la nueva variante aquí
    fadeInLeft: fadeInLeftVariants,
    scaleIn: scaleInVariants,
  }[animationType];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
};
