import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../services/middlewares/getOrders';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector((state) => state.orders.personalOrders);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    dispatch(getOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
