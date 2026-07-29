"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/products.ts — Routes API pour les produits
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
router.get('/', productController_1.getAllProducts);
router.get('/:id', productController_1.getProductById);
exports.default = router;
