import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getOrderByNumber } from '../../services/middlewares/getOrderByNumber';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((state) => state.orders.findedOrder)[0];
  const isLoading = useSelector((state) => state.orders.isLoading);
   const location = useLocation();
  const from = location.state.from.pathname ?? '/';

  useEffect(() => {
    dispatch(getOrderByNumber(Number(number)));
  }, [])

  const allIngredient = useSelector((state) => state.ingredients.ingredients);

  const ingredients = (order?.ingredients
    .map((id) => allIngredient.find((item) => item._id === id))
    .filter(Boolean) ?? []) as TIngredient[];

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total
    };
  }, [order, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if(!orderInfo) return <Navigate to={from} replace />

  return <OrderInfoUI orderInfo={orderInfo} />;
};
