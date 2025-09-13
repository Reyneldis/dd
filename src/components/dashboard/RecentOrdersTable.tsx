// src/components/dashboard/RecentOrdersTable.tsx - DISEÑO 2026
'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  Eye,
  MoreHorizontal,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt?: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          text: 'Pendiente',
          icon: Clock,
          color:
            'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          bgColor: 'bg-amber-50 dark:bg-amber-900/10',
          borderColor: 'border-amber-200/50 dark:border-amber-800/50',
        };
      case 'CONFIRMED':
        return {
          text: 'Confirmado',
          icon: CheckCircle,
          color:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          bgColor: 'bg-blue-50 dark:bg-blue-900/10',
          borderColor: 'border-blue-200/50 dark:border-blue-800/50',
        };
      case 'PROCESSING':
        return {
          text: 'Procesando',
          icon: Package,
          color:
            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
          bgColor: 'bg-purple-50 dark:bg-purple-900/10',
          borderColor: 'border-purple-200/50 dark:border-purple-800/50',
        };
      case 'SHIPPED':
        return {
          text: 'Enviado',
          icon: Truck,
          color:
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
          bgColor: 'bg-indigo-50 dark:bg-indigo-900/10',
          borderColor: 'border-indigo-200/50 dark:border-indigo-800/50',
        };
      case 'DELIVERED':
        return {
          text: 'Entregado',
          icon: CheckCircle,
          color:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
          bgColor: 'bg-emerald-50 dark:bg-emerald-900/10',
          borderColor: 'border-emerald-200/50 dark:border-emerald-800/50',
        };
      case 'CANCELLED':
        return {
          text: 'Cancelado',
          icon: XCircle,
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          bgColor: 'bg-red-50 dark:bg-red-900/10',
          borderColor: 'border-red-200/50 dark:border-red-800/50',
        };
      default:
        return {
          text: status,
          icon: Clock,
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
          bgColor: 'bg-gray-50 dark:bg-gray-900/10',
          borderColor: 'border-gray-200/50 dark:border-gray-800/50',
        };
    }
  };

  try {
    if (!orders || orders.length === 0) {
      return (
        <Card className="h-80 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-gray-200/30 dark:border-gray-700/30">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No hay pedidos recientes
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Los pedidos aparecerán aquí cuando se realicen
            </p>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-3 md:space-y-4">
        {orders.map(order => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;

          return (
            <Card
              key={order.id}
              className={`transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl ${statusInfo.borderColor} border group`}
            >
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Avatar className="h-12 w-12 bg-gray-100 dark:bg-gray-700">
                        <AvatarFallback className="text-gray-600 dark:text-gray-300">
                          {order.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                          Pedido {order.orderNumber}
                        </p>
                        <Badge
                          className={`${statusInfo.color} self-start sm:self-auto rounded-full`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.text}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {order.customerName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between space-x-4">
                    <div className="text-right">
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </p>
                      {order.createdAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="rounded-xl"
                      >
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        <div className="text-center pt-4">
          <Button variant="outline" asChild className="rounded-2xl">
            <Link href="/dashboard/orders">Ver todos los pedidos</Link>
          </Button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error en RecentOrdersTable:', error);
    return (
      <Card className="h-80 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-red-200/50 dark:border-red-800/50">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">
            Error al cargar los pedidos
          </p>
          <p className="text-sm text-red-500 dark:text-red-300 mt-1">
            Intente recargar la página
          </p>
        </div>
      </Card>
    );
  }
}
