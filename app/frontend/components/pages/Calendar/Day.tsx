import { Badge, Box, Button, Collapse, Group, Skeleton, Text, Title } from '@mantine/core';
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
    <Box component="section" className="calendar__day">
      <Title order={2}>
        {date.toLocaleString({ weekday: 'long', month: 'long', day: 'numeric' })}
      </Title>
      {loading ? (
        sessions.map((session) => <Skeleton key={session.id} height={90} radius="sm" />)
      ) : (
        <>
          {sessions.map((session) => (
            <Collapse key={session.id} in={showAll || !session.hidden}>
              <CalendarEvent {...session} />
            </Collapse>
          ))}
          <Collapse in={hidden.length > 0}>
            <Group align="baseline" justify="end" gap="var(--spacing-tiny)">
              {showAll ? (
                <Button variant="transparent" size="compact-sm" onClick={() => setShowAll(false)}>
                  Collapse hidden events
                </Button>
              ) : (
                <>
                  <Badge circle size="md">
                    {hidden.length}
                  </Badge>
                  <Text size="sm">{`hidden ${pluralize('event', hidden.length)}`}</Text>
                  <Button variant="transparent" size="compact-sm" onClick={() => setShowAll(true)}>
                    Show all
                  </Button>
                </>
              )}
            </Group>
          </Collapse>
        </>
      )}
    </Box>
  );
};
