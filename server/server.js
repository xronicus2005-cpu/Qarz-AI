const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/index');

// 1. Route fayllarini chaqirib olish
const authRoutes = require('./routes/authRoutes');
const debtRoutes = require('./routes/debtRoutes'); // <--- MANA SHU QATOR YETISHMAYOTGAN EDI
const adminRoutes = require('./routes/adminRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 2. Route-larni serverga ulash
app.use('/api/auth', authRoutes);
app.use('/api/debtors', debtRoutes); // <--- MANA SHU QATOR HAM YETISHMAYOTGAN EDI
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

// Bazani yangilash va serverni yoqish
sequelize.sync({ alter: true }) 
    .then(() => {
        console.log('Bazaga ulanish muvaffaqiyatli!');
        app.listen(PORT, () => {
            console.log(`Server ${PORT}-portda ishga tushdi.`);
        });
    })
    .catch(err => {
        console.error('Xatolik yuz berdi:', err);
    });