const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/index');

const authRoutes = require('./routes/authRoutes');
const debtRoutes = require('./routes/debtRoutes');
const adminRoutes = require('./routes/adminRoutes');

// 🔥 YANGI: Admin sozlamasini import qilamiz
const setupSuperAdmin = require('./utils/adminSetup'); 

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/debtors', debtRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }) 
    .then(async () => { // async qo'shildi
        console.log('Bazaga ulanish muvaffaqiyatli!');
        
        // 🔥 YANGI: Server yonganda adminni tekshirish/yaratish
        await setupSuperAdmin(); 

        app.listen(PORT, () => {
            console.log(`Server ${PORT}-portda ishga tushdi.`);
        });
    })
    .catch(err => {
        console.error('Xatolik yuz berdi:', err);
    });