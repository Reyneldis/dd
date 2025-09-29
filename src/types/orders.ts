// types/order.ts
export interface OrderItemInput {
  slug: string;
  price: number;
  quantity: number;
  productName?: string;
  name?: string;
}

export interface ProductValidation {
  id: string;
  slug: string;
  productName: string;
  price: number; // Cambiar a number para comparación directa
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ValidationResult {
  valid: boolean;
  products: Record<string, ProductValidation>;
}

export interface OrderItemSummary {
  productName: string;
  quantity: number;
  price: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export interface OrderForWhatsApp {
  id: string;
  orderNumber: string;
  total: number;
  contactInfo?: ContactInfo | null;
  shippingAddress?: ShippingAddress | null;
  items: OrderItemSummary[];
}
