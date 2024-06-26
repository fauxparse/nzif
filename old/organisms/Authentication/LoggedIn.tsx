import React, { useContext } from 'react';

import { AuthenticationMachineContext } from './AuthenticationMachine';

const LoggedIn: React.FC = () => {
  const { machine } = useContext(AuthenticationMachineContext);

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
