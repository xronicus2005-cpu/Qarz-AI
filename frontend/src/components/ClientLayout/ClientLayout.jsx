import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaChartPie, FaUserPlus, FaUsers, FaStore } from 'react-icons/fa';
import styles from './ClientLayout.module.scss'; 
import UserMenu from '../UserMenu/UserMenu';

const ClientLayout = () => {
  const location = useLocation();

  // Faol klassni berish funksiyasi
  const isActive = (path) => {
    return location.pathname === path 
      ? `${styles.navItem} ${styles.active}` 
      : styles.navItem;
  };

  return (
    <div className={styles.layoutWrapper}>
      {/* --- NAVBAR --- */}
      <header className={styles.navbar}>
        <div className={`container ${styles.navbarContent}`}>
          
          {/* Logo */}
          <div className={styles.logoSection}>
            <FaStore className={styles.logoIcon} />
            <span className={styles.logoText}>Qarz Daftar</span>
          </div>

          {/* Menyu */}
          <nav className={styles.navLinks}>
            <Link to="/" className={isActive('/')}>
              <FaChartPie /> <span>Statistika</span>
            </Link>
            <Link to="/add-debtor" className={isActive('/add-debtor')}>
              <FaUserPlus /> <span>Qarzdor qo'shish</span>
            </Link>
            <Link to="/debtors" className={isActive('/debtors')}>
              <FaUsers /> <span>Ro'yxat</span>
            </Link>
          </nav>

          {/* User Menu (Ichida Logout bor) */}
          <div className={styles.userSection}>
             <UserMenu /> 
          </div>

        </div>
      </header>

      {/* --- KONTENT --- */}
      <main className={`container ${styles.mainContent}`}>
        <div className={styles.contentCard}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;