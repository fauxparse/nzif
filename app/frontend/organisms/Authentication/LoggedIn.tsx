import React, { useContext } from 'react';

import { AuthenticationContext } from './AuthenticationMachine';

const LoggedIn: React.FC = () => {
  const { machine } = useContext(AuthenticationContext);

  return (
    <div>
      <button
        type="button"
        className="button"
        data-variant="primary"
        onClick={() => machine.send('LOG_OUT')}
      >
        Log out
      </button>
    </div>
  );
};

export default LoggedIn;
