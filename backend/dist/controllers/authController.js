"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../db/database"));
const JWT_SECRET = process.env.JWT_SECRET || 'quickshop_secret_dev';
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const [existing] = await database_1.default.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Cet email est déjà utilisé' });
        }
        const hash = await bcryptjs_1.default.hash(password, 10);
        const [result] = await database_1.default.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, email, hash, 'user']);
        const userId = result.insertId;
        const token = jsonwebtoken_1.default.sign({ id: userId, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: userId, name, email, role: 'user' } });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
}
exports.register = register;
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const [users] = await database_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];
        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        const valid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
}
exports.login = login;
async function me(req, res) {
    res.json({ user: req.user });
}
exports.me = me;
