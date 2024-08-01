import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { Session, WorkshopDay } from './types';
import { useWorkshopPreferences } from './useWorkshopPreferences';

type WorkshopPreferencesContext = {
  loading: boolean;
  days: WorkshopDay[];
  value: Record<Session['id'], number>;
  dirty: boolean;
  add: (session: Session) => void;
  remove: (session: Session) => void;
  getPosition: (session: Session) => number | undefined;
};

export const WorkshopPreferences = createContext<WorkshopPreferencesContext>({
  loading: true,
  days: [],
  value: {},
  dirty: false,
  add: () => {},
  remove: () => {},
  getPosition: () => undefined,
});

export const WorkshopPreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { loading, days, add, remove, getPosition, value, dirty } = useWorkshopPreferences();

  const contextValue = useMemo(
    () => ({ loading, days, add, remove, getPosition, value, dirty }),
    [loading, days, add, remove, getPosition, value, dirty]
  );

  return (
    <WorkshopPreferences.Provider value={contextValue}>{children}</WorkshopPreferences.Provider>
  );
};

export const usePreferences = () => useContext(WorkshopPreferences);
