import ProductCard from '@/components/shared/ProductCard/ProductCard';
import { prisma } from '@/lib/prisma';
import { ProductFull } from '@/types/product';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    priceRange?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return {
    title: `${category.categoryName} | Delivery Express`,
    description:
      category.description ||
      `Compra productos de ${category.categoryName} en Delivery Express.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { page = '1', priceRange } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  // Parsear filtros
  const currentPage = parseInt(page, 10);
  const pageSize = 3; // Solo 3 productos por página
  const skip = (currentPage - 1) * pageSize;

  const where: {
    categoryId: string;
    status: 'ACTIVE';
    price?: {
      gte?: number;
      lte?: number;
    };
  } = {
    categoryId: category.id,
    status: 'ACTIVE',
  };

  if (priceRange && priceRange !== 'all') {
    const [min, max] = priceRange.split('-').map(Number);
    where.price = {};
    if (min) where.price.gte = min;
    if (max) where.price.lte = max;
  }

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  const priceRanges = [
    { label: 'Todos', value: 'all' },
    { label: '0 - 50', value: '0-50' },
    { label: '50 - 100', value: '50-100' },
    { label: '100 - 150', value: '100-150' },
    { label: '150+', value: '150-' },
  ];

  return (
    <div className="container pt-10 mx-auto px-4 py-8 sm:py-12">
      {/* Botón minimalista y con personalidad para volver */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-gray-700 hover:to-gray-800 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Volver
        </Link>
      </div>

      {/* Filtro por precios */}
      <div className="flex justify-center mb-8 sm:mb-12">
        <div
          className="flex flex-wrap justify-center gap-2 sm:gap-0 sm:inline-flex rounded-md shadow-sm"
          role="group"
        >
          {priceRanges.map(range => (
            <Link
              key={range.value}
              href={`/categories/${slug}?priceRange=${range.value}`}
              className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border ${
                priceRange === range.value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              } ${
                range === priceRanges[0]
                  ? 'rounded-l-lg sm:rounded-l-lg'
                  : range === priceRanges[priceRanges.length - 1]
                  ? 'rounded-r-lg sm:rounded-r-lg'
                  : 'rounded-lg sm:rounded-none'
              }`}
            >
              {range.label}
            </Link>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No hay productos disponibles en esta categoría.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product: ProductFull) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginación minimalista y fresca */}
          {totalPages > 1 && (
            <div className="mt-8 sm:mt-12 flex justify-center items-center gap-4">
              {currentPage > 1 && (
                <Link
                  href={`/categories/${slug}?page=${currentPage - 1}${
                    priceRange ? `&priceRange=${priceRange}` : ''
                  }`}
                  className="p-2 rounded-full bg-green-400 hover:bg-green-700 transition-colors"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              )}

              <span className="text-gray-700 font-medium text-sm sm:text-base">
                Página {currentPage} de {totalPages}
              </span>

              {currentPage < totalPages && (
                <Link
                  href={`/categories/${slug}?page=${currentPage + 1}${
                    priceRange ? `&priceRange=${priceRange}` : ''
                  }`}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  aria-label="Página siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
