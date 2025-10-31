// src/hooks/use-stock-update.ts
'use client';
import { stockUpdateEmitter } from '@/lib/events';
import { useEffect } from 'react';

/**
 * Hook que escucha los eventos de actualización de stock y ejecuta una función de callback.
 * @param onUpdate - La función que se ejecutará cuando el stock se actualice.
 */
export function useStockUpdate(onUpdate: () => void) {
  useEffect(() => {
    // Función que se ejecutará cuando se dispare el evento
    const handleUpdate = () => {
      console.log('Evento de actualización de stock recibido.');
      onUpdate();
    };

    // Añadimos el event listener
    stockUpdateEmitter.addEventListener('update', handleUpdate);

    // Limpiamos el event listener cuando el componente se desmonte
    return () => {
      stockUpdateEmitter.removeEventListener('update', handleUpdate);
    };
  }, [onUpdate]); // La dependencia es la función de callback
}
