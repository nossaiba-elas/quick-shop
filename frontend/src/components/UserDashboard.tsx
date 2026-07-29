// frontend/src/components/UserDashboard.tsx — Espace client : historique de commandes
import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';

export function UserDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Chargement…</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Mes commandes</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed #ddd', borderRadius: '12px', color: '#888' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
          <p style={{ margin: 0 }}>Vous n'avez pas encore passé de commande.</p>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <strong>Commande #{o.id}</strong>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <span style={statusBadge(o.status || 'pending')}>{statusLabel(o.status || 'pending')}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(o.items || []).map((it: any) => {
                const price = Number(it.price ?? 0);
                const quantity = Number(it.quantity ?? 0);
                const lineTotal = Number.isFinite(price) && Number.isFinite(quantity) ? price * quantity : 0;

                return (
                  <div key={it.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <img src={it.image_url || ''} alt={it.product_name || 'Produit'} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{it.product_name || 'Produit'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>Quantité : {quantity} × ${price.toFixed(2)}</div>
                    </div>
                    <div style={{ fontWeight: 700 }}>${lineTotal.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0f0f0', textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>Total : </span>
              <strong style={{ fontSize: '1.2rem', color: '#16213e' }}>${Number(o.total_price ?? 0).toFixed(2)}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function statusLabel(s: string) {
  return { pending: 'En attente', processing: 'En traitement', shipped: 'Expédiée', delivered: 'Livrée' }[s] || s;
}
function statusBadge(s: string): React.CSSProperties {
  const colors: Record<string, string> = { pending: '#f39c12', processing: '#3498db', shipped: '#9b59b6', delivered: '#27ae60' };
  return { padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'white', background: colors[s] || '#888' };
}