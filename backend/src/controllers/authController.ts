// src/controllers/authController.ts — Inscription, connexion, profil
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/database';

const JWT_SECRET = process.env.JWT_SECRET || 'quickshop_secret_dev';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hash, 'user']
    );
    const userId = (result as any).insertId;
    const token = jwt.sign({ id: userId, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, name, email, role: 'user' } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = (users as any[])[0];
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
}

export async function me(req: Request, res: Response) {
  res.json({ user: (req as any).user });
}