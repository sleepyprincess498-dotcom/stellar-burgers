import {
  ConstructorPage,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { Feed } from '@pages';
import { HeaderLayout } from '../layout/HeaderLayout';
//import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { getIngredients } from '../../services/middlewares/getIngredients';
import { getFeeds } from '../../services/middlewares/getFeeds';
import { getOrders } from '../../services/middlewares/getOrders';
import { getUser } from '../../services/middlewares/getUserData';
import { getCookie } from '../../utils/cookie';
import { ProtectedRoute } from '../../services/protectedRoute';
import { setAuthChecked } from '../../slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(getIngredients());
        await dispatch(getFeeds());

        const token = getCookie('accessToken');

        if (token) {
          await dispatch(getUser());
          await dispatch(getOrders());
        }
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    init();
  }, []);


  return (
    <Routes>
      <Route element={<HeaderLayout />}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route element={<ProtectedRoute onlyAuth={false} />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal onClose={() => navigate(-1)} title='Детали заказа'>
                {' '}
                <OrderInfo />{' '}
              </Modal>
            }
          />
        </Route>

        <Route
          path='/feed/:number'
          element={
            <Modal onClose={() => navigate(-1)} title='Детали заказа'>
              {' '}
              <OrderInfo />{' '}
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal onClose={() => navigate(-1)} title='Детали ингредиента'>
              {' '}
              <IngredientDetails />{' '}
            </Modal>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Route>
    </Routes>
  );
};

export default App;
