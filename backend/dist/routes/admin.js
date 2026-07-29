"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin.ts — Routes admin
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
// Produits
router.post('/products', adminController_1.createProduct);
router.put('/products/:id', adminController_1.updateProduct);
router.delete('/products/:id', adminController_1.deleteProduct);
// Commandes
router.get('/orders', adminController_1.getAllOrders);
router.patch('/orders/:id/status', adminController_1.updateOrderStatus);
exports.default = router;
