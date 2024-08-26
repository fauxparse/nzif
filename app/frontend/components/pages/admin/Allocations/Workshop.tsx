import { SessionProgress } from '@/components/atoms/SessionProgress';
import { Card, CardProps, Flex, Heading, Inset, Separator, Text } from '@radix-ui/themes';
import { useAllocations } from './AllocationsProvider';
import { Session } from './types';

import { useMemo } from 'react';
import styles from './Allocations.module.css';
import { Dropzone } from './Dropzone';
import { Person } from './Person';

type WorkshopProps = CardProps & {
  session: Session;
};

const gridRow = (session: Session) => {
  if (session.slots.length !== 1) {
    return '1 / span 2';
  }
  if (session.slots[0].startsAt.hour < 12) {
    return '1';
  }
  return '2';
};

export const Workshop: React.FC<WorkshopProps> = ({ session, ...props }) => {
  const { registration, days, choice, sortRegistrations, score } = useAllocations();

  const registrations = useMemo(
    () => sortRegistrations(session.registrations.map(({ id }) => registration(id))),
    [session.registrations, sortRegistrations, registration]
  );
  const waitlist = useMemo(
    () => sortRegistrations(session.waitlist.map(({ id }) => registration(id))),
    [session.waitlist, sortRegistrations, registration]
  );

  return (
    <Card
      size="1"
      key={session.id}
      className={styles.session}
      data-slots={session.slots.length}
      {...props}
    >
      <Inset side="x">
        <Flex px="3" align="baseline">
          <Text truncate weight="medium" style={{ flex: 1 }}>
            {session.workshop.name}
          </Text>
          <Text size="2">
            {session.registrations.length}/{session.capacity}
          </Text>
        </Flex>
        <SessionProgress
          count={session.registrations.length}
          capacity={session.capacity}
          mx="3"
          my="2"
        />
      </Inset>
      <Dropzone session={session} slots={session.slots}>
        {registrations.map((r) => (
          <Person key={r.id} registration={r} session={session} slots={session.slots} />
        ))}
      </Dropzone>
      <Inset side="x">
        <Separator size="4" my="4" />
      </Inset>
      <Heading as="h4" size="2" color="gray" weight="regular" mb="2">
        Waitlist
      </Heading>
      <Dropzone session={session} slots={session.slots} waitlist>
        {waitlist.map((r) => (
          <Person key={r.id} registration={r} session={session} slots={session.slots} waitlist />
        ))}
      </Dropzone>
    </Card>
  );
};
