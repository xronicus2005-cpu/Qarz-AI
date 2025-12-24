const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Rasm yuklash uchun
const { verifyToken } = require('../middleware/authMiddleware'); // Himoya uchun

// Barcha kerakli funksiyalarni BITTA qatorda import qilamiz
const { 
    register, 
    login, 
    getMe, 
    updateProfile, 
    changePassword 
} = require('../controllers/authController');

// --- OCHIQ YO'LLAR (Public) ---
router.post('/register', register);
router.post('/login', login);

// --- HIMOYA QILINGAN YO'LLAR (Private - Token kerak) ---
router.get('/me', verifyToken, getMe); // O'zi haqida ma'lumot
router.put('/update', verifyToken, upload.single('avatar'), updateProfile); // Profilni yangilash
router.put('/password', verifyToken, changePassword); // Parolni o'zgartirish

module.exports = router;