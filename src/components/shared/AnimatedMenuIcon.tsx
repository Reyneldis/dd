// src/components/shared/AnimatedMenuIcon.tsx
'use client';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface AnimatedMenuIconProps {
  isOpen: boolean;
  onClick: () => void;
  isScrolled: boolean;
}

export default function AnimatedMenuIcon({
  isOpen,
  onClick,
  isScrolled,
}: AnimatedMenuIconProps) {
  const { theme } = useTheme();

  // Define el color de las líneas del icono según el estado
  const lineColor = isScrolled
    ? theme === 'dark'
      ? 'bg-neutral-800'
      : 'bg-neutral-900'
    : theme === 'dark'
    ? 'bg-neutral-200'
    : 'bg-neutral-700';

  return (
    <button
      onClick={onClick}
      className="relative w-6 h-5 flex flex-col justify-between items-center lg:hidden group"
      aria-label="Abrir menú"
    >
      {/* Línea superior */}
      <motion.span
        className={`h-0.5 w-full origin-left transition-colors duration-300 ${lineColor}`}
        animate={{
          rotate: isOpen ? 45 : 0,
          translateY: isOpen ? 5.5 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
      {/* Línea central */}
      <motion.span
        className={`h-0.5 w-full transition-colors duration-300 ${lineColor}`}
        animate={{
          opacity: isOpen ? 0 : 1,
          translateX: isOpen ? -20 : 0, // Se desliza hacia la izquierda
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
      {/* Línea inferior */}
      <motion.span
        className={`h-0.5 w-full origin-left transition-colors duration-300 ${lineColor}`}
        animate={{
          rotate: isOpen ? -45 : 0,
          translateY: isOpen ? -5.5 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </button>
  );
}
