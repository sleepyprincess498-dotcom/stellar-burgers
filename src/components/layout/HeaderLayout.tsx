import { Outlet } from 'react-router-dom';
import { AppHeader } from '../app-header';

export const HeaderLayout = () => (
  <div>
    <AppHeader />
    <Outlet />
  </div>
);
