// @ts-nocheck
// src/app/(routes)/dashboard/categories/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useCategories } from '@/hooks/use-categories';
import Link from 'next/link';

type CategoryRow = {
  id: string;
  categoryName: string;
  slug: string;
  productCount?: number;
};

export default function CategoriesPage() {
  const { categories, loading } = useCategories();

  const rows: CategoryRow[] = categories.map((c: any) => ({
    id: c.id,
    categoryName: c.categoryName,
    slug: c.slug,
    productCount: (c as any).productCount,
  }));

  const columns: any[] = [
    { accessorKey: 'categoryName', header: 'Categoría' },
    { accessorKey: 'slug', header: 'Slug' },
    {
      accessorKey: 'productCount',
      header: 'Productos',
      cell: ({ row }: { row: any }) => row.original.productCount ?? 0,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: { row: any }) => (
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href={`/dashboard/categories/${row.original.id}/edit`}>Editar</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button asChild>
          <Link href="/dashboard/categories/create">Nueva categoría</Link>
        </Button>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-500">Cargando categorías...</div>
      ) : (
        <DataTable columns={columns} data={rows} searchKey="categoryName" />
      )}
    </div>
  );
}

