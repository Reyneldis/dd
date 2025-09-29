// hooks/use-cart-modal.ts
'use client';

import type { ProductFull } from '@/types/product';
import { useCallback, useState } from 'react';

interface CartModalState {
  isOpen: boolean;
  productToAdd: ProductFull | null;
}

// Estado global del modal
let globalCartModalState: CartModalState = {
  isOpen: false,
  productToAdd: null,
};

// Observadores globales para cambios en el estado
const observers: Array<(state: CartModalState) => void> = [];

// Función para notificar a todos los observadores
function notifyObservers() {
  observers.forEach(callback => callback(globalCartModalState));
}

export function useCartModal() {
  const [, forceUpdate] = useState({});

  const openCartModal = useCallback((product?: ProductFull) => {
    globalCartModalState = {
      isOpen: true,
      productToAdd: product || null,
    };
    notifyObservers();
  }, []);

  const closeCartModal = useCallback(() => {
    globalCartModalState = {
      isOpen: false,
      productToAdd: null,
    };
    notifyObservers();
  }, []);

  // Suscribirse a los cambios y forzar actualización
  useState(() => {
    const handleStateChange = (state: CartModalState) => {
      forceUpdate(state);
    };

    observers.push(handleStateChange);

    return () => {
      const index = observers.indexOf(handleStateChange);
      if (index > -1) {
        observers.splice(index, 1);
      }
    };
  });

  return {
    isOpen: globalCartModalState.isOpen,
    openCartModal,
    closeCartModal,
    productToAdd: globalCartModalState.productToAdd,
  };
}

// Hook para obtener el estado actual sin suscripción
export function useCartModalState() {
  return globalCartModalState;
}
