// src/routes/admin.ts — Routes admin
import { Router } from 'express';
import { createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus } from '../controllers/adminController';

const router = Router();

// Produits
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Commandes
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;