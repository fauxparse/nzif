import { useMemo } from 'react';

import { useTimetableContext } from '../Context';
import {
  SessionAttributes,
  useDestroySessionMutation,
  useUpdateSessionMutation,
} from '@/graphql/types';
import ContextMenu from '@/molecules/ContextMenu';
import { useContextMenu } from '@/molecules/ContextMenu/Context';
import Menu from '@/molecules/Menu';

const TimetableSessionContextMenu: React.FC = () => {
  const { currentTarget, close } = useContextMenu();

  const { sessions, venues } = useTimetableContext();

  const id = currentTarget?.getAttribute('data-id');

  const session = useMemo(() => sessions.find((s) => s.id === id), [id, sessions]);

  const [updateSession] = useUpdateSessionMutation();
  const [destroySession] = useDestroySessionMutation();

  const update = (
    attributes: Partial<SessionAttributes>,
    optimistic: { activity: null } | { venue: (typeof venues)[number] | null }
  ) => {
    if (!id || !session) return;
    updateSession({
      variables: { id, attributes: attributes as SessionAttributes },
      optimisticResponse: {
        __typename: 'Mutation',
        updateSession: {
          __typename: 'UpdateSessionPayload',
          session: {
            ...session,
            ...optimistic,
          },
        },
      },
    });
  };

  const handleClear = () => {
    update({ activityId: null }, { activity: null });
    close();
  };

  const handleClearVenue = () => {
    update({ venueId: null }, { venue: null });
    close();
  };

  const handleDelete = () => {
    if (!id) return;
    destroySession({
      variables: { id },
      update: (cache) => cache.evict({ id: cache.identify({ __typename: 'Session', id }) }),
      optimisticResponse: {
        __typename: 'Mutation',
        destroySession: true,
      },
    });
    close();
  };

  const availableVenues = useMemo(() => {
    if (!session) return venues;

    const overlappingSessions = sessions.filter(
      (s) => !!s.venue && s.endsAt > session.startsAt && s.startsAt < session.endsAt
    );
    const overlappingVenues = new Set(overlappingSessions.map((s) => s.venue?.id));
    return venues.filter((v) => !overlappingVenues.has(v.id));
  }, [session, sessions, venues]);

  return (
    <ContextMenu id="session">
      {session?.activity && <Menu.Item icon="edit" label="Activity details" />}
      {!session?.venue && (
        <>
          <Menu.Separator />
          {availableVenues.map((v) => (
            <Menu.Item
              key={v.id}
              icon="location"
              label={v.room || v.building}
              onClick={() => update({ venueId: v.id }, { venue: v })}
            />
          ))}
        </>
      )}
      <Menu.Separator />
      {session?.venue && <Menu.Item icon="close" label="Clear venue" onClick={handleClearVenue} />}
      {session?.activity && <Menu.Item icon="close" label="Clear activity" onClick={handleClear} />}
      <Menu.Item icon="trash" label="Delete" onClick={handleDelete} />
    </ContextMenu>
  );
};

export default TimetableSessionContextMenu;
