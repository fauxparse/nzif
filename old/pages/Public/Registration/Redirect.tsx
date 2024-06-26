import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/Routes';

const Redirect = () => {
  return <Navigate to={ROUTES.REGISTRATION.ABOUT_YOU.path} replace />;
};

export default Redirect;
