// frontend/src/components/AdminDashboard.tsx — Tableau de bord admin
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts, createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus } from '../services/api';

const EMPTY = { name: '', price: '', description: '', image_url: '', stock: '' };

export function AdminDashboard({ language }: { language: 'fr' | 'en' }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState<any>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const t = language === 'fr'
    ? {
        title: 'Tableau de bord admin',
        products: 'Produits',
        orders: 'Commandes',
        addTitle: 'Ajouter un produit',
        editTitle: 'Modifier le produit',
        name: 'Nom',
        price: 'Prix',
        stock: 'Stock',
        image: 'Image',
        description: 'Description',
        create: 'Créer',
        update: 'Mettre à jour',
        cancel: 'Annuler',
        uploadHint: 'Sélectionnez une image depuis votre ordinateur',
        preview: 'Aperçu',
        noOrders: 'Aucune commande pour le moment.',
        order: 'Commande',
        client: 'Client',
        total: 'Total',
        pending: 'En attente',
        processing: 'En traitement',
        shipped: 'Expédiée',
        delivered: 'Livrée',
      }
    : {
        title: 'Admin dashboard',
        products: 'Products',
        orders: 'Orders',
        addTitle: 'Add a product',
        editTitle: 'Edit product',
        name: 'Name',
        price: 'Price',
        stock: 'Stock',
        image: 'Image',
        description: 'Description',
        create: 'Create',
        update: 'Update',
        cancel: 'Cancel',
        uploadHint: 'Select an image from your computer',
        preview: 'Preview',
        noOrders: 'No orders yet.',
        order: 'Order',
        client: 'Client',
        total: 'Total',
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
      };

  async function load() {
    setProducts(await getProducts());
    setOrders(await getAllOrders());
  }
  useEffect(() => { load(); }, []);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setForm((prev: any) => ({ ...prev, image_url: result }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      description: form.description,
      image_url: form.image_url,
      stock: parseInt(form.stock),
    };
    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await createProduct(payload);
    }
    setForm(EMPTY);
    setEditingId(null);
    load();
  }

  function startEdit(p: Product) {
    setForm({ name: p.name, price: String(p.price), description: p.description, image_url: p.image_url || '', stock: String(p.stock) });
    setEditingId(p.id);
  }

  async function handleDelete(id: number) {
    if (window.confirm('Supprimer ce produit ?')) {
      await deleteProduct(id);
      load();
    }
  }

  async function handleStatus(orderId: number, status: string) {
    await updateOrderStatus(orderId, status);
    load();
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>{t.title}</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setTab('products')} style={tabBtn(tab === 'products')}>{t.products}</button>
        <button onClick={() => setTab('orders')} style={tabBtn(tab === 'orders')}>{t.orders}</button>
      </div>

      {tab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
          {/* Formulaire */}
          <form onSubmit={handleSubmit} style={card}>
            <h3 style={{ marginTop: 0 }}>{editingId ? t.editTitle : t.addTitle}</h3>
            {(['name', 'price', 'stock', 'image_url', 'description'] as const).map((field) => (
              <div key={field} style={{ marginBottom: '0.6rem' }}>
                <label style={labelStyle}>{field === 'name' ? t.name : field === 'price' ? t.price : field === 'stock' ? t.stock : field === 'image_url' ? t.image : t.description}</label>
                {field === 'description' ? (
                  <textarea style={inputStyle} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required />
                ) : field === 'image_url' ? (
                  <div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ ...inputStyle, padding: '0.4rem' }} />
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>{t.uploadHint}</div>
                    {form.image_url && <img src={form.image_url} alt={t.preview} style={{ width: '100%', maxHeight: '130px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem' }} />}
                  </div>
                ) : (
                  <input style={inputStyle} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required />
                )}
              </div>
            ))}
            <button type="submit" style={primaryBtn}>{editingId ? t.update : t.create}</button>
            {editingId && <button type="button" onClick={() => { setForm(EMPTY); setEditingId(null); }} style={{ ...primaryBtn, background: '#666', marginLeft: '0.5rem' }}>{t.cancel}</button>}
          </form>

          {/* Liste */}
          <div style={card}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  <th style={th}>Produit</th><th style={th}>Prix</th><th style={th}>Stock</th><th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={td}>
                      <img src={p.image_url ?? ''} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                      {p.name}
                    </td>
                    <td style={td}>${p.price.toFixed(2)}</td>
                    <td style={td}>{p.stock}</td>
                    <td style={td}>
                      <button onClick={() => startEdit(p)} style={smallBtn}>✏️</button>
                      <button onClick={() => handleDelete(p.id)} style={{ ...smallBtn, color: '#e74c3c' }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div style={card}>
          {orders.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center' }}>{t.noOrders}</p>
          ) : orders.map((o) => (
            <div key={o.id} style={{ borderBottom: '1px solid #f0f0f0', padding: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>{t.order} #{o.id}</strong>
                <span>{o.customer_name ? `${t.client} : ${o.customer_name} · ` : ''}{new Date(o.created_at).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                {o.items.map((it: any) => `${it.product_name} ×${it.quantity} ($${it.price})`).join(' · ')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{t.total} : ${Number(o.total_price).toFixed(2)}</span>
                <select value={o.status || 'pending'} onChange={(e) => handleStatus(o.id, e.target.value)} style={inputStyle}>
                  <option value="pending">{t.pending}</option>
                  <option value="processing">{t.processing}</option>
                  <option value="shipped">{t.shipped}</option>
                  <option value="delivered">{t.delivered}</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const card: React.CSSProperties = { background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', padding: '1.5rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' };
const primaryBtn: React.CSSProperties = { padding: '0.6rem 1rem', background: 'linear-gradient(135deg, #4361ee, #3a0ca3)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 };
const smallBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem 0.4rem' };
const th: React.CSSProperties = { padding: '0.5rem', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' };
const td: React.CSSProperties = { padding: '0.6rem 0.5rem', fontSize: '0.9rem' };
const tabBtn = (active: boolean): React.CSSProperties => ({ padding: '0.5rem 1.2rem', background: active ? '#16213e' : '#eee', color: active ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 });