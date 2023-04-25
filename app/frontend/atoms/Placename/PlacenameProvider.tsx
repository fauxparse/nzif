import React, { createContext, PropsWithChildren } from 'react';

import usePreference from '@/hooks/usePreference';

export const PlacenameContext = createContext({
  showIndigenousNameByDefault: true,
  setShowIndigenousNameByDefault: () => void 0,
} as {
  showIndigenousNameByDefault: boolean;
  setShowIndigenousNameByDefault: (value: boolean) => void;
});

const PlacenameProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showIndigenousNameByDefault, setShowIndigenousNameByDefault] = usePreference<boolean>(
    'showIndigenousNames',
    true
  );
  return (
    <PlacenameContext.Provider
      value={{
        showIndigenousNameByDefault: showIndigenousNameByDefault ?? true,
        setShowIndigenousNameByDefault,
      }}
    >
      {children}
    </PlacenameContext.Provider>
  );
};

export default PlacenameProvider;
