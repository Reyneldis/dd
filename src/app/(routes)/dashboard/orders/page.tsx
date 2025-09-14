// @ts-nocheck
// src/app/(routes)/dashboard/orders/page.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useAdminOrders } from '@/hooks/use-admin-orders';
import Link from 'next/link';
import { useEffect } from 'react';

export default function OrdersPage() {
  const { orders, loading, fetchOrders } = useAdminOrders();

  useEffect(() => {
    fetchOrders(1, 15);
  }, [fetchOrders]);

  // Using any[] to avoid dependency on ColumnDef types here
  const columns: any[] = [
    {
      accessorKey: 'orderNumber',
      header: 'Pedido',
      cell: ({ row }: { row: any }) => (
        <Link
          href={`/dashboard/orders/${row.original.id}`}
          className="text-indigo-600 hover:underline"
        >
          #{row.original.orderNumber}
        </Link>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Cliente',
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }: { row: any }) => {
        const variant: 'default' | 'secondary' | 'destructive' | 'outline' =
          row.original.status === 'CANCELLED'
            ? 'destructive'
            : row.original.status === 'PENDING'
            ? 'secondary'
            : 'default';
        return <Badge variant={variant}>{row.original.status}</Badge>;
      },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }: { row: any }) => `$${row.original.total.toFixed(2)}`,
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }: { row: any }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: { row: any }) => (
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href={`/dashboard/orders/${row.original.id}`}>Ver</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Button variant="outline" size="sm" onClick={() => fetchOrders()}>
          Recargar
        </Button>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-500">Cargando pedidos...</div>
      ) : (
        <DataTable columns={columns} data={orders} searchKey="customerName" />
      )}
    </div>
  );
}

