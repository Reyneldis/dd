import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  categoryName: string;
  slug: string;
  mainImage: string | null;
  description: string | null;
  _count?: { products: number };
}

async function fetchCategories(): Promise<Category[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/categories`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  console.log('API Response:', data); // Debug log
  return Array.isArray(data) ? data : data.categories || [];
}

export default async function CategoriesDebug() {
  const categories = await fetchCategories();
  console.log('Categories in component:', categories); // Debug log

  if (!categories || categories.length === 0) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center">
            <p className="text-red-500 text-2xl">
              No se encontraron categorías.
            </p>
            <p className="text-gray-500 mt-2">
              Debug: categories.length = {categories?.length || 0}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categorias" className="relative py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-base font-semibold mb-4 shadow-md">
            <Sparkles className="h-5 w-5 animate-bounce" />
            Explora por categorías (DEBUG)
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground animate-gradient">
            Nuestras Categorías
          </h2>
          <p className="text-lg sm:text-2xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
            Encuentra productos exclusivos y de alta calidad en cada categoría
          </p>
        </div>
        {/* Grid de categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {(categories || []).map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative bg-background/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-border/20 transition-all duration-500 hover:scale-[1.025] flex flex-col w-full h-auto animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Badge de categoría */}
              <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-foreground text-xs font-bold shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  {category._count?.products || 0} productos
                </span>
              </div>
              {/* Imagen protagonista (65% de la altura) */}
              <div className="relative w-full h-[65%] rounded-t-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {category.categoryName}
                  </span>
                </div>
                {/* Gradiente y sombra sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"></div>
              </div>
              {/* Info inferior glassmorphism */}
              <div className="flex-1 p-6 flex flex-col justify-center bg-gradient-to-b from-background/80 to-background/95 backdrop-blur-sm">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 break-words text-center lg:text-left">
                  {category.categoryName}
                </h3>
                {category.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category._count?.products || 0} productos disponibles
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 