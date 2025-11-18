// src/app/(routes)/debug/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DebugInfo, SyncCheckResult } from '@/types/clerk';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    clerkUser: null,
    dbUser: null,
    syncResult: null,
    forceSyncResult: null,
    connectionTest: null,
    error: null,
  });
  const [loading, setLoading] = useState(false);
  const { user: clerkUser, isSignedIn } = useUser();

  const runDiagnostics = async () => {
    setLoading(true);

    // Inicializar correctamente el objeto con tipos definidos
    const info: DebugInfo = {
      clerkUser: clerkUser
        ? {
            id: clerkUser.id,
            email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl,
          }
        : null,
      dbUser: null,
      syncResult: null,
      forceSyncResult: null,
      connectionTest: null,
      error: null,
    };

    try {
      // Test 1: Verificar conexión a BD
      const dbResponse = await fetch('/api/test-direct-connection');
      const dbData = await dbResponse.json();
      info.dbUser = dbData;

      // Test 2: Verificar sincronización
      if (isSignedIn && clerkUser) {
        const syncResponse = await fetch('/api/sync-user/check');
        const syncData: SyncCheckResult = await syncResponse.json();
        info.syncResult = syncData;
      }

      setDebugInfo(info);
    } catch (error) {
      setDebugInfo({
        ...info,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  const forceSync = async () => {
    if (!isSignedIn || !clerkUser) return;

    try {
      const syncData = {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        avatar: clerkUser.imageUrl || '',
      };

      const response = await fetch('/api/sync-user/force', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Usuario sincronizado correctamente');
        runDiagnostics(); // Recargar diagnósticos
      } else {
        alert('Error al sincronizar: ' + result.error);
      }
    } catch (error) {
      alert(
        'Error de conexión: ' +
          (error instanceof Error ? error.message : 'Error desconocido'),
      );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Página de Diagnóstico</h1>

      <div className="flex gap-4">
        <Button onClick={runDiagnostics} disabled={loading}>
          {loading ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
        </Button>

        {isSignedIn && (
          <Button onClick={forceSync} variant="outline">
            Forzar Sincronización
          </Button>
        )}
      </div>

      {/* Información de Clerk */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Autenticación (Clerk)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(debugInfo.clerkUser || null, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Información de la BD */}
      {debugInfo.dbUser && (
        <Card>
          <CardHeader>
            <CardTitle>Conexión a Base de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(debugInfo.dbUser, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Resultado de sincronización */}
      {debugInfo.syncResult && (
        <Card>
          <CardHeader>
            <CardTitle>Verificación de Sincronización</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(debugInfo.syncResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Resultado de sincronización forzada */}
      {debugInfo.forceSyncResult && (
        <Card>
          <CardHeader>
            <CardTitle>Sincronización Forzada</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(debugInfo.forceSyncResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Test de conexión */}
      {debugInfo.connectionTest && (
        <Card>
          <CardHeader>
            <CardTitle>Test de Conexión Directa</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(debugInfo.connectionTest, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Errores */}
      {debugInfo.error && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-red-600 bg-red-50 p-4 rounded">
              {debugInfo.error}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
