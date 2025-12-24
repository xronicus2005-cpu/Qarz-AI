const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// 1. FOYDALANUVCHI (Do'kon egasi yoki Admin)
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false }, // 'name' o'rniga 'username' ishlatganmiz login paytida, tekshirib oling
    phone: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { 
        type: DataTypes.ENUM('super_admin', 'shop_admin', 'user'), 
        defaultValue: 'user' 
    },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    avatar: { type: DataTypes.STRING },
    shop_name: { type: DataTypes.STRING },
    
    // 🔥 YANGI: Obuna tugash vaqti
    subscription_end_date: { type: DataTypes.DATE }
});

// 2. QARZDOR (Mijoz)
const Debtor = sequelize.define('Debtor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone1: { type: DataTypes.STRING, allowNull: false },
    phone2: { type: DataTypes.STRING },
    passport_id: { type: DataTypes.STRING },
    total_debt: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 }
});

// 3. TRANZAKSIYA (Tarix)
const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    type: { type: DataTypes.ENUM('debt', 'payment'), allowNull: false },
    description: { type: DataTypes.STRING },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// --- RELATIONS ---
User.hasMany(Debtor);
Debtor.belongsTo(User);

Debtor.hasMany(Transaction);
Transaction.belongsTo(Debtor);

module.exports = { sequelize, User, Debtor, Transaction };