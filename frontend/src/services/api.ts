// frontend/src/services/api.ts — Appels au backend (avec admin + commandes)
import axios from 'axios';
import { Product, CartItem, Order, OrderItem } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function asNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeProduct(product: Partial<Product> & Record<string, unknown>): Product {
  return {
    id: asNumber(product.id, 0),
    name: typeof product.name === 'string' ? product.name : 'Produit',
    name_en: typeof product.name_en === 'string' ? product.name_en : undefined,
    price: asNumber(product.price, 0),
    description: typeof product.description === 'string' ? product.description : '',
    description_en: typeof product.description_en === 'string' ? product.description_en : undefined,
    image_url: typeof product.image_url === 'string' ? product.image_url : null,
    stock: asNumber(product.stock, 0),
  };
}

export function normalizeOrder<T extends { total_price?: unknown; items?: Array<{ price?: unknown; quantity?: unknown }> }>(order: T): T & { total_price: number; items: Array<{ price: number; quantity: number }> } {
  return {
    ...order,
    total_price: asNumber(order.total_price, 0),
    items: (order.items || []).map((item) => ({
      ...item,
      price: asNumber(item.price, 0),
      quantity: asNumber(item.quantity, 0),
    })),
  } as T & { total_price: number; items: Array<{ price: number; quantity: number }> };
}

const api = axios.create({ baseURL: API_BASE_URL });

// Attache automatiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// --- Produits ---
export async function getProducts(): Promise<Product[]> {
  const response = await api.get('/products');
  return (response.data.data || []).map(normalizeProduct);
}

export async function getProductById(id: number): Promise<Product> {
  const response = await api.get(`/products/${id}`);
  return normalizeProduct(response.data.data);
}

// --- Commandes (client) ---
export async function createOrder(items: CartItem[]): Promise<{ orderId: number; totalPrice: number }> {
  const response = await api.post('/orders', { items });
  return { orderId: response.data.orderId, totalPrice: response.data.totalPrice };
}

export async function getOrderById(id: number): Promise<{ order: Order; items: OrderItem[] }> {
  const response = await api.get(`/orders/${id}`);
  return response.data.data;
}

// Commandes de l'utilisateur connecté (espace client)
export async function getMyOrders(): Promise<any[]> {
  const response = await api.get('/orders');
  return (response.data.data || []).map(normalizeOrder);
}

export async function getAllOrders(): Promise<any[]> {
  const response = await api.get('/admin/orders');
  return (response.data.data || []).map(normalizeOrder);
}

// --- Admin : produits ---
export async function createProduct(product: Omit<Product, 'id'>): Promise<void> {
  await api.post('/admin/products', product);
}

export async function updateProduct(id: number, product: Omit<Product, 'id'>): Promise<void> {
  await api.put(`/admin/products/${id}`, product);
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/admin/products/${id}`);
}

// --- Admin : statut commande ---
export async function updateOrderStatus(id: number, status: string): Promise<void> {
  await api.patch(`/admin/orders/${id}/status`, { status });
}