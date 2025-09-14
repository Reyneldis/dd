// @ts-nocheck
// src/app/(routes)/dashboard/products/page.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useAdminProducts } from '@/hooks/use-admin-products';
import Link from 'next/link';

export default function ProductsPage() {
  const { products, loading, fetchProducts } = useAdminProducts();

  const columns: any[] = [
    {
      accessorKey: 'productName',
      header: 'Producto',
      cell: ({ row }: { row: any }) => (
        <Link
          href={`/dashboard/products/${row.original.id}/edit`}
          className="text-indigo-600 hover:underline"
        >
          {row.original.productName}
        </Link>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Categoría',
    },
    {
      accessorKey: 'price',
      header: 'Precio',
      cell: ({ row }: { row: any }) => `$${row.original.price.toFixed(2)}`,
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }: { row: any }) => {
        const variant: 'default' | 'secondary' =
          row.original.status === 'ACTIVE' ? 'default' : 'secondary';
        return (
          <Badge variant={variant}>
            {row.original.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'featured',
      header: 'Destacado',
      cell: ({ row }: { row: any }) => (row.original.featured ? 'Sí' : 'No'),
    },
    {
      accessorKey: 'createdAt',
      header: 'Creado',
      cell: ({ row }: { row: any }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <div className="space-x-2">
          <Button asChild>
            <Link href="/dashboard/products/create">Nuevo producto</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => fetchProducts()}>
            Recargar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-500">Cargando productos...</div>
      ) : (
        <DataTable columns={columns} data={products as any} searchKey="productName" />
      )}
    </div>
  );
}

