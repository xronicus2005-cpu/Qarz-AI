import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import styles from './AdminDashboard.module.scss';
import { FaStore, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ shops: 0, debtors: 0, money: 0 });

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2 className={styles.title}>Tizim Statistikasi</h2>
      <div className={styles.statsGrid}>
        <div className={`${styles.card} ${styles.blue}`}>
          <div className={styles.icon}><FaStore /></div>
          <div className={styles.info}>
            <h3>Jami Do'konlar</h3>
            <p>{stats.shops}</p>
          </div>
        </div>
        <div className={`${styles.card} ${styles.purple}`}>
          <div className={styles.icon}><FaUsers /></div>
          <div className={styles.info}>
            <h3>Jami Qarzdorlar</h3>
            <p>{stats.debtors}</p>
          </div>
        </div>
        <div className={`${styles.card} ${styles.green}`}>
          <div className={styles.icon}><FaMoneyBillWave /></div>
          <div className={styles.info}>
            <h3>Aylanma (Qarz)</h3>
            <p>{Number(stats.money).toLocaleString()} so'm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;