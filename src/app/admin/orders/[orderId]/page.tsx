'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAdminOrders, OrderStatus } from '@/hooks/use-admin-orders';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { translateOrderStatus } from '@/lib/utils';

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

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { order, loading, error, getOrderById, updateOrderStatus, isUpdating } = useAdminOrders();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId);
    }
  }, [orderId, getOrderById]);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  const handleStatusUpdate = async () => {
    if (orderId && selectedStatus) {
      await updateOrderStatus(orderId, selectedStatus);
    }
  };

  const handleCancel = () => {
      if(order) {
          setSelectedStatus(order.status);
      }
  }

  if (loading && !order) return <p>Cargando pedido...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!order) return <p>Pedido no encontrado.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Pedido #{order.orderNumber}</CardTitle>
            <CardDescription>
              Realizado el {new Date(order.createdAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Estado del Pedido</h3>
                    <Badge className={`text-white ${statusColors[order.status] || 'bg-gray-400'}`}>{translateOrderStatus(order.status)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <p>Total del Pedido:</p>
                    <p className="font-bold text-xl">${order.total.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold">Actualizar Estado</h4>
                    <div className="flex gap-2">
                        <Select value={selectedStatus || ''} onValueChange={(v) => setSelectedStatus(v as OrderStatus)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(statusColors).map(status => (
                                    <SelectItem key={status} value={status}>{translateOrderStatus(status as OrderStatus)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleStatusUpdate} disabled={isUpdating || selectedStatus === order.status}>
                            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isUpdating ? 'Actualizando...' : 'Actualizar'}
                        </Button>
                        <Button variant="outline" onClick={handleCancel} disabled={selectedStatus === order.status}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.items.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="flex items-center gap-2">
                                    <Avatar className="h-12 w-12 rounded-md">
                                        <AvatarImage src={item.product.images?.[0]?.url} />
                                        <AvatarFallback>{item.product.productName[0]}</AvatarFallback>
                                    </Avatar>
                                    <span>{item.product.productName}</span>
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Nombre:</strong> {order.contactInfo?.name}</p>
            <p><strong>Email:</strong> {order.contactInfo?.email}</p>
            <p><strong>Teléfono:</strong> {order.contactInfo?.phone}</p>
          </CardContent>
        </Card>
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Dirección de Envío</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
