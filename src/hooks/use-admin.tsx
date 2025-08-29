'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export function useAdmin() {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (isLoaded && user) {
        try {
          const res = await fetch(`/api/get-user?clerkId=${user.id}`);
          if (!res.ok) throw new Error('No autorizado');
          const dbUser = await res.json();
          setIsAdmin(dbUser.role === 'ADMIN');
        } catch {
          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      }
    };
    checkAdmin();
  }, [isLoaded, user]);

  return {
    isAdmin,
    loading,
    user,
  };
}
