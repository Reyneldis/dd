export interface CartItem {
  quantity: number;
  price: number;
  slug: string;
  productName: string;
  productSku: string;
  total: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

export interface OrderItem extends CartItem {
  id: string;
  orderId: string;
  productId: string;
  createdAt: Date;
}
