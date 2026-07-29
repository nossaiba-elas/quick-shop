"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const database_1 = __importDefault(require("../db/database"));
// --- PRODUITS ---
async function createProduct(req, res) {
    try {
        const { name, price, description, image_url, stock } = req.body;
        const [result] = await database_1.default.query('INSERT INTO products (name, price, description, image_url, stock) VALUES (?, ?, ?, ?, ?)', [name, price, description, image_url, stock]);
        res.status(201).json({ message: 'Produit créé', productId: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du produit' });
    }
}
exports.createProduct = createProduct;
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, price, description, image_url, stock } = req.body;
        await database_1.default.query('UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, stock = ? WHERE id = ?', [name, price, description, image_url, stock, id]);
        res.json({ message: 'Produit mis à jour' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
}
exports.updateProduct = updateProduct;
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        await database_1.default.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Produit supprimé' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
}
exports.deleteProduct = deleteProduct;
// --- COMMANDES ---
async function getAllOrders(_req, res) {
    try {
        const [orders] = await database_1.default.query(`
      SELECT o.*, u.name AS customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
        const [items] = await database_1.default.query(`
      SELECT oi.*, p.name AS product_name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
    `);
        const ordersWithItems = orders.map((order) => ({
            ...order,
            items: items.filter((item) => item.order_id === order.id),
        }));
        res.json({ data: ordersWithItems });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
}
exports.getAllOrders = getAllOrders;
async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await database_1.default.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Statut mis à jour' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
}
exports.updateOrderStatus = updateOrderStatus;
