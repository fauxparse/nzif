import { ChoiceBadge } from '@/components/atoms/ChoiceBadge';
import { Box, Flex, HoverCard, Inset, Separator, Text } from '@radix-ui/themes';
import { range, sortBy } from 'lodash-es';
import { useState } from 'react';
import { useAllocations } from './AllocationsProvider';
import { Registration, Session } from './types';

import styles from './Allocations.module.css';

type PersonProps = {
  registration: Registration;
  session: Session | null;
  slots: Session['slots'];
};

export const Person: React.FC<PersonProps> = ({ registration, session, slots }) => {
  const { choice, score, days, placements, count } = useAllocations();

  const [preferences, setPreferences] = useState<[Session, number][][]>([]);

  const calculatePreferences = () => {
    const slotIds = new Set(slots.map((slot) => slot.id));

    const sessions =
      days.find(([, sessions]) =>
        sessions.some((session) => session.slots.some((slot) => slotIds.has(slot.id)))
      )?.[1] || [];

    const preferences = registration.preferences.reduce(
      (acc, preference) => {
        const session = sessions.find((s) => s.id === preference.sessionId);
        if (session) {
          for (const slot of session.slots) {
            acc[slot.id] = [...(acc[slot.id] || []), [session, preference.position]];
          }
        }
        return acc;
      },
      {} as Record<string, [Session, number][]>
    );

    setPreferences(Object.values(preferences).map((ps) => sortBy(ps, ([, position]) => position)));
  };

  return (
    <HoverCard.Root
      onOpenChange={(isOpen) => {
        if (isOpen) {
          calculatePreferences();
        }
      }}
    >
      <HoverCard.Trigger>
        <Flex gap="2" p="1" className={styles.person}>
          <ChoiceBadge choice={session && choice(registration.id, session?.id)} />
          <Box asChild flexGrow="1">
            <Text truncate size="2">
              {registration.user?.name}
            </Text>
          </Box>
          <Text size="2" color="gray">
            {score(registration.id)}
          </Text>
        </Flex>
      </HoverCard.Trigger>
      <HoverCard.Content size="1">
        <Flex gap="2" align="baseline" justify="between">
          <Box asChild flexGrow="1">
            <Text truncate size="2" weight="medium">
              {registration.user?.name}
            </Text>
          </Box>
          <Text color="gray" size="2">
            {score(registration.id)}
          </Text>
        </Flex>
        {preferences.map((slot, i) => (
          <Flex key={i} direction="column" gap="1" mt="2">
            {slot.map(([session, position]) => (
              <Flex key={position} gap="2">
                <ChoiceBadge choice={position} />
                <Text truncate size="2">
                  {session.workshop.name}
                </Text>
              </Flex>
            ))}
          </Flex>
        ))}
        <Inset side="x">
          <Separator size="4" my="4" />
        </Inset>

        <Flex gap="1">
          {placements(registration.id).map((placement, i) => (
            <ChoiceBadge key={i} choice={placement} />
          ))}
          {range(count(registration.id) - placements(registration.id).length).map((i) => (
            <ChoiceBadge key={i} choice={null} />
          ))}
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  );
};
