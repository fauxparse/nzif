import { PropsWithChildren, createContext, useContext } from 'react';

type CalendarContext = {
  show: (id: string) => void;
  hide: (id: string) => void;
  leave: (id: string) => void;
};

const CalendarContext = createContext<CalendarContext>({
  show: () => {},
  hide: () => {},
  leave: () => {},
});

export const CalendarProvider: React.FC<PropsWithChildren<CalendarContext>> = ({
  children,
  ...value
}) => <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;

export const useCalendar = () => useContext(CalendarContext);
