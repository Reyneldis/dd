// src/components/dashboard/OrdersManagement.tsx

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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// --- INTERFACES (Sin cambios) ---
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
  items: Array<{ productName: string; quantity: number; price: number }>;
}

// --- CONSTANTES (Sin cambios) ---
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

// --- COMPONENTE PRINCIPAL ---
export function OrdersManagement() {
  const [allOrders, setAllOrders] = useState<Order[]>([]); // <-- Almacena TODAS las órdenes sin filtrar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Función para obtener órdenes desde la API (solo se llama una vez o al recargar)
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // La petición inicial ya no necesita filtros
      const response = await fetch(`/api/dashboard/orders?limit=100`); // Pedimos más para tener un buen set de datos

      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: No se pudieron cargar las órdenes`,
        );
      }

      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error('La respuesta del servidor no es válida');
      }

      const transformedOrders: Order[] = data.data.map(
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

      setAllOrders(transformedOrders); // <-- Guardamos todas las órdenes
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // <-- Sin dependencias, solo se ejecuta una vez

  // Efecto para cargar las órdenes al montar el componente
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // <-- ¡LA MAGIA DEL FILTRADO AQUÍ!
  // Usamos useMemo para calcular las órdenes filtradas solo cuando cambian los filtros
  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerEmail &&
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allOrders, searchTerm, statusFilter]); // Se recalcula si las órdenes o los filtros cambian

  // Función para actualizar el estado de una orden (sin cambios)
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId);
    try {
      const response = await fetch(`/api/dashboard/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al actualizar el estado');
      }

      // Actualizamos el estado local en `allOrders` para que el cambio se refleje al instante
      setAllOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
      toast.success(`Estado actualizado correctamente.`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Función auxiliar para obtener la información del estado (sin cambios)
  const getStatusInfo = (status: OrderStatus) => {
    const statusConfig = ORDER_STATUSES.find(s => s.value === status);
    let icon = Clock;
    if (status === 'CONFIRMED' || status === 'DELIVERED') icon = CheckCircle;
    else if (status === 'PROCESSING') icon = Package;
    else if (status === 'SHIPPED') icon = Truck;
    else if (status === 'CANCELLED') icon = XCircle;

    return {
      text: statusConfig?.label || status,
      color: statusConfig?.color || 'bg-gray-100 text-gray-800',
      icon,
    };
  };

  // --- RENDERIZADO CONDICIONAL (Usamos `filteredOrders` para la lógica) ---

  if (loading) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Cargando órdenes...
          </p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-2">Error al cargar</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <Button onClick={fetchOrders}>Reintentar</Button>
        </div>
      </Card>
    );
  }

  // Usamos `allOrders` para el mensaje de "vacío", y `filteredOrders` para el renderizado
  if (allOrders.length === 0) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No hay órdenes disponibles
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Los nuevos pedidos aparecerán aquí
          </p>
          <Button onClick={fetchOrders} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recargar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número de orden, cliente o email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} // <-- Ahora solo actualiza el estado
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
          <Button onClick={fetchOrders} variant="outline" disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Mensaje si no hay resultados tras filtrar */}
      {filteredOrders.length === 0 && (
        <Card className="h-40 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron órdenes con los filtros aplicados.
            </p>
          </div>
        </Card>
      )}

      {/* Lista de órdenes filtradas */}
      <div className="space-y-4">
        {filteredOrders.map(order => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;
          return (
            <Card
              key={order.id}
              className="transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        {order.customerName.charAt(0)}
                      </span>
                    </div>
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
                    <div className="flex items-center space-x-2">
                      <Select
                        value={order.status}
                        onValueChange={newStatus =>
                          updateOrderStatus(order.id, newStatus as OrderStatus)
                        }
                        disabled={updatingStatus === order.id}
                      >
                        <SelectTrigger className="w-40">
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
                      {updatingStatus === order.id && (
                        <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild>
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
    </div>
  );
}
