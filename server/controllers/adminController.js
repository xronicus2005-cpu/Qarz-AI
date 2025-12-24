const { User, Debtor, sequelize } = require('../models/index');

// 1. Barcha do'konlarni olish
exports.getAllShops = async (req, res) => {
    try {
        // Hamma userlarni olamiz (faqat super_admin o'zi ko'rinmasin)
        const shops = await User.findAll({
            where: { role: ['user', 'shop_admin'] },
            attributes: { exclude: ['password'] }, // Parolni ko'rsatmaslik uchun
            order: [['createdAt', 'DESC']]
        });
        res.json(shops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Do'kon statusini o'zgartirish (Aktivlashtirish / Bloklash)
exports.toggleShopStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active' (shop_admin) yoki 'inactive' (user)

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "Do'kon topilmadi" });

        // Rolini o'zgartiramiz
        if (status === 'active') {
            user.role = 'shop_admin'; // To'liq ruxsat (To'lov qilgan)
        } else {
            user.role = 'user'; // Faqat o'qish (To'lov qilmagan/Bloklangan)
        }

        await user.save();
        res.json({ message: "Status o'zgartirildi", new_role: user.role });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Umumiy Tizim Statistikasi
exports.getSystemStats = async (req, res) => {
    try {
        const totalShops = await User.count({ where: { role: ['shop_admin', 'user'] } });
        const totalDebtors = await Debtor.count();
        const totalMoney = await Debtor.sum('total_debt');

        res.json({
            shops: totalShops,
            debtors: totalDebtors,
            money: totalMoney || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};