import { ChoiceBadge } from '@/components/atoms/ChoiceBadge';
import { CSS } from '@dnd-kit/utilities';
import { Box, Flex, FlexProps, HoverCard, Inset, Separator, Text } from '@radix-ui/themes';
import { range, sortBy } from 'lodash-es';
import { Fragment, forwardRef, useEffect, useState } from 'react';
import { useAllocations } from './AllocationsProvider';
import { useDraggable } from './dndkit';
import { Registration, Session } from './types';

import clsx from 'clsx';
import styles from './Allocations.module.css';

type PersonProps = {
  registration: Registration;
  session: Session | null;
  slots: Session['slots'];
  waitlist?: boolean;
};

export const Person: React.FC<PersonProps> = ({
  registration,
  session,
  slots,
  waitlist = false,
}) => {
  const id = `${registration.id}-${session?.id || 'unassigned'}-${slots[0].id}`;

  const [hovered, setHovered] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: {
      registration,
      session,
      slots,
      waitlist,
    },
  });

  useEffect(() => {
    setHovered(false);
  }, [isDragging]);

  const { score, days, placements, placementMap, count } = useAllocations();

  const [preferences, setPreferences] = useState<[Session, number][][]>([]);

  const [allocated, setAllocated] = useState<Map<string, number | null>>(() => new Map());

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
    setAllocated(placementMap(registration.id));
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0 : 1,
  };

  return (
    <HoverCard.Root
      open={hovered && !isDragging}
      openDelay={700}
      onOpenChange={(isOpen) => {
        setHovered(isOpen);
        if (isOpen) {
          calculatePreferences();
        }
      }}
    >
      <HoverCard.Trigger>
        <PersonInner
          ref={setNodeRef}
          registration={registration}
          session={session}
          slots={slots}
          waitlist={waitlist}
          style={style}
          {...listeners}
          {...attributes}
        />
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
          <Fragment key={i}>
            {!!i && <Separator size="2" mt="2" mx="auto" />}
            <Flex key={i} direction="column" gap="1" mt="2">
              {slot.map(([session, position]) => (
                <Flex key={session.id} gap="2">
                  <ChoiceBadge
                    choice={position}
                    variant={allocated.get(session.slots[0].id) === position ? 'soft' : 'outline'}
                  />
                  <Text truncate size="2">
                    {session.workshop.name}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Fragment>
        ))}
        <Inset side="x">
          <Separator size="4" my="4" />
        </Inset>

        <Flex>
          {placements(registration.id).map((placement, i) => (
            <ChoiceBadge key={i} choice={placement} size="dot" />
          ))}
          {range(count(registration.id) - placements(registration.id).length).map((i) => (
            <ChoiceBadge key={i} choice={null} size="dot" />
          ))}
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  );
};

export const PersonInner = forwardRef<HTMLDivElement, FlexProps & PersonProps>(
  ({ className, registration, session, slots, waitlist, ...props }, ref) => {
    const { choice, score } = useAllocations();

    return (
      <Flex ref={ref} gap="2" p="1" className={clsx(className, styles.person)} {...props}>
        <ChoiceBadge
          choice={session && choice(registration.id, session?.id)}
          variant={waitlist ? 'outline' : 'soft'}
        />
        <Box asChild flexGrow="1">
          <Text truncate size="2">
            {registration.user?.name}
          </Text>
        </Box>
        <Text size="2" color="gray">
          {score(registration.id)}
        </Text>
      </Flex>
    );
  }
);
