const express = require('express');
const router = express.Router();

// 5 ta funksiyani import qilamiz
const { 
    getMyDebtors, 
    addDebtor, 
    addTransaction, 
    getDebtorHistory, 
    getStats // <--- Bu albatta bo'lishi kerak
} = require('../controllers/debtController');

const { verifyToken, checkAccess } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.use(checkAccess);

// Route-lar
router.get('/', getMyDebtors);
router.post('/', addDebtor);
router.post('/transaction', addTransaction);

// DIQQAT: /stats har doim /:id dan TEPADA turishi shart!
router.get('/stats', getStats); 

router.get('/:id', getDebtorHistory);

module.exports = router;