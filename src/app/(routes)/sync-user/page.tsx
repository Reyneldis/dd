// src/app/(routes)/sync-user/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { toast } from 'sonner';

interface SyncUserData {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export default function SyncUserPage() {
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user } = useUser();

  const handleSync = async () => {
    if (!isSignedIn || !user) {
      toast.error('Debes estar autenticado para sincronizar');
      return;
    }

    setLoading(true);
    try {
      const syncData: SyncUserData = {
        clerkId: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        avatar: user.imageUrl || '',
      };

      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(syncData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Usuario sincronizado correctamente');
      } else {
        toast.error(result.error || 'Error al sincronizar');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Error de conexión al sincronizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sincronización de Usuario</CardTitle>
          <CardDescription>
            Si experimentas problemas con tu cuenta, sincroniza tus datos aquí.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSignedIn ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Usuario actual: {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-600">
                Email: {user?.emailAddresses?.[0]?.emailAddress}
              </p>
              <Button
                onClick={handleSync}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Sincronizando...' : 'Sincronizar Usuario'}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Debes iniciar sesión para sincronizar tu usuario.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
