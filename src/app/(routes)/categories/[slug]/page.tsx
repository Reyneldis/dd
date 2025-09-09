import ProductCardCompact from '@/components/shared/ProductCard/ProductCardCompact';
import { prisma } from '@/lib/prisma';
import { ProductFull } from '@/types/product';
import { Category, Product, ProductImage, Review } from '@prisma/client';
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

// Tipo intermedio para el producto de Prisma con relaciones
type ProductWithRelations = Product & {
  category: Category;
  images: ProductImage[];
  reviews: Review[];
};

// Función para transformar un producto de Prisma a ProductFull
function transformToProductFull(product: ProductWithRelations): ProductFull {
  return {
    id: product.id,
    slug: product.slug,
    productName: product.productName,
    price: product.price,
    stock: product.stock,
    description: product.description,
    features: product.features || [],
    status: product.status,
    featured: product.featured,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    categoryId: product.categoryId,
    category: {
      id: product.category.id,
      categoryName: product.category.categoryName,
      slug: product.category.slug,
      description: product.category.description,
      mainImage: product.category.mainImage,
      createdAt: product.category.createdAt,
      updatedAt: product.category.updatedAt,
    },
    images: product.images.map(image => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
      createdAt: image.createdAt,
    })),
    reviews: product.reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      isApproved: review.isApproved,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      userId: review.userId,
      productId: review.productId,
    })),
    reviewCount: product.reviews.length,
  };
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
    }) as Promise<ProductWithRelations[]>,
    prisma.product.count({ where }),
  ]);
  // Transformar los productos para incluir reviewCount
  const productsWithReviewCount: ProductFull[] = products.map(
    transformToProductFull,
  );
  const totalPages = Math.ceil(totalProducts / pageSize);
  const priceRanges = [
    { label: 'Todos', value: 'all' },
    { label: '0 - 50', value: '0-50' },
    { label: '50 - 100', value: '50-100' },
    { label: '100 - 150', value: '100-150' },
    { label: '150+', value: '150-' },
  ];
  return (
    <div className="container pt-4 mx-auto px-4 py-8 sm:py-12">
      {/* Botón minimalista y con personalidad para volver */}
      <div className="flex justify-center pt-8 mb-6 sm:mb-8">
        <Link
          href="/"
          className="group relative inline-flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-medium">Volver</span>
          {/* Línea principal */}
          <span className="absolute bottom-0 left-0 h-0.5 bg-sky-500 dark:bg-sky-400 w-0 group-hover:w-full transition-all duration-400 ease-in-out"></span>
          {/* Efecto de brillo solo en modo oscuro */}
          <span className="absolute bottom-0 left-0 h-0.5 bg-white/30 dark:bg-white/50 w-0 group-hover:w-full transition-all duration-400 ease-in-out blur-sm opacity-0 dark:opacity-100"></span>
        </Link>
      </div>
      {/* Filtro por precios - Estilo mejorado */}
      <div className="flex justify-center mb-8 sm:mb-12">
        <div className="inline-flex p-2 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
          {priceRanges.map((range, index) => (
            <Link
              key={range.value}
              href={`/categories/${slug}?priceRange=${range.value}`}
              className={`relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ease-out ${
                priceRange === range.value
                  ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
              } ${
                index === 0
                  ? 'rounded-l-lg'
                  : index === priceRanges.length - 1
                  ? 'rounded-r-lg'
                  : ''
              }`}
            >
              {priceRange === range.value && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-lg opacity-30"></span>
              )}
              <span className="relative z-10">{range.label}</span>
            </Link>
          ))}
        </div>
      </div>
      {productsWithReviewCount.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No hay productos disponibles en esta categoría.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {productsWithReviewCount.map(product => (
              <ProductCardCompact key={product.id} product={product} />
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
