import { useTypedSearchParams } from 'react-router-typesafe-routes/dom';

import { ROUTES } from '@/Routes';
import Footer from '@/organisms/Footer';
import Header from '@/organisms/Header';

import Form from './Form';

import './ResetPassword.css';

export const Component: React.FC = () => {
  const [{ reset_password_token: token = '' }] = useTypedSearchParams(ROUTES.PASSWORD);

  return (
    <div className="reset-password">
      <Form token={token} />
    </div>
  );
};

Component.displayName = 'ResetPassword';
