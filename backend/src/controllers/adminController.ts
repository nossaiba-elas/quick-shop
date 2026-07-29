// src/controllers/adminController.ts — Logique admin : CRUD produits + gestion commandes
import { Request, Response } from 'express';
import pool from '../db/database';

// --- PRODUITS ---
export async function createProduct(req: Request, res: Response) {
  try {
    const { name, price, description, image_url, stock } = req.body;
    const [result] = await pool.query(
      'INSERT INTO products (name, price, description, image_url, stock) VALUES (?, ?, ?, ?, ?)',
      [name, price, description, image_url, stock]
    );
    res.status(201).json({ message: 'Produit créé', productId: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, price, description, image_url, stock } = req.body;
    await pool.query(
      'UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, stock = ? WHERE id = ?',
      [name, price, description, image_url, stock, id]
    );
    res.json({ message: 'Produit mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
}

// --- COMMANDES ---
export async function getAllOrders(_req: Request, res: Response) {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, u.name AS customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    const [items] = await pool.query(`
      SELECT oi.*, p.name AS product_name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
    `);
    const ordersWithItems = (orders as any[]).map((order) => ({
      ...order,
      items: (items as any[]).filter((item) => item.order_id === order.id),
    }));
    res.json({ data: ordersWithItems });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Statut mis à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
}