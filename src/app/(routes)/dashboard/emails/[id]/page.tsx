'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Mail,
  Package,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react'; // Importar useCallback
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

export default function EmailDetailPage() {
  const params = useParams();
  const emailId = params.id as string;

  const [email, setEmail] = useState<FailedEmail | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  // Corregir: envolver fetchEmailDetail en useCallback
  const fetchEmailDetail = useCallback(async () => {
    try {
      setLoading(true);
      // Obtenemos todos los emails y filtramos por ID
      const response = await fetch('/api/dashboard/emails/failed');
      if (response.ok) {
        const emails = await response.json();
        const foundEmail = emails.find((e: FailedEmail) => e.id === emailId);
        setEmail(foundEmail || null);
      } else {
        toast.error('Error al cargar los detalles del email');
      }
    } catch (error) {
      console.error('Error fetching email detail:', error);
      toast.error('Error al cargar los detalles del email');
    } finally {
      setLoading(false);
    }
  }, [emailId]); // Añadir dependencia

  useEffect(() => {
    fetchEmailDetail();
  }, [fetchEmailDetail]); // Añadir dependencia

  const retryEmail = async () => {
    if (!email) return;

    try {
      setRetrying(true);
      const response = await fetch(`/api/dashboard/emails/failed/${email.id}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Email marcado para reintento');
        fetchEmailDetail();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al reintentar el email');
      }
    } catch (error) {
      console.error('Error retrying email:', error);
      toast.error('Error al reintentar el email');
    } finally {
      setRetrying(false);
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
            Cargando detalles del email...
          </p>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Email no encontrado
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          El email que buscas no existe o ha sido eliminado.
        </p>
        <Button asChild>
          <Link href="/dashboard/emails">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Emails
          </Link>
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(email.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/emails">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Emails
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Detalles del Email
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Información del Email</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ID</p>
                  <p className="font-medium">{email.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tipo
                  </p>
                  <p className="font-medium">
                    {email.type === 'STATUS_UPDATE'
                      ? 'Actualización de Estado'
                      : email.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Destinatario
                  </p>
                  <p className="font-medium">{email.recipient}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estado
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fecha y Hora
                </p>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="font-medium">
                    {new Date(email.timestamp).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {email.error && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Error
                  </p>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                    <p className="text-sm text-red-800 dark:text-red-300">
                      {email.error}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Información del Pedido</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID del Pedido
                  </p>
                  <p className="font-medium">{email.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Número de Pedido
                  </p>
                  <p className="font-medium">
                    {email.order?.orderNumber || 'No disponible'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {email.status === 'failed' && (
                <Button
                  onClick={retryEmail}
                  disabled={retrying}
                  className="w-full"
                >
                  {retrying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Reintentando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reintentar Envío
                    </>
                  )}
                </Button>
              )}
              <Button variant="outline" asChild className="w-full">
                <Link href={`/dashboard/orders/${email.orderId}`}>
                  Ver Pedido
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <CardHeader>
              <CardTitle>Información de Reintento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Intentos
                  </p>
                  <p className="font-medium">{email.attempt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estado
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
