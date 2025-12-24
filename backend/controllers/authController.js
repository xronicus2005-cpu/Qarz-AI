const { User } = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs'); // Rasm o'chirish uchun kerak

// 1. REGISTRATSIYA
exports.register = async (req, res) => {
    try {
        const { name, phone, password, shop_name } = req.body;
        
        const oldUser = await User.findOne({ where: { phone } });
        if (oldUser) {
            return res.status(400).json({ message: "Bu raqam band!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: name, 
            phone, 
            password: hashedPassword,
            shop_name
        });

        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            process.env.JWT_SECRET || 'maxfiy_kalit',
            { expiresIn: '24h' }
        );

        res.status(201).json({ message: "Muvaffaqiyatli!", token, user: newUser });

    } catch (error) {
        console.error("Register Xatosi:", error);
        res.status(500).json({ error: error.message });
    }
};

// 2. KIRISH (LOGIN)
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ where: { phone } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Xato telefon yoki parol" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'maxfiy_kalit',
            { expiresIn: '24h' }
        );

        res.json({ message: "Xush kelibsiz!", token, role: user.role });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. MEN HAQIMDA (GET ME) - YANGI
exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } 
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. PROFILNI YANGILASH - YANGI
exports.updateProfile = async (req, res) => {
    try {
        const { name, shop_name } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) return res.status(404).json({ message: "User topilmadi" });

        // Rasm yuklansa
        if (req.file) {
            // Eski rasmni o'chirish
            if (user.avatar && fs.existsSync(user.avatar)) {
                try { fs.unlinkSync(user.avatar); } catch(e) {}
            }
            user.avatar = req.file.path;
        }

        user.name = name || user.name;
        user.shop_name = shop_name || user.shop_name;

        await user.save();
        res.json({ message: "Profil yangilandi", user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. PAROLNI O'ZGARTIRISH - YANGI
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Eski parol noto'g'ri" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Parol muvaffaqiyatli o'zgartirildi" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};