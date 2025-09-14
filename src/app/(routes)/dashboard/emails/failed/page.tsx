// @ts-nocheck
// src/app/(routes)/dashboard/emails/failed/page.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

type EmailMetric = {
  id: string;
  type: string;
  recipient: string;
  orderId: string;
  status: 'sent' | 'failed' | 'retry';
  attempt: number;
  error?: string | null;
  timestamp: string;
};

export default function FailedEmailsPage() {
  const [metrics, setMetrics] = useState<EmailMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/email/failed');
    if (res.ok) {
      const data = await res.json();
      setMetrics(data.metrics || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emails Fallidos</h1>
        <Button variant="outline" size="sm" onClick={load}>
          Recargar
        </Button>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-500">Cargando...</div>
      ) : metrics.length === 0 ? (
        <Card className="p-6 text-sm text-gray-500">No hay emails fallidos</Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((m: EmailMetric) => (
            <Card key={m.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{m.type}</div>
                {(() => {
                  const v: 'destructive' | 'secondary' =
                    m.status === 'failed' ? 'destructive' : 'secondary';
                  return <Badge variant={v}>{m.status}</Badge>;
                })()}
              </div>
              <div className="text-sm text-gray-600">Para: {m.recipient}</div>
              <div className="text-sm text-gray-600">Pedido: {m.orderId}</div>
              <div className="text-xs text-gray-500">Intento: {m.attempt}</div>
              {m.error && (
                <div className="text-xs text-red-600 break-words">{m.error}</div>
              )}
              <div className="text-xs text-gray-500">
                {new Date(m.timestamp).toLocaleString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

