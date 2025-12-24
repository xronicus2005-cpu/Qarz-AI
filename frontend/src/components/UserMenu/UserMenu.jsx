import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './UserMenu.module.scss';
import api from '../../api/axios';
import { FaUserCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

// Default rasmni import qilamiz
import profileSuret from '../../assets/images/profil-adam.png';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  // DIQQAT: Boshlang'ich qiymat null bo'lsa ham kod buzilmaydigan qilamiz
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        // Agar ma'lumot kelsa o'rnatamiz, bo'lmasa null qoladi
        if (res.data) {
          setUser(res.data);
        }
      })
      .catch(err => {
        console.error("User info error:", err);
        // Xatolik bo'lsa, login sahifasiga haydash mumkin (ixtiyoriy)
        // navigate('/login'); 
      });
  }, []);

  const handleLogout = () => {
    if(window.confirm("Tizimdan chiqmoqchimisiz?")) {
      localStorage.clear();
      navigate('/login');
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Rasm URLini aniqlash (XAVFSIZ USUL)
  const getAvatarUrl = () => {
    // 1. Agar user hali yuklanmagan bo'lsa (null bo'lsa) -> Default
    if (!user) return profileSuret;

    // 2. Agar user bor va uning avatari bo'lsa -> Backend URL
    if (user.avatar) {
      return `http://localhost:5000/${user.avatar.replace(/\\/g, '/')}`;
    }
    
    // 3. Boshqa holatda -> Default
    return profileSuret;
  };

  return (
    <div className={styles.menuWrapper} ref={menuRef}>
      
      {/* Trigger Button */}
      <button className={styles.triggerBtn} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.userInfo}>
          {/* BU YERDA XATO BOR EDI: user.name o'rniga user?.name ishlatamiz */}
          <span className={styles.name}>{user?.name || "Foydalanuvchi"}</span>
          <span className={styles.shop}>{user?.shop_name || "Do'kon"}</span>
        </div>
        
        <img 
          src={getAvatarUrl()} 
          alt="Avatar" 
          className={styles.avatar}
          onError={(e) => { e.target.src = profileSuret }} 
        />
        
        <FaChevronDown size={12} color="#6b7280" />
      </button>

      {/* Dropdown */}
      <div className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}>
        <Link to="/profile" className={styles.menuItem} onClick={() => setIsOpen(false)}>
          <FaUserCog /> Sozlamalar
        </Link>
        <button onClick={handleLogout} className={`${styles.menuItem} ${styles.logout}`}>
          <FaSignOutAlt /> Chiqish
        </button>
      </div>

    </div>
  );
};

export default UserMenu;