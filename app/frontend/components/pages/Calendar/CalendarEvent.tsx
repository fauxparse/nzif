import { activityColor } from '@/constants/activityTypes';
import { ActivityIcon } from '@/icons/ActivityIcon';
import { formatSessionTime } from '@/util/formatSessionTime';
import { Box, Collapse, Text, Title } from '@mantine/core';
import { CalendarSession } from './types';

type CalendarEventProps = CalendarSession;

export const CalendarEvent: React.FC<CalendarEventProps> = ({ session, hidden }) => {
  return (
    <Collapse in={!hidden}>
      <Box className="calendar__event" data-color={activityColor(session.activityType)}>
        <ActivityIcon activityType={session.activityType} />
        <Title order={4}>{session.activity.name}</Title>
        <Box className="calendar__event__details">
          <Text>
            {formatSessionTime(session)}
            {session.venue
              ? session.venue.room
                ? ` in ${session.venue.room} at ${session.venue.building}`
                : ` at ${session.venue.building}`
              : ' (venue TBC)'}
          </Text>
        </Box>
      </Box>
    </Collapse>
  );
};
