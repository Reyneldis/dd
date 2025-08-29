// // src/app/admin/categories/[categoryId]/edit/page.tsx
// import { CategoryForm } from '@/app/admin/categories/components/category-form'; // Ruta corregida
// import { getCategoryById } from '@/lib/product/categories';
// import { notFound } from 'next/navigation';

// export default async function EditCategoryPage({
//   params,
// }: {
//   params: Promise<{ categoryId: string }>;
// }) {
//   const { categoryId } = await params;
//   const category = await getCategoryById(categoryId);

//   if (!category) {
//     notFound();
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <CategoryForm initialData={category} />
//     </div>
//   );
// }
// src/app/admin/categories/[categoryId]/edit/page.tsx
import { CategoryForm } from '@/app/admin/categories/components/category-form';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategoryById } from '@/lib/product/categories';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// Componente de carga mientras se obtienen los datos
function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

// Componente principal con manejo optimizado de datos
async function EditCategoryContent({ categoryId }: { categoryId: string }) {
  // Usamos unstable_cache para optimizar las peticiones a la BD
  const getCachedCategory = unstable_cache(
    async (id: string) => getCategoryById(id),
    ['category'],
    {
      revalidate: 3600, // Revalidar cada hora
      tags: ['category'],
    },
  );

  const category = await getCachedCategory(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Editar Categoría</h1>
        <p className="text-muted-foreground">
          Modifica los detalles de la categoría seleccionada
        </p>
      </div>
      <CategoryForm initialData={category} />
    </div>
  );
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Suspense fallback={<LoadingSkeleton />}>
        <EditCategoryContent categoryId={categoryId} />
      </Suspense>
    </div>
  );
}
