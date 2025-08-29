'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

/**
 * Sincroniza el usuario Clerk con la base de datos Prisma al iniciar sesión.
 * Llama a /api/auth/sync-user (el backend obtiene los datos desde Clerk).
 */
export function useSyncUser() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;
    // Llama al endpoint para sincronizar usuario
    fetch('/api/auth/sync-user', { method: 'POST' });
  }, [isSignedIn]);
}
