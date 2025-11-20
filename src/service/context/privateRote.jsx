// src/components/auth/PrivateRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../service/context/authProvider";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Carregando autenticação...</div>;
  }
  if (user) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
