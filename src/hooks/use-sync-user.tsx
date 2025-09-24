// // src/hooks/use-sync-user.ts
'use client';

import { syncUserSchema } from '@/schemas/syncUserSchema';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export function useSyncUser() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!isSignedIn || !user) return;

      try {
        const userData = {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          avatar: user.imageUrl || '',
        };

        // Validar datos antes de enviar
        const validatedData = syncUserSchema.parse(userData);

        await fetch('/api/sync-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validatedData),
        });
      } catch (error) {
        console.error('Error sincronizando usuario:', error);
      }
    };

    syncUser();
  }, [isSignedIn, user]);
}
