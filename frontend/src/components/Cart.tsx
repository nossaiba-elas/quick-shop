// frontend/src/components/Cart.tsx — Panier avec boutons +/− de quantité
import React from 'react';
import { CartItem, Product } from '../types';

interface CartProps {
  items: CartItem[];
  products: Product[];
  onCheckout: () => void;
  onRemoveItem: (productId: number) => void;
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  language: 'fr' | 'en';
}

export function Cart({ items, products, onCheckout, onRemoveItem, onIncrement, onDecrement, language }: CartProps) {
  const t = language === 'fr'
    ? {
        emptyTitle: 'Votre panier est vide',
        emptyText: 'Ajoutez des produits pour commencer votre commande',
        title: 'Mon panier',
        unit: '/ unité',
        total: 'Total',
        checkout: 'Passer la commande →',
        remove: 'Retirer',
      }
    : {
        emptyTitle: 'Your cart is empty',
        emptyText: 'Add products to start your order',
        title: 'My cart',
        unit: '/ unit',
        total: 'Total',
        checkout: 'Checkout →',
        remove: 'Remove',
      };
  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  if (items.length === 0) {
    return (
      <div style={{ border: '1px solid #e5ebf5', padding: '2.4rem 1.5rem', borderRadius: '20px', textAlign: 'center', color: '#64748b', background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛒</div>
        <p style={{ margin: 0, fontWeight: 700, color: '#111827' }}>{t.emptyTitle}</p>
        <p style={{ margin: '0.45rem 0 0', fontSize: '0.9rem' }}>{t.emptyText}</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #e5ebf5', borderRadius: '22px', overflow: 'hidden', background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)', boxShadow: '0 12px 34px rgba(15, 23, 42, 0.08)' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e5ebf5', fontWeight: 800, fontSize: '1.05rem', color: '#111827', background: 'rgba(37, 99, 235, 0.04)' }}>
        {t.title} ({items.reduce((s, i) => s + i.quantity, 0)})
      </div>

      <div>
        {items.map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          if (!product) return null;
          return (
            <div key={item.product_id} style={{ display: 'flex', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
              <img
                src={product.image_url || 'https://via.placeholder.com/80'}
                alt={product.name}
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>${product.price.toFixed(2)}{t.unit}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f5f5f5', borderRadius: '20px', padding: '0.15rem' }}>
                <button
                  onClick={() => onDecrement(item.product_id)}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: '#333' }}
                >−</button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                <button
                  onClick={() => onIncrement(item.product_id)}
                  disabled={item.quantity >= product.stock}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: item.quantity >= product.stock ? '#ddd' : 'white', cursor: item.quantity >= product.stock ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '1rem', color: '#333' }}
                >+</button>
              </div>

              <div style={{ minWidth: '70px', textAlign: 'right', fontWeight: 700, fontSize: '0.95rem', color: '#16213e' }}>
                ${(product.price * item.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => onRemoveItem(item.product_id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: '1.1rem', padding: '0.2rem' }}
                aria-label={t.remove}
              >✕</button>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '1.25rem', background: 'linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.05rem' }}>
          <span style={{ fontWeight: 700, color: '#334155' }}>{t.total}</span>
          <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#0f172a' }}>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          style={{
            width: '100%',
            padding: '0.95rem',
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            color: 'white',
            border: 'none',
            borderRadius: '999px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 700,
            boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)',
          }}
        >
          {t.checkout}
        </button>
      </div>
    </div>
  );
}