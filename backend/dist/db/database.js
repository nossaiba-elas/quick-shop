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
        name_en VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        description_en TEXT,
        image_url VARCHAR(500),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Migration: add name_en and description_en if missing
        try {
            await connection.query(`ALTER TABLE products ADD COLUMN name_en VARCHAR(255)`);
        }
        catch (e) { }
        try {
            await connection.query(`ALTER TABLE products ADD COLUMN description_en TEXT`);
        }
        catch (e) { }
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
      INSERT IGNORE INTO products (id, name, name_en, price, description, description_en, image_url, stock)
      VALUES
        (1, 'Laptop Pro 15"', 'Laptop Pro 15"', 999.99, 'Écran Retina 15", 16 Go RAM, SSD 512 Go. Performances professionnelles pour le dev et le design.', 'Retina 15" display, 16GB RAM, 512GB SSD. Professional performance for development and design.', '/images/laptop.svg', 5),
        (2, 'Souris sans fil', 'Wireless Mouse', 29.99, 'Ergonomique, sans fil, 2400 DPI. Confort et précision pour de longues journées de travail.', 'Ergonomic, wireless, 2400 DPI. Comfort and precision for long working days.', '/images/mouse.svg', 50),
        (3, 'Clavier mécanique', 'Mechanical Keyboard', 79.99, 'Switchs mécaniques, rétroéclairage RGB, layout compact. Tactile et silencieux.', 'Mechanical switches, RGB backlight, compact layout. Tactile and quiet.', '/images/keyboard.svg', 20),
        (4, 'Écran 27" 4K', '27" 4K Monitor', 349.99, 'Image ultra nette, HDMI, parfait pour le travail multimédia et le gaming.', 'Ultra sharp image, HDMI, perfect for multimedia work and gaming.', '/images/monitor.svg', 12),
        (5, 'Casque audio pro', 'Pro Audio Headset', 129.99, 'Réduction de bruit, audio immersif et confort sur de longues sessions.', 'Noise cancellation, immersive audio and comfort for long sessions.', '/images/headset.svg', 18),
        (6, 'Smartphone X12', 'Smartphone X12', 699.99, 'Écran OLED, caméra triple, batterie longue durée et processeur rapide.', 'OLED display, triple camera, long battery life and fast processor.', '/images/smartphone.svg', 9)
    `);
        // Update existing rows that have null name_en / description_en
        await connection.query(`UPDATE products SET name_en = 'Laptop Pro 15"', description_en = 'Retina 15" display, 16GB RAM, 512GB SSD. Professional performance for development and design.' WHERE id = 1 AND name_en IS NULL`);
        await connection.query(`UPDATE products SET name_en = 'Wireless Mouse', description_en = 'Ergonomic, wireless, 2400 DPI. Comfort and precision for long working days.' WHERE id = 2 AND name_en IS NULL`);
        await connection.query(`UPDATE products SET name_en = 'Mechanical Keyboard', description_en = 'Mechanical switches, RGB backlight, compact layout. Tactile and quiet.' WHERE id = 3 AND name_en IS NULL`);
        await connection.query(`UPDATE products SET name_en = '27" 4K Monitor', description_en = 'Ultra sharp image, HDMI, perfect for multimedia work and gaming.' WHERE id = 4 AND name_en IS NULL`);
        await connection.query(`UPDATE products SET name_en = 'Pro Audio Headset', description_en = 'Noise cancellation, immersive audio and comfort for long sessions.' WHERE id = 5 AND name_en IS NULL`);
        await connection.query(`UPDATE products SET name_en = 'Smartphone X12', description_en = 'OLED display, triple camera, long battery life and fast processor.' WHERE id = 6 AND name_en IS NULL`);
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
