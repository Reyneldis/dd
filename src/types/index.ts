// src/types/index.ts

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

// Interfaz Order corregida para que coincida con tu schema
// src/types/index.ts

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';
  customerEmail?: string | null;
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
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  items: OrderItem[];
  contactInfo?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    orderId: string;
  } | null;
  shippingAddress?: {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    createdAt: string;
    updatedAt: string;
    orderId: string;
  } | null;
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
  createdAt: string;
  product: {
    id: string;
    slug: string;
    productName: string;
    price: number;
    description: string | null;
    categoryId: string;
    features: string[];
    createdAt: string;
    updatedAt: string;
    category: {
      id: string;
      categoryName: string;
      slug: string;
      mainImage: string | null;
      description: string | null;
      createdAt: string;
      updatedAt: string;
    };
    images: {
      id: string;
      productId: string;
      url: string;
      alt: string | null;
      sortOrder: number;
      isPrimary: boolean;
      createdAt: string;
    }[];
  };
}

// Interfaz para respuestas paginadas
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Interfaz para la respuesta de órdenes
export interface OrdersResponse extends PaginatedResponse<Order> {}

export interface CartItem {
  id: string;
  slug: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

// Interfaz para la respuesta de la API de órdenes
export interface OrderResponse {
  success?: boolean;
  order: {
    id: string;
    orderNumber: string;
    status: string;
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    total: number;
    createdAt: string;
    contactInfo: {
      name: string;
      email: string;
      phone: string;
    };
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    items: Array<{
      id: string;
      quantity: number;
      price: number;
      total: number;
      product: {
        id: string;
        productName: string;
        slug: string;
      };
    }>;
  };
  emailSent: boolean;
  emailError?: string;
  error?: string;
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

// src/types/product.ts
export type ProductFull = {
  id: string;
  slug: string;
  reviewCount: number;
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
};

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  preferences: UserPreferences;
  addresses: UserAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: 'es' | 'en';
  currency: 'USD' | 'EUR' | 'COP';
  theme: 'light' | 'dark' | 'system';
  emailNotifications: {
    orderUpdates: boolean;
    promotions: boolean;
    securityAlerts: boolean;
  };
  pushNotifications: {
    orderUpdates: boolean;
    promotions: boolean;
    securityAlerts: boolean;
  };
}

export interface UserAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  instructions?: string;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: UserAddress;
  billingAddress: UserAddress;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

// Tipos específicos para el Dashboard
export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
  salesByCategory: { name: string; sales: number }[];
  ordersByStatus: { name: string; count: number }[];
  topProducts: { productName: string; totalSold: number }[];
  recentOrders: RecentOrder[];
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  monthlyGrowth: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'FAILED';

export interface EmailMetrics {
  id: string;
  timestamp: string;
  type: string;
  recipient: string;
  orderId: string;
  status: 'sent' | 'failed' | 'retry';
  attempt: number;
  error: string | null;
  order: {
    id: string;
    orderNumber: string;
    total: number;
    customerEmail: string | null;
  };
}

export interface FailedEmail {
  id: string;
  timestamp: string;
  recipient: string;
  orderNumber: string;
  error: string;
  attempts: number;
  lastAttempt: string;
  canRetry: boolean;
}

// Tipos para formularios del dashboard
export interface ProductFormData {
  productName: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  features: string[];
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  images: File[];
}

export interface CategoryFormData {
  categoryName: string;
  description: string;
  mainImage: File | null;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
}

// Tipos para filtros del dashboard
export interface DashboardFilters {
  dateRange?: {
    from: string;
    to: string;
  };
  status?: string;
  category?: string;
  search?: string;
}

// Tipos para respuestas de API del dashboard
export interface DashboardProductsResponse extends PaginatedResponse<Product> {}
export interface DashboardCategoriesResponse
  extends PaginatedResponse<Category> {}
export interface DashboardUsersResponse extends PaginatedResponse<User> {}
export interface DashboardOrdersResponse extends PaginatedResponse<Order> {}
export interface DashboardEmailsResponse
  extends PaginatedResponse<EmailMetrics> {}

// Tipos para gráficas
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface SalesChartData {
  daily: ChartData;
  monthly: ChartData;
  byCategory: ChartData;
  byStatus: ChartData;
}

// Tipos para notificaciones del dashboard
export interface DashboardNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Tipos para configuración del dashboard
export interface DashboardConfig {
  itemsPerPage: number;
  defaultDateRange: number; // días
  autoRefresh: boolean;
  refreshInterval: number; // segundos
  theme: 'light' | 'dark' | 'system';
}
