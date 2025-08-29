'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderStatus, useAdminOrders } from '@/hooks/use-admin-orders';
import { translateOrderStatus } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-500',
  CONFIRMED: 'bg-blue-500',
  PROCESSING: 'bg-indigo-500',
  SHIPPED: 'bg-purple-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
  REFUNDED: 'bg-gray-500',
  FAILED: 'bg-red-700',
};

export default function AdminOrdersPage() {
  const { orders, loading, error, fetchOrders } = useAdminOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading && !orders.length) return <p>Cargando pedidos...</p>;
  if (error) return <p>Error al cargar los pedidos: {error}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos</CardTitle>
        <CardDescription>Gestiona los pedidos de tus clientes.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile View - Card List */}
        <div className="md:hidden">
          {orders.map(order => (
            <Card key={order.id} className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">
                  Pedido #{order.orderNumber}
                </CardTitle>
                <CardDescription>{order.customerName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Estado:</span>
                  <Badge
                    className={`text-white ${statusColors[order.status] || 'bg-gray-400'}`}
                  >
                    {translateOrderStatus(order.status)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Fecha:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                </div>
                <Link href={`/admin/orders/${order.id}`} className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Detalles
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    #{order.orderNumber}
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <Badge
                      className={`text-white ${statusColors[order.status] || 'bg-gray-400'}`}
                    >
                      {translateOrderStatus(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* TODO: Pagination controls */}
      </CardContent>
    </Card>
  );
}
