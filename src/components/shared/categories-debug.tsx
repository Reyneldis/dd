// import { ArrowRight, Sparkles } from 'lucide-react';
// import Link from 'next/link';

// interface Category {
//   id: string;
//   categoryName: string;
//   slug: string;
//   mainImage: string | null;
//   description: string | null;
//   _count?: { products: number };
// }

// async function fetchCategories(): Promise<Category[]> {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
//   const res = await fetch(`${baseUrl}/api/categories`, {
//     cache: 'no-store',
//     headers: {
//       'Cache-Control': 'no-cache',
//     },
//   });
//   if (!res.ok) return [];
//   const data = await res.json();
//   console.log('API Response:', data); // Debug log
//   return Array.isArray(data) ? data : data.categories || [];
// }

// export default async function CategoriesDebug() {
//   const categories = await fetchCategories();
//   console.log('Categories in component:', categories); // Debug log

//   if (!categories || categories.length === 0) {
//     return (
//       <section className="relative py-20 overflow-hidden">
//         <div className="mx-auto max-w-7xl px-4 relative z-10">
//           <div className="text-center">
//             <p className="text-red-500 text-2xl">
//               No se encontraron categorías.
//             </p>
//             <p className="text-gray-500 mt-2">
//               Debug: categories.length = {categories?.length || 0}
//             </p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section id="categorias" className="relative py-20 overflow-hidden">
//       <div className="mx-auto max-w-7xl px-4 relative z-10">
//         {/* Header */}
//         <div className="text-center mb-14">
//           <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-base font-semibold mb-4 shadow-md">
//             <Sparkles className="h-5 w-5 animate-bounce" />
//             Explora por categorías (DEBUG)
//           </div>
//           <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground animate-gradient">
//             Nuestras Categorías
//           </h2>
//           <p className="text-lg sm:text-2xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
//             Encuentra productos exclusivos y de alta calidad en cada categoría
//           </p>
//         </div>
//         {/* Grid de categorías */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
//           {(categories || []).map((category, index) => (
//             <Link
//               key={category.id}
//               href={`/categories/${category.slug}`}
//               className="group relative bg-background/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-border/20 transition-all duration-500 hover:scale-[1.025] flex flex-col w-full h-auto animate-fade-in"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               {/* Badge de categoría */}
//               <div className="absolute top-4 left-4 z-20">
//                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-foreground text-xs font-bold shadow-lg">
//                   <Sparkles className="h-3 w-3" />
//                   {category._count?.products || 0} productos
//                 </span>
//               </div>
//               {/* Imagen protagonista (65% de la altura) */}
//               <div className="relative w-full h-[65%] rounded-t-3xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
//                 <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
//                   <span className="text-white text-2xl font-bold">
//                     {category.categoryName}
//                   </span>
//                 </div>
//                 {/* Gradiente y sombra sutil */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"></div>
//               </div>
//               {/* Info inferior glassmorphism */}
//               <div className="flex-1 p-6 flex flex-col justify-center bg-gradient-to-b from-background/80 to-background/95 backdrop-blur-sm">
//                 <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 break-words text-center lg:text-left">
//                   {category.categoryName}
//                 </h3>
//                 {category.description && (
//                   <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
//                     {category.description}
//                   </p>
//                 )}
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">
//                     {category._count?.products || 0} productos disponibles
//                   </span>
//                   <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
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
  return Array.isArray(data) ? data : data.categories || [];
}

export default async function Categories() {
  const categories = await fetchCategories();

  if (!categories || categories.length === 0) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center">
            <p className="text-red-500 text-2xl">
              No se encontraron categorías.
            </p>
            <p className="text-gray-500 mt-2">Por favor, intenta más tarde.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categorias" className="relative py-20 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 -z-10"></div>

      <div className="mx-auto max-w-7xl px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-base font-semibold mb-4 shadow-md">
            <Sparkles className="h-5 w-5 animate-bounce" />
            Explora por categorías
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-blue-700 animate-gradient">
            Nuestras Categorías
          </h2>
          <p className="text-lg sm:text-2xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto font-medium">
            Descubre productos exclusivos organizados para facilitar tu búsqueda
          </p>
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 dark:border-slate-700 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
            >
              {/* Imagen de la categoría */}
              <div className="relative h-48 overflow-hidden">
                {category.mainImage ? (
                  <Image
                    src={category.mainImage}
                    alt={category.categoryName}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {category.categoryName}
                    </span>
                  </div>
                )}

                {/* Gradiente superpuesto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>

                {/* Badge de productos */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 text-gray-800 dark:text-gray-200 text-xs font-bold shadow-lg">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    {category._count?.products || 0} productos
                  </span>
                </div>

                {/* Nombre de la categoría en la imagen */}
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {category.categoryName}
                  </h3>
                </div>
              </div>

              {/* Contenido inferior */}
              <div className="flex-1 p-6 flex flex-col justify-between bg-white dark:bg-slate-800">
                {category.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category._count?.products || 0} productos disponibles
                  </span>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
                    <span className="text-sm font-medium">Explorar</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </Link>
          ))}
        </div>

        {/* Botón para ver todas las categorías */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Ver todas las categorías
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
