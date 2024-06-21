import { activityColor } from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import { ActivityIcon } from '@/icons/ActivityIcon';
import BATSIcon from '@/icons/BATSIcon';
import EyeIcon from '@/icons/EyeIcon';
import { formatSessionTime } from '@/util/formatSessionTime';
import sentence from '@/util/sentence';
import { ActionIcon, Box, Text, Title, Tooltip } from '@mantine/core';
import { useCalendar } from './Context';
import { CalendarSession } from './types';

type CalendarEventProps = CalendarSession;

export const CalendarEvent: React.FC<CalendarEventProps> = ({ id, session, hidden }) => {
  const { show, hide } = useCalendar();

  return (
    <Box
      className="calendar__event"
      data-color={activityColor(session.activityType)}
      data-hidden={hidden || undefined}
    >
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
        <Text>{sentence(session.activity.presenters.map((presenter) => presenter.name))}</Text>
      </Box>
      {session.activityType !== ActivityType.Workshop && (
        <Tooltip label={`${hidden ? 'Hidden' : 'Hide'} from my calendar`}>
          <ActionIcon
            className="calendar__event__hide"
            variant="transparent"
            data-color={activityColor(session.activityType)}
            onClick={() => (hidden ? show : hide)(id)}
          >
            <EyeIcon variant={hidden ? 'hidden' : 'outline'} />
          </ActionIcon>
        </Tooltip>
      )}
      {session.venue && !session.venue.building.includes('BATS') && (
        <Tooltip label="This activity is not at BATS. Please allow extra time to travel.">
          <Box className="calendar__event__not-at-bats">
            <BATSIcon variant="not" />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};
