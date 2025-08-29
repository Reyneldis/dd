'use client';
import { ProductForm } from '@/components/shared/ProductForm';
import { Button } from '@/components/ui/button';
import { useAdminProducts } from '@/hooks/use-admin-products';
import { useCategories } from '@/hooks/use-categories';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminProductNewPage() {
  const { categories } = useCategories();
  const { createProduct } = useAdminProducts();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 flex flex-col items-center py-12">
      <div className="w-full max-w-5xl bg-white/90 dark:bg-neutral-900/90 rounded-3xl shadow-2xl p-10 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/products')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" /> Volver a productos
          </Button>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Agregar nuevo producto
          </h1>
        </div>
        <ProductForm
          categories={categories}
          onSubmit={async data => {
            try {
              await createProduct({
                ...data,
                stock: typeof data.stock === 'number' ? data.stock : 0,
                status: data.status,
                featured: Boolean(data.featured),
              });
              toast.success('¡Producto agregado correctamente!');
              router.push('/admin/products');
            } catch {
              toast.error('Error al crear producto');
            }
          }}
          loading={false}
          submitLabel="Crear producto"
        />
      </div>
    </div>
  );
}
