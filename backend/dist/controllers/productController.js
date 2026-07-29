"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getAllProducts = void 0;
const database_1 = __importDefault(require("../db/database"));
async function getAllProducts(req, res) {
    try {
        const connection = await database_1.default.getConnection();
        const [products] = await connection.query('SELECT * FROM products');
        connection.release();
        res.json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
exports.getAllProducts = getAllProducts;
async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const connection = await database_1.default.getConnection();
        const [productRows] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
        });
    }
}
exports.getProductById = getProductById;
