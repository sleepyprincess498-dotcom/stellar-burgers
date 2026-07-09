import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/middlewares/getFeeds';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
