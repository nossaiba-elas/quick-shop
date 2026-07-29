"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/orders.ts — Routes API pour les commandes (auth requise)
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authMiddleware, orderController_1.createOrder);
router.get('/', authMiddleware_1.authMiddleware, orderController_1.getMyOrders);
router.get('/:id', authMiddleware_1.authMiddleware, orderController_1.getOrderById);
exports.default = router;
