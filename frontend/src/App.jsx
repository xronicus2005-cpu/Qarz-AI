import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';

// Layout & Security
import ClientLayout from './components/ClientLayout/ClientLayout';
import AdminLayout from './pages/Admin/AdminLayout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // <-- Yangilangan fayl

// Client Pages
import Dashboard from './pages/Client/Dashboard/Dashboard';
import AddDebtor from './pages/Client/AddDebtor/AddDebtor';
import DebtorList from './pages/Client/DebtorList/DebtorList';
import Profile from './pages/Client/Profile/Profile';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import ShopList from './pages/Admin/ShopList/ShopList';

// Skroll tugmalari
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import BackToTop from './components/BackToTop/BackToTop';

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <BackToTop />
        
        <Routes>
          {/* --- OCHIQ SAHIFALAR --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- CLIENT PANELI (Do'konchilar uchun) --- */}
          <Route 
            path="/" 
            element={
              // Bu yerga kimlar kira oladi? (User va Shop Admin)
              <ProtectedRoute allowedRoles={['user', 'shop_admin', 'super_admin']}>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="add-debtor" element={<AddDebtor />} />
            <Route path="debtors" element={<DebtorList />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* --- ADMIN PANELI (Faqat Super Admin uchun) --- */}
          <Route 
            path="/admin" 
            element={
              // Bu yerga FAQAT 'super_admin' kira oladi!
              // Agar shop_admin kirmoqchi bo'lsa, uni '/' ga otib yuboradi.
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="shops" element={<ShopList />} />
          </Route>

          {/* Noto'g'ri link kiritilsa */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;