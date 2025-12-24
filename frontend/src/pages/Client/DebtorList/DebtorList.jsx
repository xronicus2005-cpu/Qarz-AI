import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import styles from './DebtorList.module.scss';
import DebtorModal from '../../../components/DebtorModal/DebtorModal'; // <-- Yangi import

const DebtorList = () => {
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal uchun state
  const [selectedDebtor, setSelectedDebtor] = useState(null);

  // Bazadan ma'lumot olish funksiyasi
  const fetchDebtors = async () => {
    try {
      const res = await api.get('/debtors');
      setDebtors(res.data);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtors();
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: '20px'}}>Yuklanmoqda...</div>;

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <h2>Mijozlar Ro'yxati</h2>
        <span style={{color: '#6b7280'}}>Jami: {debtors.length} ta</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>F.I.SH</th>
              <th>Telefon</th>
              <th>Qarzi (So'm)</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {debtors.length > 0 ? (
              debtors.map((item) => (
                <tr key={item.id}>
                  <td>{item.full_name}</td>
                  <td>{item.phone1}</td>
                  <td className={Number(item.total_debt) > 0 ? styles.debt : styles.noDebt}>
                    {Number(item.total_debt).toLocaleString()} so'm
                  </td>
                  <td>
                    {/* Tugma bosilganda statega o'sha odamni yuklaymiz */}
                    <button 
                      className={styles.actionBtn}
                      onClick={() => setSelectedDebtor(item)}
                    >
                      Harakat
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>
                  Hozircha mijozlar yo'q. Yangi qo'shing!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL --- */}
      {/* Agar selectedDebtor bor bo'lsa, Modalni ko'rsatamiz */}
      {selectedDebtor && (
        <DebtorModal 
          debtor={selectedDebtor} 
          onClose={() => setSelectedDebtor(null)} // Yopish uchun stateni tozalaymiz
          onUpdate={fetchDebtors} // O'zgarish bo'lsa ro'yxatni yangilaymiz
        />
      )}

    </div>
  );
};

export default DebtorList;