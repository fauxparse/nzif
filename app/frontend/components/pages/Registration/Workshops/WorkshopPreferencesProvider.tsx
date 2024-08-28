import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { Session, Workshop, WorkshopDay } from './types';
import { useWorkshopPreferences } from './useWorkshopPreferences';

type WorkshopPreferencesContext = {
  loading: boolean;
  days: WorkshopDay[];
  disabledSessions: Session[];
  value: Record<Session['id'], number>;
  dirty: boolean;
  count: number;
  add: (session: Session) => void;
  remove: (session: Session) => void;
  getPosition: (session: Pick<Session, 'id'>) => number | undefined;
  getWorkshop: (slug: string) => Workshop | undefined;
  getSession: (id: string) => Session | undefined;
};

export const WorkshopPreferences = createContext<WorkshopPreferencesContext>({
  loading: true,
  days: [],
  disabledSessions: [],
  value: {},
  dirty: false,
  count: 0,
  add: () => {},
  remove: () => {},
  getPosition: () => undefined,
  getWorkshop: () => undefined,
  getSession: () => undefined,
});

export const WorkshopPreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    loading,
    days,
    disabledSessions,
    add,
    remove,
    getPosition,
    getWorkshop,
    getSession,
    value,
    dirty,
    preferences,
  } = useWorkshopPreferences();

  const count = preferences.size;

  console.log(disabledSessions);

  const contextValue = useMemo(
    () => ({
      loading,
      days,
      disabledSessions,
      add,
      remove,
      getPosition,
      getWorkshop,
      getSession,
      value,
      dirty,
      count,
    }),
    [
      loading,
      days,
      disabledSessions,
      add,
      remove,
      getPosition,
      getWorkshop,
      getSession,
      value,
      dirty,
      count,
    ]
  );

  return (
    <WorkshopPreferences.Provider value={contextValue}>{children}</WorkshopPreferences.Provider>
  );
};

export const usePreferences = () => useContext(WorkshopPreferences);
