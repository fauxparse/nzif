import { FragmentOf } from '@/graphql';
import { CheckboxCards, Text } from '@radix-ui/themes';
import { keyBy, sortBy } from 'lodash-es';
import { useMemo } from 'react';
import { useWorkshopSession } from './WorkshopProvider';
import { AddCastMemberMutation, RemoveCastMemberMutation } from './queries';

import { CastMemberFragment } from '@/components/organisms/ShowCast/queries';
import { Reference, useMutation } from '@apollo/client';
import classes from './Workshop.module.css';

type CastMember = FragmentOf<typeof CastMemberFragment>;

export const Show: React.FC = () => {
  const { session: workshopSession } = useWorkshopSession();

  const show =
    (!!workshopSession.activity &&
      'show' in workshopSession.activity &&
      workshopSession.activity.show) ||
    null;

  const session = show?.sessions?.[0] || null;

  const participants = useMemo(
    () => sortBy(workshopSession.participants.map((p) => p.user?.profile).filter(Boolean), 'name'),
    [workshopSession]
  );

  const cast = useMemo(() => session?.performers || [], [session]);

  const castIds = useMemo(() => new Set(cast.map((c) => c.id)), [cast]);

  const [addCastMemberMutation] = useMutation(AddCastMemberMutation, {
    update: (cache, { data }) => {
      const cast = data?.addSessionCast?.cast;
      if (!cast || !session) return;

      const ref = cache.writeFragment({
        fragment: CastMemberFragment,
        id: cache.identify(cast),
        data: cast,
      });

      cache.modify({
        id: cache.identify(session),
        fields: {
          performers: (existing) => [...existing, ref],
        },
      });
    },
  });

  const [removeCastMemberMutation] = useMutation(RemoveCastMemberMutation, {});

  const addCastMember = (cast: CastMember) => {
    if (!session) return;
    addCastMemberMutation({
      variables: { sessionId: session?.id, profileId: cast.id },
      optimisticResponse: {
        addSessionCast: {
          cast,
        },
      },
    });
  };

  const removeCastMember = (cast: CastMember) => {
    if (!session) return;
    removeCastMemberMutation({
      variables: { sessionId: session?.id, profileId: cast.id },
      optimisticResponse: {
        removeSessionCast: true,
      },
      update: (cache, { data }) => {
        if (!data?.removeSessionCast || !session) return;

        cache.modify({
          id: cache.identify(session),
          fields: {
            performers: (existing, { readField }) =>
              existing.filter((c: Reference) => readField('id', c) !== cast.id),
          },
        });
      },
    });
  };

  const update = (newIds: string[]) => {
    const all = keyBy(participants.filter(Boolean), 'id') as Record<string, CastMember>;
    const added = newIds.filter((id) => !castIds.has(id));
    for (const id of added) {
      addCastMember(all[id]);
    }
    const removed = [...castIds].filter((id) => !newIds.includes(id));
    for (const id of removed) {
      removeCastMember(all[id]);
    }
  };

  if (!show) return null;

  return (
    <CheckboxCards.Root defaultValue={[...castIds]} onValueChange={update}>
      {participants.map(
        (participant) =>
          participant && (
            <CheckboxCards.Item
              className={classes.showParticipant}
              key={participant.id}
              value={participant.id}
            >
              <Text>{participant.name}</Text>
            </CheckboxCards.Item>
          )
      )}
    </CheckboxCards.Root>
  );
};
