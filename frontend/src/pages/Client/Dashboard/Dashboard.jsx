import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import styles from './Dashboard.module.scss';
// Ikonkalar
import { FaUsers, FaMoneyBillWave, FaClock, FaExclamationTriangle, FaCheckCircle, FaLock } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_customers: 0,
    total_debt: 0,
    subscription_end: null,
    role: 'user'
  });
  const [loading, setLoading] = useState(true);

  // Ma'lumotni olish
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/debtors/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Dashboard API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- KUNLARNI HISOBLASH ---
  const calculateDaysLeft = (endDate) => {
    if (!endDate) return 0;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft(stats.subscription_end);
  const isPremium = stats.role === 'shop_admin'; // To'lov qilganmi?

  // --- OBUNA STATUSINI ANIQLASH ---
  let statusConfig = {
    color: styles.gray,
    icon: <FaLock />,
    text: "Bloklangan (To'lov qiling)",
    dateText: "Muddati: Noma'lum"
  };

  if (isPremium) {
    if (daysLeft > 5) {
      statusConfig = {
        color: styles.green,
        icon: <FaCheckCircle />,
        text: `${daysLeft} kun qoldi`,
        dateText: `Tugash sanasi: ${new Date(stats.subscription_end).toLocaleDateString('uz-UZ')}`
      };
    } else if (daysLeft > 0) {
      statusConfig = {
        color: styles.orange,
        icon: <FaClock />,
        text: `${daysLeft} kun qoldi (Oz qoldi!)`,
        dateText: `Tugash sanasi: ${new Date(stats.subscription_end).toLocaleDateString('uz-UZ')}`
      };
    } else {
      statusConfig = {
        color: styles.red,
        icon: <FaExclamationTriangle />,
        text: "Muddat tugadi!",
        dateText: "Iltimos, to'lov qiling"
      };
    }
  }

  if (loading) {
    return <div className={styles.loadingWrapper}>Yuklanmoqda...</div>;
  }

  return (
    <div className={styles.dashboard}>
      
      {/* Sarlavha */}
      <div className={styles.header}>
        <h2>Do'kon Statistikasi</h2>
        <p>Umumiy moliyaviy holat va mijozlar tahlili</p>
      </div>

      <div className={styles.statsGrid}>
        
        {/* 1. JAMI QARZ */}
        <div className={styles.card}>
          <div className={`${styles.iconBox} ${styles.red}`}>
            <FaMoneyBillWave />
          </div>
          <div className={styles.info}>
            <h3>Umumiy qarz miqdori</h3>
            <span className={styles.value}>
              {Number(stats.total_debt).toLocaleString()} so'm
            </span>
            <span className={styles.subText}>Tashqaridagi pullar</span>
          </div>
        </div>

        {/* 2. MIJOZLAR SONI */}
        <div className={styles.card}>
          <div className={`${styles.iconBox} ${styles.blue}`}>
            <FaUsers />
          </div>
          <div className={styles.info}>
            <h3>Mijozlar soni</h3>
            <span className={styles.value}>
              {stats.total_customers} ta
            </span>
            <span className={styles.subText}>Ro'yxatga olinganlar</span>
          </div>
        </div>

        {/* 3. OBUNA HOLATI */}
        <div className={styles.card}>
          <div className={`${styles.iconBox} ${statusConfig.color}`}>
            {statusConfig.icon}
          </div>
          <div className={styles.info}>
            <h3>Obuna holati</h3>
            <span className={styles.value} style={{ fontSize: '1.4rem' }}>
              {statusConfig.text}
            </span>
            <span className={styles.subText}>
              {statusConfig.dateText}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;