import { useQuery } from '@apollo/client';
import { PropsWithChildren, createContext, useContext } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { CitiesQuery } from './queries';

const PlacenamesContext = createContext({
  showTraditionalNames: true,
});

export const PlacenamesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data, loading } = useQuery(CitiesQuery);

  const [showTraditionalNames, setShowTraditionalNames] = useLocalStorage(
    'showTraditionalNames',
    true
  );

  return (
    <PlacenamesContext.Provider
      value={{
        showTraditionalNames,
      }}
    >
      {children}
    </PlacenamesContext.Provider>
  );
};

export const usePlacenames = () => useContext(PlacenamesContext);
