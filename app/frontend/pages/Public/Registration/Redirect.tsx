import { Navigate } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { ROUTES } from '@/Routes';

const Redirect = () => {
  const { year = '' } = useTypedParams(ROUTES.REGISTRATION);
  return <Navigate to={ROUTES.REGISTRATION.ABOUT_YOU.buildPath({ year })} replace />;
};

export default Redirect;
