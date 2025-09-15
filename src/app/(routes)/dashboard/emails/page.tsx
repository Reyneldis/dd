// src/app/(routes)/dashboard/emails/page.tsx - Gestión de emails fallidos
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertCircle,
  CheckCircle,
  Mail,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface FailedEmail {
  id: string;
  timestamp: string;
  type: string;
  recipient: string;
  orderId: string;
  status: string;
  attempt: number;
  error: string;
  order?: {
    orderNumber: string;
  };
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<FailedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);

  useEffect(() => {
    fetchFailedEmails();
  }, []);

  const fetchFailedEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/emails');
      if (response.ok) {
        const data = await response.json();
        setEmails(data);
      } else {
        toast.error('Error al cargar los emails fallidos');
      }
    } catch (error) {
      console.error('Error fetching failed emails:', error);
      toast.error('Error al cargar los emails fallidos');
    } finally {
      setLoading(false);
    }
  };

  const retryEmail = async (emailId: string) => {
    try {
      setRetrying(emailId);
      const response = await fetch(`/api/dashboard/emails/${emailId}/retry`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Email marcado para reintento');
        // Refrescar la lista
        fetchFailedEmails();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al reintentar el email');
      }
    } catch (error) {
      console.error('Error retrying email:', error);
      toast.error('Error al reintentar el email');
    } finally {
      setRetrying(null);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'sent':
        return {
          color:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
          icon: CheckCircle,
          label: 'Enviado',
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          icon: XCircle,
          label: 'Fallido',
        };
      case 'retry':
        return {
          color:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
          icon: RefreshCw,
          label: 'Reintentando',
        };
      default:
        return {
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
          icon: AlertCircle,
          label: status,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Cargando emails fallidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Emails
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitorea y gestiona los emails de notificación de pedidos
          </p>
        </div>
        <Button onClick={fetchFailedEmails} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Emails
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emails.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Emails Fallidos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emails.filter(e => e.status === 'failed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Emails Enviados
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emails.filter(e => e.status === 'sent').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de emails */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Historial de Emails
        </h2>
        {emails.length > 0 ? (
          <div className="space-y-4">
            {emails.map(email => {
              const statusInfo = getStatusInfo(email.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={email.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.color}`}
                    >
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {email.type === 'STATUS_UPDATE'
                          ? 'Actualización de Estado'
                          : email.type}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Para: {email.recipient}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Orden: {email.order?.orderNumber || email.orderId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(email.timestamp).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                    {email.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryEmail(email.id)}
                        disabled={retrying === email.id}
                      >
                        {retrying === email.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Reintentar'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay emails registrados
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Los emails de notificación aparecerán aquí cuando se envíen.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
