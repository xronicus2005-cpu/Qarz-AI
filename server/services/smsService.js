const axios = require('axios');

// 1. Token olish
async function getToken() {
    try {
        const response = await axios.post('https://notify.eskiz.uz/api/auth/login', null, {
            params: {
                email: process.env.ESKIZ_EMAIL,
                password: process.env.ESKIZ_PASSWORD
            }
        });

        // Tokenni qaytaradi
        return response.data.data.token;
    } catch (err) {
        console.error('Token olish xatosi:', err.response?.data || err.message);
        throw err;
    }
}

// 2. SMS yuborish
exports.sendTestSMS = async (phone) => {
    try {
        const token = await getToken();

        const response = await axios.post(
            'https://notify.eskiz.uz/api/message/sms/send',
            {
                mobile_phone: phone,
                message: 'Bu Eskiz dan test'  // test rejimi uchun ruxsat berilgan matn
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (err) {
        console.error('SMS yuborish xatosi:', err.response?.data || err.message);
        throw err;
    }
};
