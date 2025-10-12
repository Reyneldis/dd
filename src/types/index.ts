// src/types/index.ts

// Tipos para la base de datos de Prisma
export interface Category {
  id: string;
  categoryName: string;
  slug: string;
  mainImage: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  productName: string;
  price: number;
  stock: number;
  description: string | null;
  categoryId: string;
  features: string[] | null;
  status: 'ACTIVE' | 'INACTIVE';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: ProductImage[];
  _count?: {
    reviews: number;
    orderItems?: number;
  };
  // Agregar las propiedades faltantes
  rating?: number; // Calificación promedio del producto
  sold?: number; // Cantidad de unidades vendidas
  image?: string;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
    | 'REFUNDED'
    | 'FAILED';
  customerEmail?: string | null;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  user?: User | null;
  items: OrderItem[];
  contactInfo?: ContactInfo | null;
  shippingAddress?: ShippingAddress | null;
  customerName: string; // Obligatorio
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string | null;
}

export interface ContactInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  orderId: string;
}

export interface ShippingAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  orderId: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  createdAt: string;
  productName?: string | null;
  productSku?: string | null;
  product: Product;
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
export type OrdersResponse = PaginatedResponse<Order>;

export interface CartItem {
  // ID del item en la base de datos (opcional, para items que aún no se sincronizan)
  dbId?: string;
  // ID del producto
  id: string;
  productName: string;
  price: number;
  slug: string;
  image: string;
  quantity: number;

  // SKU del producto (opcional, puede que no siempre esté disponible)
  productSku?: string;
}
// === FIN DE LA DEFINICIÓN UNIFICADA ===

// ... (el resto de tu archivo types/index.ts)

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
    contactInfo?: {
      name: string;
      email: string;
      phone: string;
    } | null;
    shippingAddress?: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    } | null;
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
  whatsappLinks?: string[]; // Agregar esta propiedad
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  product: Product;
}

// Tipos para las respuestas de las APIs
export interface ApiResponse<T> {
  success: boolean; // <-- ¡AÑADE ESTA PROPIEDAD!
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

export interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  addresses: UserAddress[];
}

export interface UserAddress {
  id: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED'
    | 'FAILED';
  items: OrderItem[];
  total: number;
  shippingAddress?: ShippingAddress | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
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
  recentOrders: Order[];
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  monthlyGrowth: number;
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

// src/types/index.ts - Actualizar la interfaz FailedEmail

export interface FailedEmail {
  id: string;
  timestamp: string;
  type: string;
  recipient: string;
  orderId: string;
  status: 'sent' | 'failed' | 'retry' | 'pending';
  attempts: number; // Corregido: era "attempt" pero debería ser "attempts"
  error?: string;
  order?: {
    orderNumber: string;
  };
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
export type DashboardProductsResponse = PaginatedResponse<Product>;
export type DashboardCategoriesResponse = PaginatedResponse<Category>;
export type DashboardEmailsResponse = PaginatedResponse<EmailMetrics>;

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
