import { useRegistration } from '@/services/Registration';
import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { Session, Workshop, WorkshopDay } from './types';
import { useWorkshopPreferences } from './useWorkshopPreferences';

type WorkshopPreferencesContext = {
  loading: boolean;
  days: WorkshopDay[];
  disabledSessions: Session[];
  sessions: Set<Session['id']>;
  waitlist: Set<Session['id']>;
  value: Record<Session['id'], number>;
  dirty: boolean;
  count: number;
  add: (session: Omit<Session, 'workshop'>) => void;
  remove: (session: Omit<Session, 'workshop'>) => void;
  getPosition: (session: Pick<Session, 'id'>) => number | undefined;
  getWorkshop: (slug: string) => Workshop;
  getSession: (id: string) => Session;
};

const notImplemented = () => {
  throw new Error('Not implemented');
};

export const WorkshopPreferences = createContext<WorkshopPreferencesContext>({
  loading: true,
  days: [],
  disabledSessions: [],
  sessions: new Set(),
  waitlist: new Set(),
  value: {},
  dirty: false,
  count: 0,
  add: notImplemented,
  remove: notImplemented,
  getPosition: notImplemented,
  getWorkshop: notImplemented,
  getSession: notImplemented,
});

export const WorkshopPreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    loading,
    days,
    disabledSessions,
    sessions,
    waitlist,
    add,
    remove,
    getPosition,
    getWorkshop,
    getSession,
    value,
    dirty,
    preferences,
  } = useWorkshopPreferences();

  const { earlybird } = useRegistration();

  const count = useMemo(() => {
    if (earlybird) return preferences.size;
    return [...sessions].map(getSession).reduce((acc, session) => acc + session.slots.length, 0);
  }, [earlybird, preferences, sessions]);

  const contextValue = useMemo(
    () => ({
      loading,
      days,
      disabledSessions,
      sessions,
      waitlist,
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
      sessions,
      waitlist,
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
