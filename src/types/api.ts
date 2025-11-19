// src/types/api.ts
import { Category, EmailMetrics, Order, Product, User } from './index';

// Interfaz genérica para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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

// Alias para respuestas específicas
export type UsersResponse = PaginatedResponse<User>;
export type ProductsResponse = PaginatedResponse<Product>;
export type CategoriesResponse = PaginatedResponse<Category>;
export type OrdersResponse = PaginatedResponse<Order>;
export type EmailsResponse = PaginatedResponse<EmailMetrics>;
