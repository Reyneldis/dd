'use client';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProductFull } from '@/types/product';
import FeaturedProductCard from './FeaturedProductCard';

export default function FeaturedProductsGrid({
  initialProducts,
}: {
  initialProducts: ProductFull[];
}) {
  const products = initialProducts;
  const loading = false;

  // Si implementas paginación/filtros, aquí harías el fetch y setLoading(true)
  // useEffect(() => { ... }, [filtros, página, etc]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`skeleton-featured-${i}`}
              className="w-full flex justify-center"
            >
              <Skeleton className="w-[320px] sm:w-[340px] h-[340px] rounded-2xl" />
            </div>
          ))
        : products.map(p => <FeaturedProductCard key={p.id} product={p} />)}
    </div>
  );
}
