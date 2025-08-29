'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Category } from '@prisma/client';
import Link from 'next/link';
import { toast } from 'sonner';
import { deleteCategory } from './actions';

interface CategoriesTableProps {
  categories: Category[];
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success('Categoría eliminada con éxito');
    } catch (error) {
      console.log(error);
      toast.error('Error al eliminar la categoría');
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Imagen</span>
          </TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map(category => (
          <TableRow key={category.id}>
            <TableCell className="hidden sm:table-cell">
              <Avatar className="h-12 w-12 rounded-md">
                <AvatarImage
                  src={category.mainImage ?? undefined}
                  alt={category.categoryName}
                />
                <AvatarFallback>{category.categoryName[0]}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>{category.categoryName}</TableCell>
            <TableCell>{category.slug}</TableCell>
            <TableCell>{category.description}</TableCell>
            <TableCell className="text-right">
              <Link href={`/admin/categories/${category.id}/edit`}>
                <Button variant="outline" size="sm" className="mr-2">
                  Editar
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(category.id)}
              >
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
