// src/components/ClientLayout.tsx - VERSIÓN MEJORADA
'use client';
import AnimatedBackground from '@/components/shared/AnimatedBackground';
import MinimalNavbar from '@/components/shared/MinimalNavbar';
import Navbar from '@/components/shared/Navbar/Navbar';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Rutas donde queremos mostrar el navbar minimalista
  const authRoutes = ['/sign-up', '/sign-in', '/login', '/admin'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Rutas donde queremos mostrar el fondo animado
  const backgroundRoutes = ['/']; // Solo en la página principal
  const showBackground = backgroundRoutes.includes(pathname) && !isAuthRoute;

  // Detectar si estamos en una ruta del dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Detectar si es un dispositivo móvil
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px es el breakpoint de Tailwind para md:
    };

    // Verificar al cargar la página
    checkIfMobile();

    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkIfMobile);

    // Limpiar el event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Determinar si debemos mostrar el navbar
  // No mostrar navbar si: (es ruta de dashboard Y es móvil) O (es ruta de autenticación)
  const shouldShowNavbar = !((isDashboardRoute && isMobile) || isAuthRoute);

  return (
    <>
      {showBackground && <AnimatedBackground />}

      {/* Mostrar navbar principal solo si debe mostrarse */}
      {shouldShowNavbar && <Navbar />}

      {/* Mostrar navbar minimalista solo si es ruta de autenticación */}
      {isAuthRoute && <MinimalNavbar />}

      <main
        className={`relative z-10 min-h-screen bg-transparent ${
          shouldShowNavbar || isAuthRoute ? 'pt-16' : 'pt-0' // Padding solo si hay navbar
        }`}
      >
        {children}
      </main>
    </>
  );
}
