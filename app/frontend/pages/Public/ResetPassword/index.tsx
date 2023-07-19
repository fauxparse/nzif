import { useTypedSearchParams } from 'react-router-typesafe-routes/dom';

import Footer from '@/organisms/Footer';
import Header from '@/organisms/Header';
import { ROUTES } from '@/Routes';

import Form from './Form';

import './ResetPassword.css';

export const Component: React.FC = () => {
  const [{ reset_password_token: token = '' }] = useTypedSearchParams(ROUTES.PASSWORD);

  return (
    <div className="reset-password">
      <Header />
      <main className="page">
        <Form token={token} />
      </main>
      <Footer />
    </div>
  );
};

Component.displayName = 'ResetPassword';
