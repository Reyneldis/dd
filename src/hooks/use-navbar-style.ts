// src/hooks/use-navbar-style.ts
import { usePathname } from 'next/navigation';

// Define la estructura del estilo para type safety
interface NavbarStyle {
  bg: string;
  border: string;
}

export function useNavbarStyle(): NavbarStyle {
  const pathname = usePathname();

  // Define los estilos con colores más suaves y claros para cada ruta
  const navbarStyles: Record<string, NavbarStyle> = {
    '/': {
      bg: 'bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/40 dark:to-indigo-900/40',
      border: 'border-blue-200/50 dark:border-blue-800/30',
    },
    '/products': {
      bg: 'bg-gradient-to-r from-emerald-100/80 to-teal-100/80 dark:from-emerald-900/40 dark:to-teal-900/40',
      border: 'border-emerald-200/50 dark:border-emerald-800/30',
    },
    '/about': {
      bg: 'bg-gradient-to-r from-amber-100/80 to-orange-100/80 dark:from-amber-900/40 dark:to-orange-900/40',
      border: 'border-amber-200/50 dark:border-amber-800/30',
    },
    '/contact': {
      bg: 'bg-gradient-to-r from-rose-100/80 to-pink-100/80 dark:from-rose-900/40 dark:to-pink-900/40',
      border: 'border-rose-200/50 dark:border-rose-800/30',
    },
    // Ejemplo para páginas de producto dinámicas (ej: /product/tu-producto)
    '/product/': {
      bg: 'bg-gradient-to-r from-slate-100/80 to-gray-100/80 dark:from-slate-800/40 dark:to-gray-800/40',
      border: 'border-slate-200/50 dark:border-slate-700/30',
    },
    // Panel de usuario y pedidos
    '/orders': {
      bg: 'bg-gradient-to-r from-orange-100/80 to-red-100/80 dark:from-orange-900/40 dark:to-red-900/40',
      border: 'border-orange-200/50 dark:border-orange-800/30',
    },
    '/account': {
      bg: 'bg-gradient-to-r from-indigo-100/80 to-blue-100/80 dark:from-indigo-900/40 dark:to-blue-900/40',
      border: 'border-indigo-200/50 dark:border-indigo-800/30',
    },
    // Dashboard de administrador
    '/dashboard': {
      bg: 'bg-gradient-to-r from-gray-100/80 to-slate-100/80 dark:from-gray-800/40 dark:to-slate-800/40',
      border: 'border-gray-200/50 dark:border-gray-700/30',
    },
    // Categorías específicas
    '/category/aseo': {
      bg: 'bg-gradient-to-r from-cyan-100/80 to-sky-100/80 dark:from-cyan-900/40 dark:to-sky-900/40',
      border: 'border-cyan-200/50 dark:border-cyan-800/30',
    },
    '/category/comida': {
      bg: 'bg-gradient-to-r from-lime-100/80 to-green-100/80 dark:from-lime-900/40 dark:to-green-900/40',
      border: 'border-lime-200/50 dark:border-lime-800/30',
    },
    '/category/electrodomesticos': {
      bg: 'bg-gradient-to-r from-violet-100/80 to-purple-100/80 dark:from-violet-900/40 dark:to-purple-900/40',
      border: 'border-violet-200/50 dark:border-violet-800/30',
    },
  };

  // 1. Busca una coincidencia exacta primero
  if (navbarStyles[pathname]) {
    return navbarStyles[pathname];
  }

  // 2. Si no hay coincidencia exacta, busca una coincidencia parcial para rutas dinámicas
  // (ej. '/products/some-product' coincidirá con '/products')
  for (const route of Object.keys(navbarStyles)) {
    // Aseguramos que solo coincidan las rutas que no son la raíz para evitar conflictos
    if (route !== '/' && pathname.startsWith(route)) {
      return navbarStyles[route];
    }
  }

  // 3. Estilo por defecto si ninguna ruta coincide
  return {
    bg: 'bg-white/80 dark:bg-neutral-900/60',
    border: 'border-white/30 dark:border-neutral-800/30',
  };
}
