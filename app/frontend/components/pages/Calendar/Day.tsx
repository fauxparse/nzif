import { Box, Title } from '@mantine/core';
import { DateTime } from 'luxon';
import { CalendarEvent } from './CalendarEvent';
import { CalendarSession } from './types';

type DayProps = {
  date: DateTime;
  sessions: CalendarSession[];
};

export const Day: React.FC<DayProps> = ({ date, sessions }) => {
  return (
    <Box component="section" className="calendar__day">
      <Title order={2}>
        {date.toLocaleString({ weekday: 'long', month: 'long', day: 'numeric' })}
      </Title>
      {sessions.map((session) => (
        <CalendarEvent key={session.id} {...session} />
      ))}
    </Box>
  );
};
