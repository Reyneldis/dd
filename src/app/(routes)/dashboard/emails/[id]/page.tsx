// src/app/(routes)/dashboard/emails/[id]/page.tsx - VERSIÓN CORREGIDA
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FailedEmail } from '@/types';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Package,
  RefreshCw,
  Send,
  Trash2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EmailDetailPage() {
  const params = useParams();
  const emailId = params.id as string;

  const [email, setEmail] = useState<FailedEmail | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchEmailDetail = useCallback(async () => {
    try {
      setLoading(true);
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
  }, [emailId]);

  useEffect(() => {
    fetchEmailDetail();
  }, [fetchEmailDetail]);

  const retryEmail = async () => {
    if (!email) return;

    setRetrying(true);
    try {
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

  const deleteEmail = async () => {
    if (!email) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/dashboard/emails/failed/${email.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Email eliminado correctamente');
        window.location.href = '/dashboard/emails';
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al eliminar el email');
      }
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error('Error al eliminar el email');
    } finally {
      setDeleting(false);
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
          description: 'El email fue enviado exitosamente',
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          icon: XCircle,
          label: 'Fallido',
          description: 'El email no pudo ser enviado',
        };
      case 'retry':
        return {
          color:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
          icon: RefreshCw,
          label: 'Reintentando',
          description: 'El email está siendo reintentado',
        };
      case 'pending':
        return {
          color:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          icon: Clock,
          label: 'Pendiente',
          description: 'El email está en cola para ser enviado',
        };
      default:
        return {
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
          icon: AlertCircle,
          label: status,
          description: 'Estado desconocido',
        };
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'ORDER_CONFIRMATION':
        return {
          label: 'Confirmación de Pedido',
          icon: Package,
          description:
            'Email enviado cuando un cliente realiza un nuevo pedido',
        };
      case 'STATUS_UPDATE':
        return {
          label: 'Actualización de Estado',
          icon: RefreshCw,
          description: 'Email enviado cuando el estado de un pedido cambia',
        };
      default:
        return {
          label: type,
          icon: Mail,
          description: 'Tipo de email desconocido',
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
  const typeInfo = getTypeInfo(email.type);
  const TypeIcon = typeInfo.icon;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
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
        <div className="flex space-x-2">
          {email.status === 'failed' && (
            <Button
              onClick={retryEmail}
              disabled={retrying}
              className="bg-blue-600 hover:bg-blue-700"
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleting}>
                {deleting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente este email del
                  historial. Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={deleteEmail}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Información del Email</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    ID del Email
                  </p>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-mono text-sm">{email.id}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Tipo de Email
                  </p>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{typeInfo.label}</p>
                      <p className="text-xs text-gray-500">
                        {typeInfo.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Destinatario
                  </p>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-medium">{email.recipient}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Estado
                  </p>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={`p-2 rounded-lg ${statusInfo.color}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{statusInfo.label}</p>
                      <p className="text-xs text-gray-500">
                        {statusInfo.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Fecha y Hora
                </p>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">
                      {new Date(email.timestamp).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(email.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {email.error && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Error
                    </p>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-red-800 dark:text-red-300 font-mono">
                            {email.error}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Información del Pedido</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    ID del Pedido
                  </p>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-mono text-sm">{email.orderId}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Número de Pedido
                  </p>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {email.order?.orderNumber ? (
                      <Link
                        href={`/dashboard/orders/${email.orderId}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        #{email.order.orderNumber}
                      </Link>
                    ) : (
                      <p className="text-gray-500">No disponible</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
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
                  <Package className="h-4 w-4 mr-2" />
                  Ver Pedido
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href={`mailto:${email.recipient}`}>
                  <Send className="h-4 w-4 mr-2" />
                  Contactar Cliente
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Información de Reintento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Intentos Realizados
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {email.attempts}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {email.attempts === 1 ? 'intento' : 'intentos'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Estado Actual
                </p>
                <div className="mt-1">
                  <Badge className={statusInfo.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Próxima Acción
                </p>
                <div className="mt-1">
                  {email.status === 'failed' ? (
                    <p className="text-sm text-blue-600">
                      Puede reintentar el envío manualmente
                    </p>
                  ) : email.status === 'retry' ? (
                    <p className="text-sm text-yellow-600">
                      El sistema está reintentando enviar
                    </p>
                  ) : email.status === 'sent' ? (
                    <p className="text-sm text-green-600">
                      Email enviado exitosamente
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">Esperando acción</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Información Técnica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ID Único
                </p>
                <p className="text-xs font-mono text-gray-500 mt-1 break-all">
                  {email.id}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Timestamp
                </p>
                <p className="text-xs font-mono text-gray-500 mt-1">
                  {new Date(email.timestamp).toISOString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tipo de Registro
                </p>
                <p className="text-xs text-gray-500 mt-1">Métrica de Email</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
