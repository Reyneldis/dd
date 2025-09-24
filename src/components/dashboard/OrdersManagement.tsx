'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { OrderStatus } from '@prisma/client';
import {
  CheckCircle,
  Clock,
  Eye,
  Package,
  RefreshCw,
  Search,
  Truck,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface OrderFromAPI {
  id: string;
  orderNumber: string;
  contactInfo?: { name: string; email: string; phone: string };
  user?: { firstName: string; lastName: string; email: string };
  customerEmail?: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{ productName: string; quantity: number; price: number }>;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

interface OrdersManagementProps {
  initialOrders?: Order[];
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

export function OrdersManagement({
  initialOrders = [],
}: OrdersManagementProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Envolver fetchOrders en useCallback
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching orders from API...');

      const response = await fetch('/api/dashboard/orders');
      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Raw API response:', data);

        // La API devuelve { data: orders[], pagination: {...} }
        const ordersData = data.data || [];
        console.log('📋 Orders data:', ordersData);

        // Transformar los datos para que coincidan con la interfaz Order
        const transformedOrders: Order[] = ordersData.map(
          (order: OrderFromAPI) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customerName:
              order.contactInfo?.name ||
              order.user?.firstName ||
              'Cliente sin nombre',
            customerEmail:
              order.customerEmail ||
              order.contactInfo?.email ||
              order.user?.email,
            total: order.total,
            status: order.status as OrderStatus,
            createdAt: order.createdAt,
            items: order.items || [],
          }),
        );

        console.log('✨ Transformed orders:', transformedOrders);
        setOrders(transformedOrders);

        if (transformedOrders.length === 0) {
          console.log('⚠️ No orders found in database');
        }
      } else {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        toast.error(
          `Error al cargar las órdenes: ${
            errorData.error || 'Error desconocido'
          }`,
        );
      }
    } catch (error) {
      console.error('💥 Error fetching orders:', error);
      toast.error('Error de conexión al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  }, []); // Sin dependencias porque no usa estado o props directamente

  useEffect(() => {
    console.log('🚀 OrdersManagement mounted, initialOrders:', initialOrders);
    if (initialOrders.length === 0) {
      console.log('📞 Calling fetchOrders...');
      fetchOrders();
    } else {
      console.log('📋 Using initial orders:', initialOrders);
      setOrders(initialOrders);
    }
  }, [initialOrders, fetchOrders]); // Añadir fetchOrders como dependencia

  // Corregir el tipo de newStatus
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingStatus(orderId);

      const response = await fetch(`/api/dashboard/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const _result = await response.json();

        // Actualizar el estado local
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order,
          ),
        );

        toast.success(
          `Estado actualizado a ${getStatusLabel(
            newStatus,
          )}. Notificación enviada al cliente.`,
        );
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusInfo = (status: OrderStatus) => {
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

  const getStatusLabel = (status: OrderStatus) => {
    const statusConfig = ORDER_STATUSES.find(s => s.value === status);
    return statusConfig?.label || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  console.log(
    '📊 Current state - orders:',
    orders.length,
    'filteredOrders:',
    filteredOrders.length,
  );

  if (loading) {
    return (
      <Card className="h-80 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Cargando órdenes...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número de orden, cliente o email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="md:w-48">
            <Select
              value={statusFilter}
              onValueChange={value =>
                setStatusFilter(value as OrderStatus | 'all')
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {ORDER_STATUSES.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={fetchOrders}
            variant="outline"
            className="whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Lista de órdenes */}
      {filteredOrders.length === 0 ? (
        <Card className="h-80 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all'
                ? 'No se encontraron órdenes con los filtros aplicados'
                : 'No hay órdenes disponibles'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {searchTerm || statusFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Las órdenes aparecerán aquí cuando se realicen'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card
                key={order.id}
                className="transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30 group"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    {/* Información de la orden */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 bg-gray-100 dark:bg-gray-700">
                        <AvatarFallback className="text-gray-600 dark:text-gray-300">
                          {order.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            Orden #{order.orderNumber}
                          </p>
                          <Badge
                            className={`${statusInfo.color} self-start sm:self-auto rounded-full`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.text}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.customerName}
                        </p>
                        {order.customerEmail && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {order.customerEmail}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            'es-ES',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Total y acciones */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          ${order.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.items.length} producto
                          {order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Selector de estado */}
                      <div className="flex items-center space-x-2">
                        <Select
                          value={order.status}
                          onValueChange={newStatus =>
                            updateOrderStatus(
                              order.id,
                              newStatus as OrderStatus,
                            )
                          }
                          disabled={updatingStatus === order.id}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map(status => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {updatingStatus === order.id && (
                          <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
                        )}
                      </div>

                      {/* Botón de ver detalles */}
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-lg"
                      >
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
