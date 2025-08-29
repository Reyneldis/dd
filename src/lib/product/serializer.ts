import type {
  Category,
  ProductImage as PrismaProductImage,
  Product,
} from '@prisma/client';

export type ProductDTO = {
  id: string;
  slug: string;
  productName: string;
  name: string;
  price: number;
  description: string;
  category: string;
  categoryId: string;
  image: string;
  images: Array<{
    url: string;
    alt?: string | null;
    isPrimary?: boolean | null;
  }>;
  stock?: number;
  rating?: number;
  reviews?: number;
  status?: string;
  featured?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
  features: string[];
};

type ProductWithRels = Product & {
  images: PrismaProductImage[];
  category: Category | null;
  _count?: { reviews?: number };
};

export function mapProductToDTO(product: ProductWithRels): ProductDTO {
  const images: PrismaProductImage[] = Array.isArray(product.images)
    ? product.images
    : [];
  const primaryImage = images.find(img => img?.isPrimary) || images[0];
  return {
    id: product.id,
    slug: product.slug,
    productName: product.productName,
    name: product.productName,
    price: Number(product.price ?? 0),
    description: product.description || '',
    category: product.category?.categoryName ?? '',
    categoryId: product.categoryId,
    image: primaryImage?.url || '/img/placeholder-product.jpg',
    images: images.map(img => ({
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
    })),
    stock: typeof product.stock === 'number' ? product.stock : undefined,
    rating: 4.5,
    reviews: product._count?.reviews ?? undefined,
    status: product.status,
    featured: product.featured,
    createdAt: product.createdAt
      ? new Date(product.createdAt).toISOString()
      : undefined,
    updatedAt: product.updatedAt
      ? new Date(product.updatedAt).toISOString()
      : undefined,
    features: product.features ?? [],
  };
}
