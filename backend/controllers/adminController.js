const { User, Debtor, sequelize } = require('../models/index');

// 1. Barcha do'konlarni olish
exports.getAllShops = async (req, res) => {
    try {
        const shops = await User.findAll({
            where: { role: ['user', 'shop_admin'] },
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(shops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Do'kon statusini o'zgartirish (Aktivlashtirish + 30 kun berish)
exports.toggleShopStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "Do'kon topilmadi" });

        if (status === 'active') {
            user.role = 'shop_admin';
            
            // 🔥 YANGI: Bugundan boshlab 30 kun qo'shamiz
            const today = new Date();
            const nextMonth = new Date(today.setDate(today.getDate() + 30));
            user.subscription_end_date = nextMonth;
            
        } else {
            user.role = 'user'; // Bloklanganda vaqt o'chmaydi, lekin kirish cheklanadi
        }

        await user.save();
        res.json({ message: "Status yangilandi", new_role: user.role });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Umumiy Statistika
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