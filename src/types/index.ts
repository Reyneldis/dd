// types/index.ts
// Tipos para la base de datos de Prisma
export interface Category {
  id: string;
  categoryName: string;
  slug: string;
  mainImage: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    products: number;
  };
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
}

export interface Product {
  reviewCount: number;
  id: string;
  slug: string;
  productName: string;
  price: number;
  description: string | null;
  categoryId: string;
  features: string[] | null;

  createdAt: Date;
  updatedAt: Date;
  category: Category;
  images: ProductImage[];
  image?: string;
  stock?: number;
  rating?: number;
  sold?: number;
  _count?: {
    reviews: number;
  };
  featured?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
}

// src/types/index.ts
export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';
  customerEmail: string;
  customerName: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  paymentStatus:
    | 'PENDING'
    | 'PAID'
    | 'FAILED'
    | 'REFUNDED'
    | 'PARTIALLY_REFUNDED';
  paymentMethod:
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'PAYPAL'
    | 'BANK_TRANSFER'
    | 'CASH_ON_DELIVERY'
    | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  price: number;
  quantity: number;
  total: number;
  createdAt: Date;
  product: Product;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  product: Product;
}

// Tipos para las respuestas de las APIs
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Tipos para filtros
export interface ProductFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
}
