import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './AdminLayout.module.scss';
import { FaChartPie, FaStore, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if(window.confirm("Admin panelidan chiqasizmi?")) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path ? `${styles.menuItem} ${styles.active}` : styles.menuItem;

  return (
    <div className={styles.layoutWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <FaUserShield size={28} />
          <span>Super Admin</span>
        </div>

        <nav className={styles.menu}>
          <Link to="/admin" className={isActive('/admin')}>
            <FaChartPie size={20} /> <span>Statistika</span>
          </Link>
          <Link to="/admin/shops" className={isActive('/admin/shops')}>
            <FaStore size={20} /> <span>Do'konlar</span>
          </Link>
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <FaSignOutAlt size={20} /> <span>Chiqish</span>
        </button>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;