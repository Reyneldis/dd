// src/contexts/SidebarContext.tsx
'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type SidebarView = 'mobile' | 'desktop';

interface SidebarContextType {
  isOpen: boolean;
  isCollapsed: boolean;
  view: SidebarView;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  setView: (view: SidebarView) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [view, setView] = useState<SidebarView>('desktop');

  // Función para toggle en móvil
  const toggleSidebar = () => {
    if (view === 'mobile') {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Función para colapsar en escritorio
  const collapseSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isCollapsed,
        view,
        toggleSidebar,
        collapseSidebar,
        setView,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
