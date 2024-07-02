import { ActivityType } from '@/graphql/types';
import ActivityIcon from '@/icons/ActivityIcon';
import BATSIcon from '@/icons/BATSIcon';
import EyeIcon from '@/icons/EyeIcon';
import { formatSessionTime } from '@/util/formatSessionTime';
import sentence from '@/util/sentence';
import { Box, Card, Heading, IconButton, Text, Tooltip } from '@radix-ui/themes';
import { useCalendar } from './Context';
import { CalendarSession } from './types';

import classes from './Calendar.module.css';

type CalendarEventProps = CalendarSession;

export const CalendarEvent: React.FC<CalendarEventProps> = ({ id, session, hidden }) => {
  const { show, hide } = useCalendar();

  return (
    <Card className={classes.event} mb="2" data-hidden={hidden || undefined}>
      <ActivityIcon className={classes.eventIcon} activityType={session.activityType} size="lg" />
      <Heading as="h4" size="5" className={classes.eventName}>
        {session.activity.name}
      </Heading>
      <Box className={classes.eventDetails}>
        <Text as="div">
          {formatSessionTime(session)}
          {session.venue
            ? session.venue.room
              ? ` in ${session.venue.room} at ${session.venue.building}`
              : ` at ${session.venue.building}`
            : ' (venue TBC)'}
        </Text>
        <Text as="div">
          {sentence(session.activity.presenters.map((presenter) => presenter.name))}
        </Text>
      </Box>
      {session.activityType !== ActivityType.Workshop && (
        <Tooltip content={`${hidden ? 'Hidden' : 'Hide'} from my calendar`}>
          <IconButton
            className={classes.eventHide}
            variant="ghost"
            radius="full"
            onClick={() => (hidden ? show : hide)(id)}
          >
            <EyeIcon variant={hidden ? 'hidden' : 'outline'} />
          </IconButton>
        </Tooltip>
      )}
      {session.venue && !session.venue.building.includes('BATS') && (
        <Tooltip content="This activity is not at BATS. Please allow extra time to travel.">
          <Box className={classes.eventBats}>
            <BATSIcon variant="not" />
          </Box>
        </Tooltip>
      )}
    </Card>
  );
};
