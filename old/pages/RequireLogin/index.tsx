import { Outlet } from 'react-router-dom';

import { useAuthentication } from '@/organisms/Authentication';

import LoginForm from './LoginForm';

import './RequireLogin.css';

const RequireLogin: React.FC = () => {
  const { loading, user } = useAuthentication();

  if (loading) return null;

  return user ? <Outlet /> : <LoginForm />;
};

export default RequireLogin;
