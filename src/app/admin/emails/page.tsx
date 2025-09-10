// src/app/admin/emails/page.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { requireAdminAuth } from '@/lib/auth'; // Usar la función específica para administradores
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getEmailMetrics() {
  const metrics = await prisma.emailMetrics.findMany({
    orderBy: { timestamp: 'desc' },
    take: 50, // Limitar a los 50 más recientes
    include: {
      order: {
        select: {
          orderNumber: true,
          total: true,
        },
      },
    },
  });
  return metrics;
}

export default async function EmailsPage() {
  await requireAdminAuth(); // Verificar que sea administrador
  const metrics = await getEmailMetrics();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Métricas de Correo</h1>
        <Button asChild>
          <Link href="/admin">Volver al Panel</Link>
        </Button>
      </div>
      <div className="grid gap-6">
        {metrics.map(metric => (
          <Card key={metric.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {metric.type === 'ORDER_CONFIRMATION'
                      ? 'Confirmación de Pedido'
                      : metric.type}
                  </CardTitle>
                  <CardDescription>
                    Pedido:{' '}
                    {metric.order?.orderNumber || metric.orderId.slice(-6)}
                  </CardDescription>
                </div>
                <Badge
                  variant={metric.status === 'sent' ? 'default' : 'destructive'}
                >
                  {metric.status === 'sent' ? 'Enviado' : 'Fallido'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Destinatario:</span>
                  <span>{metric.recipient}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Intentos:</span>
                  <span>{metric.attempt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span>{metric.timestamp.toLocaleString()}</span>
                </div>
                {metric.error && (
                  <div className="mt-2 p-3 bg-red-50 rounded-md">
                    <p className="text-sm font-medium text-red-800">Error:</p>
                    <p className="text-sm text-red-600">{metric.error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {metrics.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No hay métricas de correo disponibles.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
