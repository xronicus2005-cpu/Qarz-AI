const { User } = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, phone, password } = req.body; // 'username' o'rniga 'name' deb yozdik modelda
        
        // 1. Telefon raqam band emasmi?
        const oldUser = await User.findOne({ where: { phone } });
        if (oldUser) {
            return res.status(400).json({ message: "Bu raqam allaqachon bor!" });
        }

        // 2. Parolni shifrlash
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Yaratish
        const newUser = await User.create({
            name, 
            phone, 
            password: hashedPassword
        });

        // 4. Token berish
        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            process.env.JWT_SECRET || 'maxfiy_kalit',
            { expiresIn: '24h' }
        );

        res.status(201).json({ message: "Muvaffaqiyatli!", token, user: newUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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