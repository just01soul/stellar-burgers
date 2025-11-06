import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { Preloader } from '@ui';
import { userDataSelector, isAuthCheckedSelector } from '@slices';

type ProtectedRouteProps = {
  onlyAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({ onlyAuth, children }: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector); // selectIsAuthChecked isAuthCheckedSelector — селектор получения состояния загрузки пользователя
  const user = useSelector(userDataSelector); // userDataSelector — селектор получения пользователя из store
  const location = useLocation();

  if (!isAuthChecked) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (!onlyAuth && !user) {
    // если маршрут для авторизованного пользователя, но пользователь неавторизован, то делаем редирект
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyAuth && user) {
    //если маршрут для неавторизованного пользователя,
    //но пользователь авторизован, и если перешли по прямой ссылке, то
    //создаём объект c указанием адреса и переадресовываем на главную страницу
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
