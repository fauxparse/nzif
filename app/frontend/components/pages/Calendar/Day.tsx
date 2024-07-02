import { Collapsible } from '@/components/helpers/Collapsible';
import { Skeleton } from '@mantine/core';
import { Button, Flex, Heading, Section } from '@radix-ui/themes';
import { partition } from 'lodash-es';
import { DateTime } from 'luxon';
import pluralize from 'pluralize';
import { useMemo, useState } from 'react';
import { CalendarEvent } from './CalendarEvent';
import { CalendarSession } from './types';

type DayProps = {
  date: DateTime;
  loading?: boolean;
  sessions: CalendarSession[];
};

export const Day: React.FC<DayProps> = ({ date, loading, sessions }) => {
  const [showAll, setShowAll] = useState(false);

  const [hidden, visible] = useMemo(() => partition(sessions, 'hidden'), [sessions]);

  return (
    <Section py="4">
      <Heading as="h2" mb="4">
        {date.toLocaleString({ weekday: 'long', month: 'long', day: 'numeric' })}
      </Heading>
      {loading ? (
        sessions.map((session) => <Skeleton key={session.id} height={90} radius="sm" />)
      ) : (
        <>
          {sessions.map((session) => (
            <Collapsible key={session.id} open={showAll || !session.hidden}>
              <CalendarEvent {...session} />
            </Collapsible>
          ))}
          <Collapsible open={hidden.length > 0}>
            <Flex justify="center">
              {showAll ? (
                <Button variant="outline" size="2" color="gray" onClick={() => setShowAll(false)}>
                  Collapse hidden events
                </Button>
              ) : (
                <Button variant="outline" size="2" color="gray" onClick={() => setShowAll(true)}>
                  {`Show ${hidden.length} hidden ${pluralize('event', hidden.length)}`}
                </Button>
              )}
            </Flex>
          </Collapsible>
        </>
      )}
    </Section>
  );
};
