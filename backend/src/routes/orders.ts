// src/routes/orders.ts — Routes API pour les commandes (auth requise)
import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getOrderById);

export default router;