// src/app/(routes)/dashboard/orders/[id]/page.tsx - Detalles de orden específica
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  customerEmail?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
    product: {
      id: string;
      slug: string;
      images: Array<{
        url: string;
        alt?: string;
      }>;
    };
  }>;
}

interface OrderHistoryItem {
  id: string;
  type: string;
  status: string;
  timestamp: string;
  description: string;
  success: boolean;
  error?: string;
}

const ORDER_STATUSES = [
  {
    value: 'PENDING',
    label: 'Pendiente',
    color:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  },
  {
    value: 'CONFIRMED',
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  {
    value: 'PROCESSING',
    label: 'Procesando',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  },
  {
    value: 'SHIPPED',
    label: 'Enviado',
    color:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  },
  {
    value: 'DELIVERED',
    label: 'Entregado',
    color:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  {
    value: 'CANCELLED',
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
  {
    value: 'REFUNDED',
    label: 'Reembolsado',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  },
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(params.id as string);
      fetchOrderHistory(params.id as string);
    }
  }, [params.id]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        toast.error('Error al cargar los detalles de la orden');
        router.push('/dashboard/orders');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Error al cargar los detalles de la orden');
      router.push('/dashboard/orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async (orderId: string) => {
    try {
      setLoadingHistory(true);
      const response = await fetch(`/api/dashboard/orders/${orderId}/history`);
      if (response.ok) {
        const data = await response.json();
        setOrderHistory(data.history || []);
      } else {
        console.error('Error fetching order history');
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      setUpdatingStatus(true);

      const response = await fetch(`/api/dashboard/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrder(prev => (prev ? { ...prev, status: newStatus } : null));
        // Refrescar el historial después de actualizar el estado
        fetchOrderHistory(order.id);
        toast.success(
          `Estado actualizado a ${getStatusLabel(
            newStatus,
          )}. Notificación enviada al cliente.`,
          {
            description:
              'El cliente recibirá un email con la actualización del estado de su pedido.',
            duration: 5000,
          },
        );
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al actualizar el estado', {
          description:
            'Por favor, intenta nuevamente o contacta al administrador.',
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error al actualizar el estado', {
        description: 'Verifica tu conexión a internet e intenta nuevamente.',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusConfig = ORDER_STATUSES.find(s => s.value === status);
    if (!statusConfig) {
      return {
        text: status,
        color:
          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        icon: Clock,
      };
    }

    let icon = Clock;
    switch (status) {
      case 'PENDING':
        icon = Clock;
        break;
      case 'CONFIRMED':
        icon = CheckCircle;
        break;
      case 'PROCESSING':
        icon = Package;
        break;
      case 'SHIPPED':
        icon = Truck;
        break;
      case 'DELIVERED':
        icon = CheckCircle;
        break;
      case 'CANCELLED':
        icon = XCircle;
        break;
    }

    return {
      text: statusConfig.label,
      color: statusConfig.color,
      icon,
    };
  };

  const getStatusLabel = (status: string) => {
    const statusConfig = ORDER_STATUSES.find(s => s.value === status);
    return statusConfig?.label || status;
  };

  const getOrderProgress = (currentStatus: string, targetStatus: string) => {
    const statusOrder = [
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);
    const targetIndex = statusOrder.indexOf(targetStatus);

    return currentIndex >= targetIndex;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Cargando detalles de la orden...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Orden no encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          La orden que buscas no existe o ha sido eliminada.
        </p>
        <Button asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a las órdenes
          </Link>
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Orden #{order.orderNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Creada el{' '}
              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Badge className={`${statusInfo.color} text-sm px-3 py-1`}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {statusInfo.text}
          </Badge>
          {updatingStatus && (
            <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Actualizando...</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Productos */}
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Productos ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    {item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.images[0].alt || item.productName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${item.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Información de contacto */}
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Información de Contacto
            </h2>
            <div className="space-y-4">
              {order.contactInfo && (
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.contactInfo.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cliente
                    </p>
                  </div>
                </div>
              )}

              {(order.customerEmail ||
                order.contactInfo?.email ||
                order.user?.email) && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.customerEmail ||
                        order.contactInfo?.email ||
                        order.user?.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                  </div>
                </div>
              )}

              {order.contactInfo?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.contactInfo.phone}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Teléfono
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Dirección de envío */}
          {order.shippingAddress && (
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Dirección de Envío
              </h2>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-900 dark:text-white">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zip}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Progreso del pedido */}
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Progreso del Pedido
            </h2>
            <div className="space-y-3">
              {[
                'PENDING',
                'CONFIRMED',
                'PROCESSING',
                'SHIPPED',
                'DELIVERED',
              ].map((status, index) => {
                const isCompleted = getOrderProgress(order.status, status);
                const isCurrent = order.status === status;
                const statusConfig = ORDER_STATUSES.find(
                  s => s.value === status,
                );

                return (
                  <div key={status} className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          isCompleted || isCurrent
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {statusConfig?.label || status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Cambiar estado */}
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Cambiar Estado
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado actual
                </label>
                <Badge className={`${statusInfo.color} text-sm px-3 py-1`}>
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {statusInfo.text}
                </Badge>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nuevo estado
                </label>
                <Select
                  value={order.status}
                  onValueChange={updateOrderStatus}
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {updatingStatus && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Actualizando estado...</span>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <p className="font-medium">Notificación automática</p>
                    <p>
                      El cliente recibirá un email con la actualización del
                      estado de su pedido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Resumen de la orden */}
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Resumen
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="text-gray-900 dark:text-white">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              {order.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Impuestos
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    ${order.taxAmount.toFixed(2)}
                  </span>
                </div>
              )}
              {order.shippingAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Envío
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    ${order.shippingAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Historial de la orden */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Historial de la Orden
        </h2>
        {loadingHistory ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin mr-2" />
            <span className="text-gray-600 dark:text-gray-400">
              Cargando historial...
            </span>
          </div>
        ) : orderHistory.length > 0 ? (
          <div className="space-y-4">
            {orderHistory.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.success
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {item.success ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {item.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Error: {item.error}
                    </p>
                  )}
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        item.success
                          ? 'border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300'
                          : 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-300'
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No hay historial disponible para esta orden.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
