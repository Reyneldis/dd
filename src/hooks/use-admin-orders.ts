import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'PROCESSING'
  | 'REFUNDED'
  | 'FAILED';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
}

export interface AdminOrderDetail extends AdminOrder {
  contactInfo: { name: string; email: string; phone: string } | null;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      productName: string;
      images: Array<{ url: string }>;
    };
  }>;
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (page = 1, limit = 15) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      const response = await fetch(`/api/admin/orders?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Error al cargar los pedidos');
      }

      const data = await response.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Error al cargar el pedido');
      }
      const data = await response.json();
      setOrder(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      setIsUpdating(true);
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el estado del pedido');
        }

        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        // Also update the list of orders if it's there
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status } : o)),
        );
        toast.success('Estado del pedido actualizado');
        return updatedOrder;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        toast.error(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  return {
    orders,
    order,
    pagination,
    loading,
    isUpdating,
    error,
    fetchOrders,
    getOrderById,
    updateOrderStatus,
  };
}
