// components/shop/FeaturedProducts.tsx
import FeaturedProductsGrid from './FeaturedProductsGrid';

export const revalidate = 60; // Regenera cada 60 segundos

async function getFeaturedProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  console.log(
    '🔍 Fetching featured products from:',
    `${baseUrl}/api/products/featured`,
  );

  const res = await fetch(`${baseUrl}/api/products/featured`, {
    next: { revalidate: 60 },
  });

  console.log('📡 Response status:', res.status);

  if (!res.ok) {
    console.error(
      '❌ Error fetching featured products:',
      res.status,
      res.statusText,
    );
    return [];
  }

  const data = await res.json();
  console.log('📦 Featured products data:', data);

  return data.products || [];
}

export default async function FeaturedProducts() {
  console.log('🎯 FeaturedProducts component rendering...');
  const featured = await getFeaturedProducts();
  console.log('✅ Featured products count:', featured.length);

  // Si no hay productos destacados, no mostrar la sección
  if (!featured || featured.length === 0) {
    console.log('⚠️ No featured products found, hiding section');
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 mb-8 text-center">
            Selección Especial
          </h2>
          <p className="text-lg sm:text-2xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
            No hay productos destacados disponibles en este momento.
          </p>
        </div>
      </section>
    );
  }

  console.log('🎨 Rendering featured products section');
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-700 mb-8 text-center">
          Selección Especial
        </h2>
        <p className="text-lg sm:text-2xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
          Productos que marcan la diferencia, elegidos para ti por calidad,
          tendencia y valor
        </p>
        <FeaturedProductsGrid initialProducts={featured} />
      </div>
    </section>
  );
}
