import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { Session, WorkshopDay } from './types';
import { useWorkshopPreferences } from './useWorkshopPreferences';

type WorkshopPreferencesContext = {
  loading: boolean;
  days: WorkshopDay[];
  value: Record<Session['id'], number>;
  dirty: boolean;
  count: number;
  add: (session: Session) => void;
  remove: (session: Session) => void;
  getPosition: (session: Session) => number | undefined;
};

export const WorkshopPreferences = createContext<WorkshopPreferencesContext>({
  loading: true,
  days: [],
  value: {},
  dirty: false,
  count: 0,
  add: () => {},
  remove: () => {},
  getPosition: () => undefined,
});

export const WorkshopPreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { loading, days, add, remove, getPosition, value, dirty, preferences } =
    useWorkshopPreferences();

  const count = preferences.size;

  const contextValue = useMemo(
    () => ({ loading, days, add, remove, getPosition, value, dirty, count }),
    [loading, days, add, remove, getPosition, value, dirty, count]
  );

  return (
    <WorkshopPreferences.Provider value={contextValue}>{children}</WorkshopPreferences.Provider>
  );
};

export const usePreferences = () => useContext(WorkshopPreferences);
