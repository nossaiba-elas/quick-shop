"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = void 0;
// src/db/database.ts — Connexion MySQL + création tables + seed
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
async function initDatabase() {
    const connection = await pool.getConnection();
    try {
        // 1) Produits
        await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // 2) Utilisateurs (créé avant orders car orders référence users)
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(191) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Migration: ajoute user_id aux tables orders existantes (base déjà créée sans la colonne)
        try {
            await connection.query(`ALTER TABLE orders ADD COLUMN user_id INT NULL`);
        }
        catch (e) { /* colonne déjà présente */ }
        // 3) Commandes (reliées à l'utilisateur)
        await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        total_price DECIMAL(10, 2) NOT NULL,
        user_id INT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
        // 4) Lignes de commande
        await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
        // Seed admin
        const [adminExists] = await connection.query('SELECT id FROM users WHERE email = ?', ['admin@quickshop.com']);
        if (adminExists.length === 0) {
            const hash = await bcryptjs_1.default.hash('admin123', 10);
            await connection.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', ['Admin', 'admin@quickshop.com', hash, 'admin']);
        }
        // Seed produits
        await connection.query(`
      INSERT IGNORE INTO products (id, name, price, description, image_url, stock)
      VALUES
        (1, 'Laptop Pro 15"', 999.99, 'Écran Retina 15", 16 Go RAM, SSD 512 Go. Performances professionnelles pour le dev et le design.', '/images/laptop.svg', 5),
        (2, 'Souris sans fil', 29.99, 'Ergonomique, sans fil, 2400 DPI. Confort et précision pour de longues journées de travail.', '/images/mouse.svg', 50),
        (3, 'Clavier mécanique', 79.99, 'Switchs mécaniques, rétroéclairage RGB, layout compact. Tactile et silencieux.', '/images/keyboard.svg', 20),
        (4, 'Écran 27" 4K', 349.99, 'Image ultra nette, HDMI, parfait pour le travail multimédia et le gaming.', '/images/monitor.svg', 12),
        (5, 'Casque audio pro', 129.99, 'Réduction de bruit, audio immersif et confort sur de longues sessions.', '/images/headset.svg', 18),
        (6, 'Smartphone X12', 699.99, 'Écran OLED, caméra triple, batterie longue durée et processeur rapide.', '/images/smartphone.svg', 9)
    `);
        console.log('✅ Database initialized successfully');
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
    }
    finally {
        connection.release();
    }
}
exports.initDatabase = initDatabase;
exports.default = pool;
