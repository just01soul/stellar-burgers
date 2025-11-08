import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import store, { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderModalData,
  constructorDataSelector,
  createBurgerThunk,
  isAuthSelector,
  orderModalDataSelector,
  orderRequestSelector,
  setOrderRequest
} from '@slices';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthSelector);
  const constructorItems = useSelector(constructorDataSelector);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderModalDataSelector);

  const onOrderClick = () => {
    if (!isAuth) {
      return navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;
    const order = [
      constructorItems.bun?._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun?._id
    ].filter(Boolean);

    dispatch(createBurgerThunk(order));
  };
  const closeOrderModal = () => {
    dispatch(setOrderRequest(false));
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
