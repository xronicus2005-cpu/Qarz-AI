const jwt = require('jsonwebtoken');

// 1. Token borligini va to'g'riligini tekshirish
const verifyToken = (req, res, next) => {

    const tokenHeader = req.headers['authorization'];
    
    // Token yo'q bo'lsa
    if (!tokenHeader) {
        return res.status(403).json({ message: "Token topilmadi (Kirish kerak)" });
    }

    try {
        // "Bearer kjdkajsdkjas..." dan faqat kodni ajratib olish
        const token = tokenHeader.split(" ")[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'maxfiy_kalit');
        req.user = decoded; // User ma'lumotlarini keyingi bosqichga o'tkazish
        next();
    } catch (err) {
        return res.status(401).json({ message: "Yaroqsiz token (Qaytadan kiring)" });
    }
};

// 2. Ruxsatni tekshirish (Role Check)
const checkAccess = (req, res, next) => {
    const { role } = req.user;
    const method = req.method; // GET, POST, DELETE...

    // Super Admin va Shop Admin (To'lov qilgan) hamma narsa qila oladi
    if (role === 'super_admin' || role === 'shop_admin') {
        return next();
    }

    // Oddiy User (to'lov qilmagan) faqat o'qiy oladi (GET)
    if (role === 'user') {
        if (method === 'GET') {
            return next();
        } else {
            return res.status(403).json({ 
                message: "Sizda ma'lumot kiritish yoki o'chirish huquqi yo'q. To'lov qiling!" 
            });
        }
    }
    
    // Boshqa holatlar uchun
    return res.status(403).json({ message: "Ruxsat yo'q" });
};

module.exports = { verifyToken, checkAccess };