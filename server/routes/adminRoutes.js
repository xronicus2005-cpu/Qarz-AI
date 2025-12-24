const express = require('express');
const router = express.Router();
const { getAllShops, toggleShopStatus, getSystemStats } = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');

// Middleware: Faqat Super Admin kira olsin
const checkSuperAdmin = (req, res, next) => {
    if (req.user.role === 'super_admin') {
        next();
    } else {
        res.status(403).json({ message: "Kirish taqiqlangan! Faqat Super Admin uchun." });
    }
};

router.use(verifyToken);
router.use(checkSuperAdmin);

router.get('/shops', getAllShops);       // Do'konlar ro'yxati
router.put('/shops/:id', toggleShopStatus); // Statusni o'zgartirish
router.get('/stats', getSystemStats);    // Umumiy statistika

module.exports = router;