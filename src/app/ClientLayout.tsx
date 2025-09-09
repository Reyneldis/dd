// src/components/ClientLayout.tsx
'use client';
import AnimatedBackground from '@/components/shared/AnimatedBackground';
import MinimalNavbar from '@/components/shared/MinimalNavbar';
import Navbar from '@/components/shared/Navbar/Navbar';
import { usePathname } from 'next/navigation';
import React from 'react';

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

  return (
    <>
      {showBackground && <AnimatedBackground />}
      {isAuthRoute ? <MinimalNavbar /> : <Navbar />}
      <main
        className={`relative z-10 min-h-screen bg-transparent ${
          !isAuthRoute ? 'pt-16' : 'pt-16' // Mantenemos el padding para ambos navbars
        }`}
      >
        {children}
      </main>
    </>
  );
}
