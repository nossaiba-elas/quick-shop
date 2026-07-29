// frontend/src/components/ProductCard.tsx — Carte produit avec photo
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
  onOpenDetails: (product: Product) => void;
  language: 'fr' | 'en';
}

export function ProductCard({ product, onAddToCart, onOpenDetails, language }: ProductCardProps) {
  const isAvailable = product.stock > 0;
  const t = language === 'fr'
    ? {
        badge: 'Électronique',
        bestseller: 'Meilleure vente',
        inStock: 'En stock',
        outOfStock: 'Rupture',
        stockLabel: 'dispo',
        details: 'Détails',
        addToCart: 'Ajouter au panier',
        unavailable: 'Indisponible',
      }
    : {
        badge: 'Electronics',
        bestseller: 'Best seller',
        inStock: 'In stock',
        outOfStock: 'Out of stock',
        stockLabel: 'available',
        details: 'Details',
        addToCart: 'Add to cart',
        unavailable: 'Unavailable',
      };

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
        border: '1px solid #e5ebf5',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 18px 40px rgba(15, 23, 42, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.06)';
      }}
    >
      <div style={{ height: '220px', overflow: 'hidden', background: 'linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)', position: 'relative' }}>
        <img
          src={product.image_url || 'https://via.placeholder.com/400'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#111827', color: 'white', padding: '0.35rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>
          {t.badge}
        </div>
      </div>

      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t.bestseller}
          </span>
          <span style={{ fontSize: '0.75rem', color: isAvailable ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
            {isAvailable ? t.inStock : t.outOfStock}
          </span>
        </div>

        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#111827', lineHeight: 1.35 }}>
          {product.name}
        </h3>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, flex: 1 }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            ${product.price.toFixed(2)}
          </span>
          <span style={{ fontSize: '0.78rem', color: '#64748b', background: '#f1f5f9', padding: '0.25rem 0.55rem', borderRadius: '999px' }}>
            {product.stock} {t.stockLabel}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenDetails(product);
            }}
            style={{
              flex: 1,
              padding: '0.8rem 0.95rem',
              background: 'white',
              color: '#334155',
              border: '1px solid #dbe3f0',
              borderRadius: '999px',
              cursor: 'pointer',
              fontSize: '0.92rem',
              fontWeight: 700,
            }}
          >
            {t.details}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isAvailable) {
                onAddToCart(product.id);
              }
            }}
            disabled={!isAvailable}
            style={{
              flex: 1.3,
              padding: '0.8rem 0.95rem',
              background: isAvailable ? 'linear-gradient(135deg, #2563eb, #4f46e5)' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '999px',
              cursor: isAvailable ? 'pointer' : 'not-allowed',
              fontSize: '0.92rem',
              fontWeight: 700,
              transition: 'opacity 0.2s',
            }}
          >
            {isAvailable ? t.addToCart : t.unavailable}
          </button>
        </div>
      </div>
    </div>
  );
}