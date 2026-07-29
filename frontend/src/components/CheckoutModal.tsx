import React, { useEffect, useState } from 'react';

export interface CheckoutFormData {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  address: string;
  city: string;
  postalCode: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  language: 'fr' | 'en';
  total: number;
  onClose: () => void;
  onSubmit: (data: CheckoutFormData) => Promise<void>;
}

const emptyForm = (): CheckoutFormData => ({
  cardholderName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  address: '',
  city: '',
  postalCode: '',
});

export function CheckoutModal({ isOpen, language, total, onClose, onSubmit }: CheckoutModalProps) {
  const [form, setForm] = useState<CheckoutFormData>(emptyForm());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm(emptyForm());
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const t = language === 'fr'
    ? {
        title: 'Finaliser la commande',
        subtitle: 'Payez en toute sécurité avec votre carte.',
        cardholder: 'Nom sur la carte',
        cardNumber: 'Numéro de carte',
        expiry: 'MM/AA',
        cvv: 'CVV',
        address: 'Adresse',
        city: 'Ville',
        postalCode: 'Code postal',
        pay: 'Payer maintenant',
        cancel: 'Annuler',
        total: 'Total à payer',
        secure: 'Paiement sécurisé SSL',
      }
    : {
        title: 'Complete your order',
        subtitle: 'Pay securely with your card.',
        cardholder: 'Cardholder name',
        cardNumber: 'Card number',
        expiry: 'MM/YY',
        cvv: 'CVV',
        address: 'Address',
        city: 'City',
        postalCode: 'Postal code',
        pay: 'Pay now',
        cancel: 'Cancel',
        total: 'Amount due',
        secure: 'Secure SSL payment',
      };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  }

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
        padding: '1rem',
        zIndex: 1200,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'white',
          borderRadius: '24px',
          padding: '1.4rem',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <div>
            <h3 style={{ margin: 0, color: '#111827' }}>{t.title}</h3>
            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.92rem' }}>{t.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.8rem' }}>
          <div style={{ display: 'grid', gap: '0.45rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>{t.cardholder}</label>
            <input required value={form.cardholderName} onChange={(e) => setForm({ ...form, cardholderName: e.target.value })} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gap: '0.45rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>{t.cardNumber}</label>
            <input required inputMode="numeric" value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })} style={inputStyle} placeholder="4242 4242 4242 4242" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div style={{ display: 'grid', gap: '0.45rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>{t.expiry}</label>
              <input required value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} style={inputStyle} placeholder="12/28" />
            </div>
            <div style={{ display: 'grid', gap: '0.45rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>{t.cvv}</label>
              <input required value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })} style={inputStyle} placeholder="123" />
            </div>
          </div>

          <div style={{ display: 'grid', gap: '0.45rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>{t.address}</label>
            <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div style={{ display: 'grid', gap: '0.45rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>{t.city}</label>
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gap: '0.45rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>{t.postalCode}</label>
              <input required value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginTop: '0.2rem', background: '#f8fafc', padding: '0.8rem 1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#334155', fontWeight: 700 }}>{t.total}</span>
            <strong style={{ color: '#111827' }}>${total.toFixed(2)}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.84rem' }}>{t.secure}</span>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button type="button" onClick={onClose} style={{ padding: '0.8rem 1rem', border: '1px solid #dbe3f0', borderRadius: '999px', background: 'white', color: '#334155', cursor: 'pointer', fontWeight: 700 }}>
                {t.cancel}
              </button>
              <button type="submit" disabled={loading} style={{ padding: '0.8rem 1rem', border: 'none', borderRadius: '999px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
                {loading ? (language === 'fr' ? 'Traitement…' : 'Processing…') : t.pay}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '0.75rem 0.85rem',
  border: '1px solid #dbe3f0',
  borderRadius: '999px',
  fontSize: '0.95rem',
  outline: 'none',
};
