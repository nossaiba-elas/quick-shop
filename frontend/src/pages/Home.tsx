// frontend/src/pages/Home.tsx — Page boutique e-commerce
import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { getProducts, createOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { Cart } from '../components/Cart';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CheckoutModal, CheckoutFormData } from '../components/CheckoutModal';

export function Home({ onRequireLogin, language }: { onRequireLogin?: () => void; language: 'fr' | 'en' }) {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const t = language === 'fr'
    ? {
        loading: 'Chargement des produits…',
        error: 'Impossible de charger les produits. Vérifiez que le backend tourne sur :5000.',
        heroBadge: 'Nouveau printemps 2026',
        heroTitle: 'Équipez votre quotidien avec les meilleurs tech produits',
        heroText: 'Découvrez des produits modernes, rapides et fiables — du bureau à la détente, livrés en quelques jours.',
        heroPrimary: 'Voir les produits',
        heroSecondary: 'En savoir plus',
        heroInfo: 'Livraison rapide et garantie sur tous nos articles.',
        promoTitle: 'Réduction de 15% sur les accessoires premium',
        promoButton: 'Profiter de l\'offre',
        promoLabel: 'Offre du moment',
        promoAlert: 'Offre appliquée : 15% de réduction sur les accessoires premium.',
        collectionLabel: 'Collection',
        collectionTitle: 'Nos produits du moment',
        searchPlaceholder: 'Rechercher un produit',
        articles: 'articles',
        addToCart: 'Ajouter au panier',
        unavailable: 'Indisponible',
        checkoutSuccess: '✅ Commande créée !\nN° {orderId}\nTotal : ${total}',
        checkoutError: '❌ Échec du paiement. Réessayez.',
        stat1: 'Livraison express',
        stat2: 'Produits certifiés',
        stat3: 'Satisfaction',
        footer: '© 2026 Quick Shop — Projet démo full-stack',
      }
    : {
        loading: 'Loading products…',
        error: 'Unable to load products. Make sure the backend is running on :5000.',
        heroBadge: 'New spring 2026',
        heroTitle: 'Equip your daily life with the best tech products',
        heroText: 'Discover modern, fast and reliable products — from work to leisure, delivered in just a few days.',
        heroPrimary: 'View products',
        heroSecondary: 'Learn more',
        heroInfo: 'Fast delivery and warranty on all our items.',
        promoTitle: '15% off premium accessories',
        promoButton: 'Claim the offer',
        promoLabel: 'Special offer',
        promoAlert: 'Offer applied: 15% off premium accessories.',
        collectionLabel: 'Collection',
        collectionTitle: 'Our featured products',
        searchPlaceholder: 'Search a product',
        articles: 'items',
        addToCart: 'Add to cart',
        unavailable: 'Unavailable',
        checkoutSuccess: '✅ Order created!\n# {orderId}\nTotal: ${total}',
        checkoutError: '❌ Checkout failed. Please try again.',
        stat1: 'Express delivery',
        stat2: 'Certified products',
        stat3: 'Satisfaction',
        footer: '© 2026 Quick Shop — Full-stack demo project',
      };

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  function handleAddToCart(productId: number) {
    const existing = cartItems.find((item) => item.product_id === productId);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { product_id: productId, quantity: 1 }]);
    }
  }

  function handleIncrement(productId: number) {
    setCartItems(
      cartItems.map((item) =>
        item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function handleDecrement(productId: number) {
    setCartItems((prev) => {
      const item = prev.find((i) => i.product_id === productId);
      if (!item) return prev;
      if (item.quantity === 1) {
        return prev.filter((i) => i.product_id !== productId);
      }
      return prev.map((i) =>
        i.product_id === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }

  function handleRemoveItem(productId: number) {
    setCartItems(cartItems.filter((item) => item.product_id !== productId));
  }

  const cartTotal = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    const name = (language === 'en' && product.name_en ? product.name_en : product.name).toLowerCase();
    const desc = (language === 'en' && product.description_en ? product.description_en : product.description).toLowerCase();
    return name.includes(query) || desc.includes(query);
  });

  function handleCheckout() {
    if (!isAuthenticated) {
      onRequireLogin?.();
      return;
    }
    if (cartItems.length === 0) {
      return;
    }
    setCheckoutTotal(cartTotal);
    setIsCheckoutOpen(true);
  }

  async function handleCheckoutSubmit(data: CheckoutFormData) {
    try {
      const result = await createOrder(cartItems);
      setCartItems([]);
      setIsCheckoutOpen(false);
      alert(t.checkoutSuccess.replace('{orderId}', String(result.orderId)).replace('{total}', `$${result.totalPrice.toFixed(2)}`));
    } catch (err) {
      alert(t.checkoutError);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fb', color: '#888' }}>
        {t.loading}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8f9ff 0%, #f4f6fb 100%)', fontFamily: 'Inter, -apple-system, sans-serif', color: '#1f2937' }}>
      {error && (
        <div style={{ background: '#fde8e8', color: '#c0392b', padding: '1rem 2rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #6366f1 100%)',
        color: 'white',
        padding: '3rem 2rem 4rem',
        boxShadow: 'inset 0 -80px 120px rgba(0,0,0,0.14)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '0.45rem 0.8rem', borderRadius: '999px', background: 'rgba(255,255,255,0.16)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {t.heroBadge}
            </div>
            <h2 style={{ margin: '0 0 0.8rem', fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 800, lineHeight: 1.1 }}>
              {t.heroTitle}
            </h2>
            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.7, opacity: 0.95, maxWidth: '620px' }}>
              {t.heroText}
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.4rem', flexWrap: 'wrap' }}>
              <button onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })} style={{ padding: '0.85rem 1.2rem', background: 'white', color: '#1d4ed8', border: 'none', borderRadius: '999px', fontWeight: 700, cursor: 'pointer' }}>
                {t.heroPrimary}
              </button>
              <button onClick={() => window.alert(t.heroInfo)} style={{ padding: '0.85rem 1.2rem', background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', fontWeight: 700, cursor: 'pointer' }}>
                {t.heroSecondary}
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '24px', padding: '1.3rem' }}>
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {[
                { label: t.stat1, value: '24h' },
                { label: t.stat2, value: '100%' },
                { label: t.stat3, value: '4.9/5' },
              ].map((item) => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,0.16)', borderRadius: '16px', padding: '0.9rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem', opacity: 0.95 }}>{item.label}</span>
                  <strong style={{ fontSize: '1rem' }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        <div>
          <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1d4ed8 100%)', color: 'white', borderRadius: '24px', padding: '1.2rem 1.25rem', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8 }}>{t.promoLabel}</p>
              <h3 style={{ margin: '0.3rem 0 0', fontSize: '1.1rem' }}>{t.promoTitle}</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                const target = document.getElementById('product-collection');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  window.scrollTo({ top: 700, behavior: 'smooth' });
                }
                window.alert(t.promoAlert);
              }}
              style={{ padding: '0.7rem 1rem', borderRadius: '999px', border: 'none', background: 'white', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer' }}
            >
              {t.promoButton}
            </button>
          </div>

          <div id="product-collection" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.collectionLabel}</p>
              <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.4rem', color: '#111827' }}>{t.collectionTitle}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                style={{ border: '1px solid #dbe3f0', borderRadius: '999px', padding: '0.7rem 0.95rem', minWidth: '220px', outline: 'none' }}
              />
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{filteredProducts.length} {t.articles}</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onOpenDetails={setSelectedProduct} language={language} />
            ))}
          </div>
        </div>

        <div style={{ position: 'sticky', top: '90px' }}>
          <Cart
            items={cartItems}
            products={products}
            onCheckout={handleCheckout}
            onRemoveItem={handleRemoveItem}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            language={language}
          />
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '2rem', color: '#6b7280', fontSize: '0.85rem' }}>
        {t.footer}
      </footer>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          language={language}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        language={language}
        total={checkoutTotal}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckoutSubmit}
      />
    </div>
  );
}