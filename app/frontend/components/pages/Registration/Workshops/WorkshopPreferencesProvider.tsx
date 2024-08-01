import { PropsWithChildren, createContext, useContext } from 'react';
import { Session, WorkshopDay } from './types';
import { useWorkshopPreferences } from './useWorkshopPreferences';

type WorkshopPreferencesContext = {
  days: WorkshopDay[];
  add: (session: Session) => void;
  remove: (session: Session) => void;
  getPosition: (session: Session) => number | undefined;
};

const WorkshopPreferences = createContext<WorkshopPreferencesContext>({
  days: [],
  add: () => {},
  remove: () => {},
  getPosition: () => undefined,
});

export const WorkshopPreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { days, add, remove, getPosition } = useWorkshopPreferences();

  return (
    <WorkshopPreferences.Provider value={{ days, add, remove, getPosition }}>
      {children}
    </WorkshopPreferences.Provider>
  );
};

export const usePreferences = () => useContext(WorkshopPreferences);
