import { Card, Heading } from '@radix-ui/themes';
import { FragmentOf } from 'gql.tada';
import { DateTime } from 'luxon';
import { useAllocations } from './AllocationsProvider';
import { Workshop } from './Workshop';
import { WorkshopAllocationSessionDetailsFragment } from './queries';

import styles from './Allocations.module.css';

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
  const { days } = useAllocations();

  const sessions = days.find(([d]) => d.equals(date))?.[1] ?? [];

  return (
    <div className={styles.allocations}>
      <div className={styles.schedule}>
        {sessions.map((session) => (
          <Workshop session={session} key={session.id} style={{ gridRow: gridRow(session) }} />
        ))}
        <Card
          size="1"
          className={styles.session}
          style={{ gridRow: '1 / span 2', gridColumn: '-2' }}
        >
          <Heading as="h4" size="2" color="gray" weight="regular" mb="2">
            Unassigned
          </Heading>
        </Card>
      </div>
    </div>
  );
};
