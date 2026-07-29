// src/controllers/orderController.ts — Commandes reliées à l'utilisateur authentifié
import { Request, Response } from 'express';
import pool from '../db/database';

// POST /api/orders — crée une commande pour l'utilisateur authentifié
export async function createOrder(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Panier vide' });
    }

    const connection = await pool.getConnection();
    try {
      let totalPrice = 0;
      for (const item of items) {
        const [product] = await connection.query(
          'SELECT price FROM products WHERE id = ?',
          [item.product_id]
        );
        if (Array.isArray(product) && product.length > 0) {
          totalPrice += (product[0] as any).price * item.quantity;
        }
      }

      const [orderResult] = await connection.query(
        'INSERT INTO orders (total_price, user_id) VALUES (?, ?)',
        [totalPrice, userId]
      );
      const orderId = (orderResult as any).insertId;

      for (const item of items) {
        const [product] = await connection.query(
          'SELECT price FROM products WHERE id = ?',
          [item.product_id]
        );
        if (Array.isArray(product) && product.length > 0) {
          await connection.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [orderId, item.product_id, item.quantity, (product[0] as any).price]
          );
        }
      }

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        orderId,
        totalPrice,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// GET /api/orders — commandes de l'utilisateur authentifié (espace client)
export async function getMyOrders(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    const orderRows = orders as any[];
    if (orderRows.length === 0) {
      return res.json({ data: [] });
    }
    const [items] = await pool.query(
      `SELECT oi.*, p.name AS product_name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id IN (?)`,
      [orderRows.map((o) => o.id)]
    );
    const result = orderRows.map((o) => ({
      ...o,
      items: (items as any[]).filter((it) => it.order_id === o.id),
    }));
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
}

// GET /api/orders/:id — détail d'une commande (limitée à son propriétaire)
export async function getOrderById(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const connection = await pool.getConnection();

    const [order] = await connection.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (Array.isArray(order) && order.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const [items] = await connection.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    connection.release();

    res.json({
      success: true,
      data: { order: (order as any)[0], items },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order' });
  }
}