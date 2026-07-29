// src/middleware/adminMiddleware.ts — Restreint l'accès aux admins
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from './authMiddleware';

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  authMiddleware(req, res, () => {
    if ((req as any).user?.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    next();
  });
}