// src/components/ClientLayout.tsx
'use client';
import AnimatedBackground from '@/components/shared/AnimatedBackground';
import MinimalNavbar from '@/components/shared/MinimalNavbar';
import Navbar from '@/components/shared/Navbar/Navbar';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Si usas GSAP, importa y registra los plugins
import { gsap } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';

// Registra los plugins de GSAP
gsap.registerPlugin(CSSPlugin);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const authRoutes = ['/sign-up', '/sign-in', '/login', '/admin'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const backgroundRoutes = ['/'];
  const showBackground = backgroundRoutes.includes(pathname) && !isAuthRoute;
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const shouldShowNavbar = !((isDashboardRoute && isMobile) || isAuthRoute);

  return (
    <>
      {showBackground && <AnimatedBackground />}
      {shouldShowNavbar && <Navbar />}
      {isAuthRoute && <MinimalNavbar />}

      {/* --- CAMBIO CLAVE: El main es transparente --- */}
      <main
        className={`relative z-10 min-h-screen bg-transparent ${
          shouldShowNavbar || isAuthRoute ? 'pt-16' : 'pt-0'
        }`}
      >
        {children}
      </main>
    </>
  );
}
