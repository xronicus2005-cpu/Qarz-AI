import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Rolni o'qiymiz

  // 1. Agar token bo'lmasa -> Login sahifasiga
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Agar ruxsat etilgan rollar ro'yxati berilgan bo'lsa va
  // foydalanuvchining roli bu ro'yxatda bo'lmasa -> Bosh sahifaga (Client Panelga) haydaymiz
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Hammasi joyida bo'lsa -> Sahifani ko'rsat
  return children ? children : <Outlet />;
};

export default ProtectedRoute;