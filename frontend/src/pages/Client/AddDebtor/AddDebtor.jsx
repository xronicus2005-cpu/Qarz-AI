import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { toast } from 'react-toastify';
import styles from './AddDebtor.module.scss';

// Ikonkalar
import { FaUser, FaPhoneAlt, FaIdCard, FaUserPlus } from 'react-icons/fa';

const AddDebtor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone1: '+998', // Default kod
    phone2: '',
    passport_id: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Telefon raqam uzunligini oddiy tekshirish
    if (formData.phone1.length < 9) {
      toast.warning("Telefon raqamni to'liq kiriting!");
      setLoading(false);
      return;
    }

    try {
      await api.post('/debtors', formData);
      toast.success("Mijoz muvaffaqiyatli qo'shildi! 🎉");
      navigate('/debtors'); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* Header qismi */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <FaUserPlus />
          </div>
          <h2>Yangi Mijoz</h2>
          <p>Yangi qarzdorni ro'yxatga olish formasi</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* F.I.SH */}
          <div className={styles.inputGroup}>
            <label>To'liq ism (F.I.SH)</label>
            <div className={styles.inputWrapper}>
              <FaUser className={styles.icon} />
              <input 
                type="text" 
                name="full_name" 
                placeholder="Masalan: Ali Valiyev" 
                value={formData.full_name}
                onChange={handleChange} 
                autoFocus
                required 
              />
            </div>
          </div>

          {/* Telefon 1 */}
          <div className={styles.inputGroup}>
            <label>Telefon raqam (Asosiy)</label>
            <div className={styles.inputWrapper}>
              <FaPhoneAlt className={styles.icon} />
              <input 
                type="tel" 
                name="phone1" 
                placeholder="+998 90 123 45 67" 
                value={formData.phone1}
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Telefon 2 */}
          <div className={styles.inputGroup}>
            <label>Qo'shimcha telefon (Ixtiyoriy)</label>
            <div className={styles.inputWrapper}>
              <FaPhoneAlt className={styles.icon} />
              <input 
                type="tel" 
                name="phone2" 
                placeholder="+998..." 
                value={formData.phone2}
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* Pasport */}
          <div className={styles.inputGroup}>
            <label>Pasport ID (Ixtiyoriy)</label>
            <div className={styles.inputWrapper}>
              <FaIdCard className={styles.icon} />
              <input 
                type="text" 
                name="passport_id" 
                placeholder="AB1234567" 
                value={formData.passport_id}
                onChange={handleChange} 
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Saqlanmoqda..." : (
              <> <FaUserPlus /> Mijozni Qo'shish </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDebtor;