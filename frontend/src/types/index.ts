// frontend/src/types/index.ts — Interfaces TypeScript partagées (selon le guide)
export interface Product {
  id: number;
  name: string;
  name_en?: string;
  price: number;
  description: string;
  description_en?: string;
  image_url: string | null;
  stock: number;
}

export interface CartItem {
  product_id: number;
  quantity: number;
}

export interface Order {
  id: number;
  total_price: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}