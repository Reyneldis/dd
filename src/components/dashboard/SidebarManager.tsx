// src/components/dashboard/SidebarManager.tsx
'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { useEffect } from 'react';

export function SidebarManager() {
  const { setView } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      setView(window.innerWidth < 1024 ? 'mobile' : 'desktop');
    };

    handleResize(); // Establecer la vista inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setView]);

  // Este componente no renderiza nada visualmente,
  // solo se encarga de la lógica del sidebar.
  return null;
}
