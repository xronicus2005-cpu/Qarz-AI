import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import styles from './ShopList.module.scss';
import { toast } from 'react-toastify';
// Ikonkalar (npm install react-icons)
import { FaSearch, FaStore, FaCheck, FaBan, FaUser } from 'react-icons/fa';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 1. Do'konlarni yuklash
  const fetchShops = async () => {
    try {
      const res = await api.get('/admin/shops');
      setShops(res.data);
      setFilteredShops(res.data); // Boshida hammasi ko'rinadi
    } catch (error) {
      console.error("Xatolik:", error);
      toast.error("Ma'lumotlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // 2. Qidiruv (Search) logikasi
  useEffect(() => {
    const result = shops.filter(shop => 
      shop.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
      shop.username?.toLowerCase().includes(search.toLowerCase()) ||
      shop.phone?.includes(search)
    );
    setFilteredShops(result);
  }, [search, shops]);

  // 3. Statusni o'zgartirish (Bloklash/Ochish)
  const toggleStatus = async (id, currentRole) => {
    // Agar 'user' bo'lsa, 'shop_admin' (Premium) qilamiz. Aks holda 'user' (Blok).
    const newStatus = currentRole === 'user' ? 'active' : 'inactive';
    const confirmMessage = newStatus === 'active' 
      ? "Bu do'konni faollashtirasizmi (Premium)?" 
      : "Bu do'konni bloklaysizmi (Oddiy User)?";

    if(!window.confirm(confirmMessage)) return;

    try {
      await api.put(`/admin/shops/${id}`, { status: newStatus });
      toast.success("Status muvaffaqiyatli o'zgartirildi!");
      fetchShops(); // Jadvalni yangilash
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className={styles.container}>
      
      {/* --- HEADER --- */}
      <div className={styles.header}>
        <h2>Do'konlar Ro'yxati</h2>
        <div className={styles.searchBox}>
          <FaSearch />
          <input 
            type="text" 
            placeholder="Do'kon nomi, Ism yoki Telefon..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLE CARD --- */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loading}>Yuklanmoqda...</div>
        ) : filteredShops.length === 0 ? (
          <div className={styles.emptyState}>
            <FaStore style={{fontSize: '3rem', marginBottom: '10px', opacity: 0.3}} />
            <p>Hech qanday do'kon topilmadi.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Do'kon Nomi</th>
                  <th>Egasining Ismi</th>
                  <th>Telefon</th>
                  <th>Status</th>
                  <th>Boshqaruv</th>
                </tr>
              </thead>
              <tbody>
                {filteredShops.map((shop, index) => (
                  <tr key={shop.id}>
                    <td>#{index + 1}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'}}>
                        <FaStore style={{color: '#64748b'}}/> {shop.shop_name}
                      </div>
                    </td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <FaUser style={{color: '#94a3b8', fontSize: '0.8rem'}}/> {shop.username}
                      </div>
                    </td>
                    <td>{shop.phone}</td>
                    <td>
                      <span className={`${styles.badge} ${shop.role === 'shop_admin' ? styles.active : styles.blocked}`}>
                        {shop.role === 'shop_admin' ? 'Premium (Faol)' : 'To\'lovsiz (Blok)'}
                      </span>
                    </td>
                    <td>
                      {shop.role === 'shop_admin' ? (
                        <button 
                          className={`${styles.actionBtn} ${styles.block}`}
                          onClick={() => toggleStatus(shop.id, shop.role)}
                        >
                          <FaBan /> Bloklash
                        </button>
                      ) : (
                        <button 
                          className={`${styles.actionBtn} ${styles.activate}`}
                          onClick={() => toggleStatus(shop.id, shop.role)}
                        >
                          <FaCheck /> Faollashtirish
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopList;