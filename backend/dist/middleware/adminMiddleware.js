"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const authMiddleware_1 = require("./authMiddleware");
function adminMiddleware(req, res, next) {
    (0, authMiddleware_1.authMiddleware)(req, res, () => {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
        }
        next();
    });
}
exports.adminMiddleware = adminMiddleware;
