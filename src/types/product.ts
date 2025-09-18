// src/types/product.ts

export interface ProductFull {
  id: string;
  slug: string;
  productName: string;
  price: number;
  stock: number;
  description?: string | null | undefined;
  features: string[];
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: {
    id: string;
    categoryName: string;
    slug: string;
    description?: string | null;
    mainImage?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  images: Array<{
    id: string;
    url: string;
    alt?: string | null;
    sortOrder: number;
    isPrimary: boolean;
    createdAt: Date;
  }>;
  // Añadir la propiedad _count
  _count?: {
    orderItems?: number;
    reviews?: number;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    comment?: string | null;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    productId: string;
  }>;
}
