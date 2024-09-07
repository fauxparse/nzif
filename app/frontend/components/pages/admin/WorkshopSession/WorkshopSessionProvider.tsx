import React, { PropsWithChildren, useContext } from 'react';
import { Registration, Session } from './types';
import { useWorkshopSession } from './useWorkshopSession';

type WorkshopSessionContext = {
  session: Session;
  addToSession: (registration: Registration) => void;
  addToWaitlist: (registration: Registration, position: number) => void;
  removeFromSession: (registration: Registration) => void;
  removeFromWaitlist: (registration: Registration) => void;
};

const WorkshopSessionContext = React.createContext<WorkshopSessionContext>(
  {} as WorkshopSessionContext
);

type WorkshopSessionProviderProps = PropsWithChildren<{
  slug: string;
  sessionId: string;
}>;

export const WorkshopSessionProvider: React.FC<WorkshopSessionProviderProps> = ({
  slug,
  sessionId,
  children,
}) => {
  const { loading, session, addToSession, addToWaitlist, removeFromSession, removeFromWaitlist } =
    useWorkshopSession(slug, sessionId);

  if (loading || !session) {
    return null;
  }

  return (
    <WorkshopSessionContext.Provider
      value={{ session, addToSession, addToWaitlist, removeFromSession, removeFromWaitlist }}
    >
      {children}
    </WorkshopSessionContext.Provider>
  );
};

export const useWorkshopSessionContext = () => useContext(WorkshopSessionContext);
