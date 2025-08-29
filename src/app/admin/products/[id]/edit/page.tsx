// 'use client';

// import { ProductForm } from '@/components/shared/ProductForm';
// import { Button } from '@/components/ui/button';
// import { AdminProduct, useAdminProducts } from '@/hooks/use-admin-products';
// import { useCategories } from '@/hooks/use-categories';
// import { ArrowLeft } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';

// export default function AdminProductEditPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const { categories } = useCategories();
//   const { updateProduct } = useAdminProducts();
//   const router = useRouter();
//   const [product, setProduct] = useState<AdminProduct | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/admin/products/${params.id}`);
//         if (!response.ok) {
//           throw new Error('Error al cargar el producto');
//         }
//         const data = await response.json();
//         setProduct(data);
//       } catch (error) {
//         console.log(error);
//         toast.error('No se pudo cargar el producto.');
//         router.push('/admin/products');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [params, router]);

//   if (loading || !product) {
//     return <p>Cargando producto...</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 flex flex-col items-center py-12">
//       <div className="w-full max-w-5xl bg-white/90 dark:bg-neutral-900/90 rounded-3xl shadow-2xl p-10 border border-neutral-200 dark:border-neutral-800">
//         <div className="flex items-center justify-between mb-8">
//           <Button
//             variant="ghost"
//             onClick={() => router.push('/admin/products')}
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             <ArrowLeft className="h-5 w-5" /> Volver a productos
//           </Button>
//           <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
//             Editar Producto
//           </h1>
//         </div>
//         <ProductForm
//           categories={categories}
//           initialValues={{
//             ...product,
//             images: product.images.map((url, index) => ({
//               url,
//               alt: product.productName,
//               sortOrder: index,
//               isPrimary: index === 0,
//             })),
//           }}
//           onSubmit={async data => {
//             try {
//               await updateProduct(params.id, data);
//               toast.success('¡Producto actualizado correctamente!');
//               router.push('/admin/products');
//             } catch {
//               toast.error('Error al actualizar el producto');
//             }
//           }}
//           loading={false}
//           submitLabel="Guardar Cambios"
//         />
//       </div>
//     </div>
//   );
// }
'use client';
import { ProductForm } from '@/components/shared/ProductForm';
import { Button } from '@/components/ui/button';
import { AdminProduct, useAdminProducts } from '@/hooks/use-admin-products';
import { useCategories } from '@/hooks/use-categories';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminProductEditPage() {
  // Usar useParams en lugar de recibir params como prop
  const params = useParams();
  const id = params.id as string;

  const { categories } = useCategories();
  const { updateProduct } = useAdminProducts();
  const router = useRouter();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/products/${id}`);
        if (!response.ok) {
          throw new Error('Error al cargar el producto');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.log(error);
        toast.error('No se pudo cargar el producto.');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  if (loading || !product) {
    return <p>Cargando producto...</p>;
  }

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
            Editar Producto
          </h1>
        </div>
        <ProductForm
          categories={categories}
          initialValues={{
            ...product,
            images: product.images.map((url, index) => ({
              url,
              alt: product.productName,
              sortOrder: index,
              isPrimary: index === 0,
            })),
          }}
          onSubmit={async data => {
            try {
              await updateProduct(id, data);
              toast.success('¡Producto actualizado correctamente!');
              router.push('/admin/products');
            } catch {
              toast.error('Error al actualizar el producto');
            }
          }}
          loading={false}
          submitLabel="Guardar Cambios"
        />
      </div>
    </div>
  );
}
