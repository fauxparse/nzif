import UserIcon from '@/icons/UserIcon';
import WaitlistIcon from '@/icons/WaitlistIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, Flex, FlexProps, HoverCard, Text } from '@radix-ui/themes';
import { FragmentOf } from 'gql.tada';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { useWorkshopSessionContext } from './WorkshopSessionProvider';
import { useDraggable } from './dndkit';
import { SessionRegistrationFragment } from './queries';

import sentence from '@/util/sentence';
import classes from './WorkshopSession.module.css';

type PersonProps = {
  registration: FragmentOf<typeof SessionRegistrationFragment>;
  waitlisted?: boolean;
  isDragging?: boolean;
};

export const Person = forwardRef<HTMLDivElement, PersonProps & FlexProps>(
  ({ registration, waitlisted = false, isDragging = false, ...props }, ref) => {
    const { session } = useWorkshopSessionContext();

    const otherSessions = useMemo(
      () =>
        registration.sessions.filter(
          (s) => s.startsAt < session.endsAt && s.endsAt > session.startsAt
        ),
      [registration, session]
    );

    const busy = otherSessions.length > 0;

    const [hovered, setHovered] = useState(false);

    useEffect(() => {
      if (isDragging) setHovered(false);
    }, [isDragging]);

    return (
      <div ref={ref} {...props}>
        <Flex className={classes.person} gap="2" align="center">
          {waitlisted ? (
            <HoverCard.Root
              open={hovered}
              onOpenChange={(open) => {
                setHovered(open && !isDragging);
              }}
            >
              <HoverCard.Trigger>
                <div>
                  <Avatar
                    fallback={busy ? <WorkshopIcon /> : <WaitlistIcon />}
                    variant={busy ? 'soft' : 'solid'}
                    size="2"
                    radius="full"
                  />
                </div>
              </HoverCard.Trigger>
              <HoverCard.Content size="1">
                <Text>
                  {`${registration.user?.name || 'This person'} ${busy ? `is in ${sentence(otherSessions.map((s) => s.activity?.name || ''))}` : 'has nothing else on'}`}
                </Text>
              </HoverCard.Content>
            </HoverCard.Root>
          ) : (
            <Avatar fallback={<UserIcon />} variant="soft" size="2" radius="full" />
          )}
          {registration.user?.name}
        </Flex>
      </div>
    );
  }
);

export const SortablePerson: React.FC<PersonProps> = ({ registration, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting } =
    useSortable({
      id: registration.id,
      data: { registration },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <Person
      ref={setNodeRef}
      registration={registration}
      data-id={registration.id}
      style={style}
      isDragging={isDragging || isSorting}
      {...attributes}
      {...listeners}
      {...props}
    />
  );
};

export const DraggablePerson: React.FC<PersonProps> = ({ registration, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: registration.id,
    data: { registration },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0 : 1,
  };

  return (
    <Person
      ref={setNodeRef}
      registration={registration}
      data-id={registration.id}
      style={style}
      isDragging={isDragging}
      {...attributes}
      {...listeners}
      {...props}
    />
  );
};
