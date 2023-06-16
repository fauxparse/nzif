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
  const { currentTarget } = useContextMenu();

  const { sessions } = useTimetableContext();

  const id = currentTarget?.getAttribute('data-id');

  const session = useMemo(() => sessions.find((s) => s.id === id), [id, sessions]);

  const [updateSession] = useUpdateSessionMutation();
  const [destroySession] = useDestroySessionMutation();

  const handleClear = () => {
    if (!id || !session) return;
    updateSession({
      variables: { id, attributes: { activityId: null } as SessionAttributes },
      optimisticResponse: {
        __typename: 'Mutation',
        updateSession: {
          __typename: 'UpdateSessionPayload',
          session: {
            ...session,
            activity: null,
          },
        },
      },
    });
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
  };

  return (
    <ContextMenu id="session">
      {session?.activity && <Menu.Item icon="edit" label="Activity details" />}
      <Menu.Separator />
      {session?.activity && <Menu.Item icon="close" label="Clear activity" onClick={handleClear} />}
      <Menu.Item icon="trash" label="Delete" onClick={handleDelete} />
    </ContextMenu>
  );
};

export default TimetableSessionContextMenu;
