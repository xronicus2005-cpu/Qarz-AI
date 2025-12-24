const express = require('express');
const router = express.Router();

// DIQQAT: Hammasini BITTA qatorda import qilish kerak
const { 
    getMyDebtors, 
    addDebtor, 
    addTransaction, 
    getDebtorHistory, 
    getStats 
} = require('../controllers/debtController');

const { verifyToken, checkAccess } = require('../middleware/authMiddleware');

// 1. Himoya (Token va Rol)
router.use(verifyToken);
router.use(checkAccess);

// 2. Route-lar
router.get('/', getMyDebtors);           // Ro'yxat
router.post('/', addDebtor);             // Qo'shish
router.post('/transaction', addTransaction); // Qarz yozish/to'lash

// ⚠️ MUHIM: /stats har doim /:id dan TEPADA turishi kerak!
router.get('/stats', getStats);          // Statistika (Yangi)

router.get('/:id', getDebtorHistory);    // Tarix (ID bo'yicha)

module.exports = router;