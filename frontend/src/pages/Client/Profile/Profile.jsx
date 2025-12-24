import { useState, useEffect } from 'react';
import styles from './Profile.module.scss';
import api from '../../../api/axios';
import { toast } from 'react-toastify';
import { FaUserEdit, FaLock, FaCamera, FaSave } from 'react-icons/fa';

// Default rasmni import qilamiz
import profileSuret from '../../../assets/images/profil-adam.png';

const Profile = () => {
  const [user, setUser] = useState({ name: '', shop_name: '', avatar: null });
  const [password, setPassword] = useState({ current: '', new: '' });
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // User ma'lumotlarini olish
  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        // Backenddan kelgan ma'lumotni to'g'ridan-to'g'ri olamiz
        // Agar avatar bo'lmasa, u null yoki "" keladi
        setUser(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Rasm tanlanganda (Preview yaratish)
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // Profilni yangilash
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('shop_name', user.shop_name);
    
    // Agar yangi rasm tanlangan bo'lsa, uni ham qo'shamiz
    if (file) {
      formData.append('avatar', file);
    }

    try {
      await api.put('/auth/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Ma'lumotlar saqlandi!");
      
      // 1 sekunddan keyin qayta yuklash (Navbar rasmi ham yangilanishi uchun)
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Parolni yangilash
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/password', {
        currentPassword: password.current,
        newPassword: password.new
      });
      toast.success("Parol muvaffaqiyatli o'zgartirildi!");
      setPassword({ current: '', new: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik");
    }
  };

  // --- RASM MANTIQI (Tuzatilgan) ---
  const getDisplayImage = () => {
    // 1. Agar hozir rasm tanlagan bo'lsa (Preview)
    if (preview) {
      return preview;
    }
    
    // 2. Agar Backendda rasm bo'lsa (null yoki bo'sh emasligini tekshiramiz)
    if (user.avatar) {
      // Windowsdagi \ ni / ga aylantiramiz va to'liq URL yasaymiz
      return `http://localhost:5000/${user.avatar.replace(/\\/g, '/')}`;
    }

    // 3. Agar hech narsa bo'lmasa -> Default rasm
    return profileSuret;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2>Sozlamalar</h2>
        <p>Shaxsiy ma'lumotlar va xavfsizlik sozlamalari</p>
      </div>

      <div className={styles.grid}>
        
        {/* 1. Chap taraf - Profil Tahrirlash */}
        <div className={styles.card}>
          <h3><FaUserEdit /> Profil ma'lumotlari</h3>
          
          <form onSubmit={handleUpdateProfile}>
            <div className={styles.avatarSection}>
              <div className={styles.imageWrapper}>
                <img 
                  src={getDisplayImage()} 
                  alt="Avatar" 
                  // Agar backenddagi rasm serverdan o'chib ketgan bo'lsa (404), default rasmni qo'yadi
                  onError={(e) => { 
                    e.target.onerror = null; // Cheksiz loopni oldini olish
                    e.target.src = profileSuret; 
                  }} 
                />
                <label className={styles.editIcon} title="Rasmni o'zgartirish">
                  <FaCamera />
                  <input type="file" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Ismingiz</label>
              <input 
                type="text" 
                value={user.name || ''} // Agar name null kelsa, bo'sh qator bo'lsin
                onChange={(e) => setUser({...user, name: e.target.value})} 
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Do'kon nomi</label>
              <input 
                type="text" 
                value={user.shop_name || ''} 
                onChange={(e) => setUser({...user, shop_name: e.target.value})} 
                required
              />
            </div>

            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? "Saqlanmoqda..." : <><FaSave /> Saqlash</>}
            </button>
          </form>
        </div>

        {/* 2. O'ng taraf - Parol */}
        <div className={styles.card}>
          <h3><FaLock /> Xavfsizlik</h3>
          
          <form onSubmit={handleChangePassword}>
            <div className={styles.formGroup}>
              <label>Joriy parol</label>
              <input 
                type="password" 
                placeholder="********"
                value={password.current}
                onChange={(e) => setPassword({...password, current: e.target.value})}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Yangi parol</label>
              <input 
                type="password" 
                placeholder="********"
                value={password.new}
                onChange={(e) => setPassword({...password, new: e.target.value})}
                required
              />
            </div>

            <button type="submit" className={styles.saveBtn}>Parolni yangilash</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;