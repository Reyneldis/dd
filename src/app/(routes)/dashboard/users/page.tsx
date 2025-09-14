// @ts-nocheck
// src/app/(routes)/dashboard/users/page.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useAdminUsers } from '@/hooks/use-admin-users';

export default function UsersPage() {
  const { users, loading, fetchUsers } = useAdminUsers();

  const columns: any[] = [
    {
      accessorKey: 'firstName',
      header: 'Nombre',
      cell: ({ row }: { row: any }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Rol' },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }: { row: any }) => {
        const variant: 'default' | 'secondary' = row.original.isActive
          ? 'default'
          : 'secondary';
        return (
          <Badge variant={variant}>
            {row.original.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Button variant="outline" size="sm" onClick={() => fetchUsers()}>
          Recargar
        </Button>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-gray-500">Cargando usuarios...</div>
      ) : (
        <DataTable columns={columns} data={users as any} searchKey="email" />
      )}
    </div>
  );
}

