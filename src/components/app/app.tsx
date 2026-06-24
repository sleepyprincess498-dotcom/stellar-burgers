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

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getFeeds());
    if (getCookie('accessToken')) {
      dispatch(getUser());
      dispatch(getOrders());
    }
  }, []);
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const error = useSelector((state) => state.ingredients.error);

  const navigate = useNavigate();

  return (
    <Routes>
      <Route element={<HeaderLayout />}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/orders' element={<ProfileOrders />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='*' element={<NotFound404 />} />
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
    </Routes>
  );
};

export default App;
