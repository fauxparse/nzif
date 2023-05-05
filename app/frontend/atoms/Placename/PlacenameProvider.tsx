import React, { createContext, PropsWithChildren } from 'react';

import usePreference from '@/hooks/usePreference';

export const PlacenameContext = createContext({
  showTraditionalNameByDefault: true,
  setShowTraditionalNameByDefault: () => void 0,
} as {
  showTraditionalNameByDefault: boolean;
  setShowTraditionalNameByDefault: (value: boolean) => void;
});

const PlacenameProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showTraditionalNameByDefault, setShowTraditionalNameByDefault] = usePreference<boolean>(
    'showTraditionalNames',
    true
  );
  return (
    <PlacenameContext.Provider
      value={{
        showTraditionalNameByDefault: showTraditionalNameByDefault ?? true,
        setShowTraditionalNameByDefault,
      }}
    >
      {children}
    </PlacenameContext.Provider>
  );
};

export default PlacenameProvider;
