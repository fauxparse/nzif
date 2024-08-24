import { Card, Heading } from '@radix-ui/themes';
import { FragmentOf } from 'gql.tada';
import { DateTime } from 'luxon';
import { useAllocations } from './AllocationsProvider';
import { Workshop } from './Workshop';
import { WorkshopAllocationSessionDetailsFragment } from './queries';

import { uniqBy } from 'lodash-es';
import { useMemo } from 'react';
import styles from './Allocations.module.css';
import { Person } from './Person';
import { Registration } from './types';

type Session = FragmentOf<typeof WorkshopAllocationSessionDetailsFragment>;

type DayProps = {
  date: DateTime;
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

export const Day: React.FC<DayProps> = ({ date }) => {
  const { days, registration, sortRegistrations } = useAllocations();

  const sessions = useMemo(() => days.find(([d]) => d.equals(date))?.[1] ?? [], [days, date]);

  const slots = useMemo(
    () =>
      uniqBy(
        sessions.flatMap((s) => s.slots),
        'startsAt'
      ),
    [sessions]
  );

  const unassigned = useMemo(() => {
    const unassigned = new Map<string, Set<string>>();
    for (const session of sessions) {
      for (const registration of session.waitlist) {
        for (const slot of session.slots) {
          const set = unassigned.get(slot.id) ?? new Set();
          set.add(registration.id);
          unassigned.set(slot.id, set);
        }
      }
    }
    for (const session of sessions) {
      for (const registration of session.registrations) {
        for (const slot of session.slots) {
          unassigned.get(slot.id)?.delete(registration.id);
        }
      }
    }

    const sorted = new Map<string, Registration[]>();
    for (const [slot, ids] of unassigned) {
      sorted.set(slot, sortRegistrations(Array.from(ids).map(registration)));
    }
    return sorted;
  }, [sessions, sortRegistrations, registration]);

  return (
    <div className={styles.allocations}>
      <div className={styles.schedule}>
        {sessions.map((session) => (
          <Workshop session={session} key={session.id} style={{ gridRow: gridRow(session) }} />
        ))}
        {slots.map((slot) => (
          <Card
            key={slot.id}
            size="1"
            className={styles.session}
            style={{
              gridRow: `${slot.startsAt.hour < 12 ? 1 : 2} / span ${slots.length > 1 ? 1 : -1}`,
              gridColumn: '-2',
            }}
          >
            <Heading as="h4" size="2" color="gray" weight="regular" mb="2">
              Unassigned
            </Heading>
            {Array.from(unassigned.get(slot.id) ?? []).map((r) => (
              <Person key={r.id} registration={r} session={null} slots={[slot]} />
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
};
