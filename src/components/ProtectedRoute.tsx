// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuth = localStorage.getItem('isLoggedIn') === 'true';

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;