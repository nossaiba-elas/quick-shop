"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.getMyOrders = exports.createOrder = void 0;
const database_1 = __importDefault(require("../db/database"));
// POST /api/orders — crée une commande pour l'utilisateur authentifié
async function createOrder(req, res) {
    try {
        const userId = req.user.id;
        const { items } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Panier vide' });
        }
        const connection = await database_1.default.getConnection();
        try {
            let totalPrice = 0;
            for (const item of items) {
                const [product] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
                if (Array.isArray(product) && product.length > 0) {
                    totalPrice += product[0].price * item.quantity;
                }
            }
            const [orderResult] = await connection.query('INSERT INTO orders (total_price, user_id) VALUES (?, ?)', [totalPrice, userId]);
            const orderId = orderResult.insertId;
            for (const item of items) {
                const [product] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
                if (Array.isArray(product) && product.length > 0) {
                    await connection.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, item.product_id, item.quantity, product[0].price]);
                }
            }
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                orderId,
                totalPrice,
            });
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
exports.createOrder = createOrder;
// GET /api/orders — commandes de l'utilisateur authentifié (espace client)
async function getMyOrders(req, res) {
    try {
        const userId = req.user.id;
        const [orders] = await database_1.default.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        const orderRows = orders;
        if (orderRows.length === 0) {
            return res.json({ data: [] });
        }
        const [items] = await database_1.default.query(`SELECT oi.*, p.name AS product_name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id IN (?)`, [orderRows.map((o) => o.id)]);
        const result = orderRows.map((o) => ({
            ...o,
            items: items.filter((it) => it.order_id === o.id),
        }));
        res.json({ data: result });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
    }
}
exports.getMyOrders = getMyOrders;
// GET /api/orders/:id — détail d'une commande (limitée à son propriétaire)
async function getOrderById(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const connection = await database_1.default.getConnection();
        const [order] = await connection.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, userId]);
        if (Array.isArray(order) && order.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        const [items] = await connection.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
        connection.release();
        res.json({
            success: true,
            data: { order: order[0], items },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching order' });
    }
}
exports.getOrderById = getOrderById;
