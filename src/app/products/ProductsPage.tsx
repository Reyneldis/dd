import Categories from '@/components/shared/categories';
import ProductsGrid from './ProductsGrid';

export default function ProductsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo premium con blobs y degradado */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-[#e0e7ff] via-[#f5f7fa] to-[#c7d2fe] dark:from-[#232946] dark:via-[#121629] dark:to-[#232946]" />
        <svg
          className="absolute left-[-10%] top-[-10%] w-[60vw] h-[60vw] opacity-40 blur-2xl animate-pulse"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="200" cy="200" rx="200" ry="200" fill="#a5b4fc" />
        </svg>
        <svg
          className="absolute right-[-15%] bottom-[-15%] w-[50vw] h-[50vw] opacity-30 blur-2xl animate-pulse delay-1000"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="200" cy="200" rx="200" ry="200" fill="#fbcfe8" />
        </svg>
        <svg
          className="absolute left-[30%] top-[60%] w-[40vw] h-[40vw] opacity-20 blur-2xl animate-pulse delay-500"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="200" cy="200" rx="200" ry="200" fill="#fcd34d" />
        </svg>
      </div>
      <div className="container mx-auto px-4 py-12 mt-20">
        <div className="flex flex-col space-y-12">
          {/* Encabezado */}
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {/* El encabezado de categoría puede ir aquí si lo necesitas */}
              Nuestra Colección
            </h1>
            <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Descubre nuestra colección de productos cuidadosamente
              seleccionados
            </p>
          </div>
          {/* Categorías */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
            <Categories />
          </div>
          {/* Grid de productos y lógica de cliente */}
          <ProductsGrid />
        </div>
      </div>
    </div>
  );
}
