const multer = require('multer');
const path = require('path');

// Faylni qayerga va qanday nom bilan saqlash
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // uploads papkasiga saqlaydi
    },
    filename: (req, file, cb) => {
        // Nomi: user-ID-vaqt.jpg
        cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Faqat rasm qabul qilish
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Faqat rasm yuklash mumkin!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;