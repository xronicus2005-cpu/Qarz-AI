const { Debtor, Transaction, sequelize } = require('../models/index');
const { sendTestSMS } = require('../services/smsService');

// 1. Qarzdorlarni olish
exports.getMyDebtors = async (req, res) => {
    try {
        const debtors = await Debtor.findAll({ 
            where: { UserId: req.user.id },
            order: [['createdAt', 'DESC']] // Yangilar tepada
        });
        res.json(debtors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Yangi qarzdor qo'shish
exports.addDebtor = async (req, res) => {
    try {
        const { full_name, phone1, phone2, passport_id } = req.body;
        
        const newDebtor = await Debtor.create({
            full_name,
            phone1,
            phone2,
            passport_id,
            UserId: req.user.id
        });
        
        res.status(201).json(newDebtor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Tranzaksiya (Qarz yozish)
exports.addTransaction = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { debtorId, amount, type, description } = req.body;
        
        const debtor = await Debtor.findOne({ where: { id: debtorId, UserId: req.user.id } });
        if (!debtor) return res.status(404).json({ message: "Mijoz topilmadi" });

        let currentDebt = Number(debtor.total_debt);
        if (type === 'debt') currentDebt += Number(amount);
        else if (type === 'payment') currentDebt -= Number(amount);

        await Transaction.create({
            amount, type, description, DebtorId: debtorId
        }, { transaction: t });

        debtor.total_debt = currentDebt;
        await debtor.save({ transaction: t });

        await t.commit();

        // SMS yuborish (async)
        sendTestSMS(debtor.phone1)
            .then(() => console.log('SMS yuborildi'))
            .catch(err => console.error('SMS xato:', err.message));

        res.json({ message: "Bajarildi", new_balance: currentDebt });

    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};


// 4. Tarixni olish
exports.getDebtorHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const debtor = await Debtor.findOne({
            where: { id, UserId: req.user.id },
            include: [{ 
                model: Transaction, 
                order: [['createdAt', 'DESC']] 
            }]
        });

        if (!debtor) return res.status(404).json({ message: "Mijoz topilmadi" });

        res.json(debtor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. Statistika (Mana shu yetishmayotgan edi)
exports.getStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalCustomers = await Debtor.count({ 
            where: { UserId: userId } 
        });

        const totalDebtData = await Debtor.sum('total_debt', { 
            where: { UserId: userId } 
        });

        res.json({
            total_customers: totalCustomers,
            total_debt: totalDebtData || 0
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};