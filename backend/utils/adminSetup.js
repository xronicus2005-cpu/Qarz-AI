const { User } = require('../models/index');
const bcrypt = require('bcryptjs');

const setupSuperAdmin = async () => {
    try {
        const adminExists = await User.findOne({ 
            where: { role: 'super_admin' } 
        });

        if (adminExists) {
            console.log("👍 Super Admin bazada mavjud.");
            return;
        }

        const adminName = "Super Admin";
        const adminPhone = "918709559"; 
        const adminPassword = "9559";   

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            username: adminName, // <-- O'ZGARTIRILDI (name -> username)
            phone: adminPhone,
            password: hashedPassword,
            role: 'super_admin',
            shop_name: 'Main System',
            is_active: true
        });

        // console.log("✅ Default Super Admin yaratildi!");
        // console.log(`📞 Login: ${adminPhone}`);
        // console.log(`🔑 Parol: ${adminPassword}`);

    } catch (err) {
        console.error("Super Admin yaratishda xatolik:", err);
    }
};

module.exports = setupSuperAdmin;