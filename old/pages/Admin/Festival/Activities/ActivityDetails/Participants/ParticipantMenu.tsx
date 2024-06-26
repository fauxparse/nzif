import { useMemo } from 'react';

import { AdminActivitySessionDetailsFragment, SessionParticipantFragment } from '@/graphql/types';
import ContextMenu, { useContextMenu } from '@/molecules/ContextMenu';
import Menu from '@/molecules/Menu';

import useParticipants from './useParticipants';

type ParticipantMenuProps = {
  session: AdminActivitySessionDetailsFragment;
};

const ParticipantMenu: React.FC<ParticipantMenuProps> = ({ session }) => {
  const { currentTarget, close } = useContextMenu();

  const id = currentTarget?.dataset?.id;

  const {
    items: { participants, waitlist },
    remove,
    promote,
    demote,
    removeFromWaitlist,
    isFromWaitlist,
  } = useParticipants(session);

  const registration = useMemo(
    () => participants.find((p) => p.id === id) || waitlist.find((p) => p.id === id),
    [id, participants, waitlist]
  );

  const waitlisted = !!registration && isFromWaitlist(registration);

  const action = (fn: (registration: SessionParticipantFragment) => void) => () => {
    close();
    if (registration) fn(registration);
  };

  return (
    <ContextMenu>
      {waitlisted ? (
        <>
          <Menu.Item icon="arrowLeft" label="Add to session" onClick={action(promote)} />
          <Menu.Item icon="cancel" label="Remove" onClick={action(removeFromWaitlist)} />
        </>
      ) : (
        registration && (
          <>
            <Menu.Item icon="arrowRight" label="Move to waitlist" onClick={action(demote)} />
            <Menu.Item icon="cancel" label="Remove" onClick={action(remove)} />
          </>
        )
      )}
    </ContextMenu>
  );
};

export default ParticipantMenu;
