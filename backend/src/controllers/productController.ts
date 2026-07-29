// src/controllers/productController.ts — Logique métier pour les produits
import { Request, Response } from 'express';
import pool from '../db/database';

export async function getAllProducts(req: Request, res: Response) {
  try {
    const connection = await pool.getConnection();
    const [products] = await connection.query('SELECT * FROM products');
    connection.release();

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    const [productRows] = await connection.query<any[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    connection.release();

    if (!Array.isArray(productRows) || productRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: productRows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
    });
  }
}