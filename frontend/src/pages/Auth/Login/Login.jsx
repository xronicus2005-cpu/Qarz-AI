import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { toast } from 'react-toastify';
import styles from './Login.module.scss'; // <-- SCSS ulandi

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      toast.success("Xush kelibsiz!");
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Tizimga kirish</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input 
            type="text" 
            name="phone" 
            placeholder="Telefon raqam" 
            className={styles.input}
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Parol" 
            className={styles.input}
            onChange={handleChange} 
            required 
          />
          <button type="submit" className={styles.button}>Kirish</button>
        </form>
        <p className={styles.footerText}>
          Hali hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;