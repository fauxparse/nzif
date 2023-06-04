import { Outlet } from 'react-router-dom';

import Button from '@/atoms/Button';
import { useRegistrationQuery } from '@/graphql/types';

import Steps from './Steps';

const RegistrationLayout: React.FC = () => {
  const { loading, data } = useRegistrationQuery();

  const { festival } = data || {};

  return (
    <div className="registration">
      <h1>Register for NZIF {festival?.id}</h1>
      <Steps />

      <Outlet />

      <footer className="registration__footer">
        <Button
          className="registration__button"
          icon="chevronRight"
          data-action="next"
          type="submit"
          text={
            <>
              <small>Next</small>
              <span>Workshop selection</span>
            </>
          }
        />
      </footer>
    </div>
  );
};

export default RegistrationLayout;
