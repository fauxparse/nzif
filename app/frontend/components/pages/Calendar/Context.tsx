import { PropsWithChildren, createContext, useContext } from 'react';
import { CalendarSession } from './types';

type CalendarContext = {
  show: (id: string) => void;
  hide: (id: string) => void;
  leave: (id: string) => void;
  selected: CalendarSession | null;
  setSelectedId: (session: CalendarSession['id'] | null) => void;
};

const CalendarContext = createContext<CalendarContext>({
  show: () => {},
  hide: () => {},
  leave: () => {},
  selected: null,
  setSelectedId: () => {},
});

export const CalendarProvider: React.FC<PropsWithChildren<CalendarContext>> = ({
  children,
  ...value
}) => <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;

export const useCalendar = () => useContext(CalendarContext);
