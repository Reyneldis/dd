// src/components/SyncUserToDatabase.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export function SyncUserToDatabase({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, user } = useUser();

  useEffect(() => {
    // Solo sincronizar si el usuario está cargado y ha iniciado sesión
    if (isLoaded && user) {
      // Llamar a nuestra API de sincronización
      fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      }).catch(error => {
        console.error('Failed to sync user to database:', error);
      });
    }
  }, [isLoaded, user]);

  return <>{children}</>;
}
