import { useConfirmation } from '@/components/organisms/ConfirmationModal';
import sentence from '@/util/sentence';
import React, { PropsWithChildren, useCallback, useContext } from 'react';
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

  const { confirm } = useConfirmation();

  const confirmAdd = useCallback(
    (registration: Registration) => {
      if (!session) return;

      const otherSessions = registration.sessions.filter(
        (s) => s.startsAt < session.endsAt && s.endsAt > session.startsAt
      );

      const busy = otherSessions.length > 0;
      if (busy) {
        confirm({
          title: 'Add to session',
          children: `${registration.user?.name} will be removed from ${sentence(otherSessions.map((s) => s.activity?.name || ''))}. Do you want to add them to this session?`,
        }).then(() => {
          addToSession(registration);
        });
      } else {
        addToSession(registration);
      }
    },
    [addToSession, session, confirm]
  );

  if (loading || !session) {
    return null;
  }

  return (
    <WorkshopSessionContext.Provider
      value={{
        session,
        addToSession: confirmAdd,
        addToWaitlist,
        removeFromSession,
        removeFromWaitlist,
      }}
    >
      {children}
    </WorkshopSessionContext.Provider>
  );
};

export const useWorkshopSessionContext = () => useContext(WorkshopSessionContext);
