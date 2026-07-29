import { normalizeProduct, normalizeOrder } from './api';

describe('api normalization', () => {
  it('converts string prices and stock to numbers for products', () => {
    const normalized = normalizeProduct({
      id: 1,
      name: 'Laptop',
      price: '999.99',
      description: 'Great laptop',
      image_url: 'img.png',
      stock: '5',
    } as any);

    expect(normalized.price).toBe(999.99);
    expect(normalized.stock).toBe(5);
  });

  it('converts order totals and item prices to numbers', () => {
    const normalized = normalizeOrder({
      id: 10,
      total_price: '42.50',
      created_at: '2026-01-01T00:00:00.000Z',
      items: [{ id: 1, price: '12.50', quantity: '2' }],
    } as any);

    expect(normalized.total_price).toBe(42.5);
    expect(normalized.items[0].price).toBe(12.5);
    expect(normalized.items[0].quantity).toBe(2);
  });
});
