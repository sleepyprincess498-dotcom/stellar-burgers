import { Preloader } from '@ui';
import { useSelector } from './store';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const ProtectedRoute = ({onlyAuth = true}) => {
  const isAuth = useSelector((s) => s.auth.isAuth);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked)
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if(isAuth === onlyAuth) {
    return <Outlet />
  } else {
    return (
      isAuth ? 
        <Navigate to='/' replace state={{from: location}} /> :
        <Navigate to='/login' replace  state={{from: location}}/>
    )
  }

  
};
