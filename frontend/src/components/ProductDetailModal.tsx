import React from 'react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  language: 'fr' | 'en';
  onClose: () => void;
  onAddToCart: (productId: number) => void;
}

export function ProductDetailModal({ product, language, onClose, onAddToCart }: ProductDetailModalProps) {
  if (!product) return null;

  const isAvailable = product.stock > 0;
  const t = language === 'fr'
    ? {
        title: 'Détails du produit',
        stock: 'En stock',
        outOfStock: 'Rupture',
        price: 'Prix',
        addToCart: 'Ajouter au panier',
        close: 'Fermer',
        availability: 'Disponibilité',
      }
    : {
        title: 'Product details',
        stock: 'In stock',
        outOfStock: 'Out of stock',
        price: 'Price',
        addToCart: 'Add to cart',
        close: 'Close',
        availability: 'Availability',
      };

  const handleAdd = () => {
    onAddToCart(product.id);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '900px',
          background: 'white',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)',
          display: 'grid',
          gridTemplateColumns: '1fr 0.95fr',
        }}
      >
        <div style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.image_url || 'https://via.placeholder.com/600'}
            alt={product.name}
            style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '18px' }}
          />
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t.title}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.15rem' }}
              aria-label={t.close}
            >
              ×
            </button>
          </div>

          <div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', color: '#111827' }}>{product.name}</h3>
            <p style={{ margin: 0, color: '#64748b', lineHeight: 1.7 }}>{product.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <div style={{ background: '#f8fafc', borderRadius: '999px', padding: '0.45rem 0.8rem', color: '#334155', fontWeight: 700 }}>
              {t.availability}: {isAvailable ? t.stock : t.outOfStock}
            </div>
            <div style={{ background: '#eff6ff', borderRadius: '999px', padding: '0.45rem 0.8rem', color: '#1d4ed8', fontWeight: 700 }}>
              {t.price}: ${product.price.toFixed(2)}
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAdd();
              }}
              disabled={!isAvailable}
              style={{
                padding: '0.84rem 1rem',
                border: 'none',
                borderRadius: '999px',
                background: isAvailable ? 'linear-gradient(135deg, #2563eb, #4f46e5)' : '#cbd5e1',
                color: 'white',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                flex: 1,
              }}
            >
              {isAvailable ? t.addToCart : t.outOfStock}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              style={{
                padding: '0.84rem 1rem',
                border: '1px solid #dbe3f0',
                borderRadius: '999px',
                background: 'white',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
