import { Preloader } from '@ui';
import { useSelector } from './store';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const ProtectedRoute = ({onlyAuth = true}) => {
  const user = useSelector((s) => s.auth.user);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked)

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyAuth && !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!onlyAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
