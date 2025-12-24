import { useState, useEffect } from 'react';
import styles from './DebtorModal.module.scss';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FaTimes, FaHistory, FaPlus, FaMinus } from "react-icons/fa";

const DebtorModal = ({ debtor, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('debt');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  
  // 🔥 YANGI STATE: Balansni jonli yangilash uchun
  const [currentDebt, setCurrentDebt] = useState(debtor.total_debt);

  const [formData, setFormData] = useState({
    amount: '',
    description: ''
  });

  // Agar tashqaridan debtor o'zgarsa, balansni ham yangilash
  useEffect(() => {
    setCurrentDebt(debtor.total_debt);
  }, [debtor]);

  // Tarixni yuklash
  useEffect(() => {
    fetchHistory();
  }, [debtor.id]);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/debtors/${debtor.id}`);
      setHistory(res.data.Transactions || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount) return toast.warning("Summa kiritilmadi!");

    setLoading(true);
    try {
      // Backendga so'rov
      const res = await api.post('/debtors/transaction', {
        debtorId: debtor.id,
        amount: formData.amount,
        type: activeTab,
        description: formData.description || (activeTab === 'debt' ? 'Nasiya' : 'To\'lov')
      });

      toast.success("Muvaffaqiyatli bajarildi!");
      
      // 🔥 MUHIM: Balansni darhol yangilaymiz (Backend new_balance qaytaradi)
      if (res.data.new_balance !== undefined) {
        setCurrentDebt(res.data.new_balance);
      }

      // Tarixni va orqa fondagi ro'yxatni yangilaymiz
      fetchHistory(); 
      onUpdate(); 
      
      // Formani tozalaymiz
      setFormData({ amount: '', description: '' });

      // DIQQAT: onClose() ni olib tashladim, shunda oyna yopilmaydi va o'zgarish ko'rinadi
      
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('uz-UZ', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <h2>{debtor.full_name}</h2>
            <p>{debtor.phone1}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Action Section */}
        <div className={styles.actionSection}>
          
          {/* 🔥 Balans (Endi statedan olinadi) */}
          <div className={styles.balanceRow}>
            <span>Joriy qarz miqdori:</span>
            <strong>{Number(currentDebt).toLocaleString()} so'm</strong>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button 
              className={`${activeTab === 'debt' ? `${styles.active} ${styles.debt}` : ''}`}
              onClick={() => setActiveTab('debt')}
            >
              Qarz berish
            </button>
            <button 
              className={`${activeTab === 'payment' ? `${styles.active} ${styles.payment}` : ''}`}
              onClick={() => setActiveTab('payment')}
            >
              To'lov olish
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <input 
              type="number" 
              name="amount" 
              placeholder="Summa..." 
              value={formData.amount}
              onChange={handleChange}
              autoFocus
              required 
            />
            <textarea 
              name="description" 
              placeholder={activeTab === 'debt' ? "Nima olindi?" : "Qanday to'landi?"}
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={loading}
              style={{backgroundColor: activeTab === 'debt' ? '#ef4444' : '#10b981'}}
            >
              {loading ? "..." : (activeTab === 'debt' ? <FaPlus /> : <FaMinus />)}
            </button>
          </form>
        </div>

        {/* History Section */}
        <div className={styles.historySection}>
          <h3><FaHistory /> Tarix</h3>
          <div className={styles.historyList}>
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.details}>
                    <span className={styles.desc}>{item.description}</span>
                    <span className={styles.date}>{formatDate(item.createdAt)}</span>
                  </div>
                  <div className={`${styles.amount} ${styles[item.type]}`}>
                    {item.type === 'debt' ? '+' : '-'} {Number(item.amount).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p style={{textAlign: 'center', color: '#9ca3af', padding: '20px'}}>
                Tarix bo'sh
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DebtorModal;