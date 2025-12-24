const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// 1. FOYDALANUVCHI (Do'kon egasi yoki Admin)
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }, // Ismi yoki Do'kon nomi
    phone: { type: DataTypes.STRING, unique: true, allowNull: false }, // Login o'rniga
    password: { type: DataTypes.STRING, allowNull: false },
    role: { 
        type: DataTypes.ENUM('super_admin', 'shop_admin', 'user'), 
        defaultValue: 'user' // Boshida 'user' bo'ladi, to'lov qilsa 'shop_admin' bo'ladi
    },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true } // Bloklash uchun
});

// 2. QARZDOR (Mijoz)
const Debtor = sequelize.define('Debtor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone1: { type: DataTypes.STRING, allowNull: false },
    phone2: { type: DataTypes.STRING }, // Qo'shimcha raqam
    passport_id: { type: DataTypes.STRING },
    total_debt: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 } // Umumiy qarzi
});

// 3. TRANZAKSIYA (Qarz olish/berish tarixi)
const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false }, // Summa
    type: { type: DataTypes.ENUM('debt', 'payment'), allowNull: false }, // 'debt'=qarz oldi, 'payment'=to'ladi
    description: { type: DataTypes.STRING }, // Nima oldi? (Un, Yog'...)
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// --- BOG'LANISHLAR (RELATIONS) ---

// Bir do'konda (User) ko'p qarzdor (Debtor) bo'lishi mumkin
User.hasMany(Debtor);
Debtor.belongsTo(User);

// Bir qarzdorda (Debtor) ko'p tranzaksiya (Transaction) bo'lishi mumkin
Debtor.hasMany(Transaction);
Transaction.belongsTo(Debtor);

module.exports = { sequelize, User, Debtor, Transaction };