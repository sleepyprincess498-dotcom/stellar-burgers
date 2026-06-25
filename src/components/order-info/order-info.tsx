import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { useNavigate, useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const orders = useSelector((state) => state.orders.orders);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const orderData = orders.find((order) => order.number === Number(number));

  const allIngredient = useSelector((state) => state.ingredients.ingredients);

  const ingredients = (orderData?.ingredients
    .map((id) => allIngredient.find((item) => item._id === id))
    .filter(Boolean) ?? []) as TIngredient[];

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
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
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
