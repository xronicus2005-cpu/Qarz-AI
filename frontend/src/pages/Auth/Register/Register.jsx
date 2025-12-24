import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api/axios'; 
import { toast } from 'react-toastify';
import styles from './Register.module.scss';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    shop_name: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      
      toast.success(res.data.message);
      
      // Avtomatik login qilish (Tokenni saqlash)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);

      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Ro'yxatdan o'tish</h2>
        <p className={styles.subtitle}>Biznesingizni bugunoq avtomatlashtiring</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Ismingiz</label>
            <input 
              type="text" 
              name="name" 
              className={styles.input}
              placeholder="Masalan: Ali Valiyev" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Do'kon nomi</label>
            <input 
              type="text" 
              name="shop_name" 
              className={styles.input}
              placeholder="Masalan: Super Market" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Telefon raqam (Login)</label>
            <input 
              type="text" 
              name="phone" 
              className={styles.input}
              placeholder="+99890..." 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Parol</label>
            <input 
              type="password" 
              name="password" 
              className={styles.input}
              placeholder="********" 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className={styles.footerText}>
          Allaqachon hisobingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;