// En tu archivo src/types/index.ts, modifica la interfaz ProductFull para incluir reviewCount:

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
  reviewCount?: number; // Asegúrate de tener esta propiedad
  rating?: number;
  sold?: number;
  image?: string; // Asegúrate de tener esta propiedad
}
