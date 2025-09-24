'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerEmail?: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  contactInfo?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    orderId: string;
  };
  shippingAddress?: {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    createdAt: string;
    updatedAt: string;
    orderId: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    total: number;
    product: {
      id: string;
      productName: string;
      slug: string;
    };
  }>;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Envolver fetchOrderDetails en useCallback
  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Error al cargar los detalles de la orden');
      }
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los detalles de la orden');
    } finally {
      setLoading(false);
    }
  }, [orderId]); // Añadir dependencia

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]); // Añadir dependencia

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color:
            'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          icon: Clock,
          label: 'Pendiente',
        };
      case 'CONFIRMED':
        return {
          color:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          icon: CheckCircle,
          label: 'Confirmado',
        };
      case 'PROCESSING':
        return {
          color:
            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
          icon: Package,
          label: 'Procesando',
        };
      case 'SHIPPED':
        return {
          color:
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
          icon: Truck,
          label: 'Enviado',
        };
      case 'DELIVERED':
        return {
          color:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
          icon: CheckCircle,
          label: 'Entregado',
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          icon: XCircle,
          label: 'Cancelado',
        };
      case 'REFUNDED':
        return {
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
          icon: AlertCircle,
          label: 'Reembolsado',
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
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Orden no encontrada
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          La orden que buscas no existe o ha sido eliminada.
        </p>
        <Button asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Órdenes
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
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Órdenes
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Detalles de la Orden
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Información de la Orden</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ID</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Número de Orden
                  </p>
                  <p className="font-medium">{order.orderNumber}</p>
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
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email del Cliente
                  </p>
                  <p className="font-medium">
                    {order.customerEmail ||
                      order.contactInfo?.email ||
                      'No disponible'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fecha y Hora
                </p>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Subtotal
                  </p>
                  <p className="font-medium">${order.subtotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Impuestos
                  </p>
                  <p className="font-medium">${order.taxAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Envío
                  </p>
                  <p className="font-medium">
                    ${order.shippingAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </p>
                <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Productos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <p className="font-medium">{item.product.productName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">${item.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              {order.contactInfo ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nombre
                    </p>
                    <p className="font-medium">{order.contactInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium">{order.contactInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Teléfono
                    </p>
                    <p className="font-medium">{order.contactInfo.phone}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No hay información de contacto disponible
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
            <CardHeader>
              <CardTitle>Dirección de Envío</CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingAddress ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Calle
                    </p>
                    <p className="font-medium">
                      {order.shippingAddress.street}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ciudad
                    </p>
                    <p className="font-medium">{order.shippingAddress.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Estado
                    </p>
                    <p className="font-medium">{order.shippingAddress.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Código Postal
                    </p>
                    <p className="font-medium">{order.shippingAddress.zip}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      País
                    </p>
                    <p className="font-medium">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No hay dirección de envío disponible
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
