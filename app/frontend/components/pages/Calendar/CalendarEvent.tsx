import { ActivityType } from '@/graphql/types';
import ActivityIcon from '@/icons/ActivityIcon';
import BATSIcon from '@/icons/BATSIcon';
import EyeIcon from '@/icons/EyeIcon';
import { formatSessionTime } from '@/util/formatSessionTime';
import sentence from '@/util/sentence';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Text,
  Theme,
  Tooltip,
} from '@radix-ui/themes';
import { useCalendar } from './Context';
import { CalendarSession } from './types';

import { activityColor } from '@/constants/activityTypes';
import CheckIcon from '@/icons/CheckIcon';
import CloseIcon from '@/icons/CloseIcon';
import QuoteIcon from '@/icons/QuoteIcon';
import WaitlistIcon from '@/icons/WaitlistIcon';
import { useRegistration } from '@/services/Registration';
import { Link } from '@tanstack/react-router';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import classes from './Calendar.module.css';

type CalendarEventProps = CalendarSession;

export const CalendarEvent: React.FC<CalendarEventProps> = ({
  id,
  session,
  hidden,
  waitlisted,
  feedback,
}) => {
  const { show, hide, leave, setSelectedId } = useCalendar();

  const { registration } = useRegistration();

  const inSession = useMemo(() => {
    if (!registration) return false;
    return registration.sessions.some((s) => s.id === id);
  }, [registration, id]);

  const onWaitlist = useMemo(() => {
    if (!registration) return false;
    return registration.waitlist.some((s) => s.id === id);
  }, [registration, id]);

  const past = session.startsAt < DateTime.now();

  return (
    <Theme asChild accentColor={activityColor(session.activityType)}>
      <Card
        className={classes.event}
        mb="2"
        data-hidden={hidden || undefined}
        data-waitlisted={waitlisted || undefined}
      >
        {waitlisted ? (
          <WaitlistIcon className={classes.eventIcon} size="3" />
        ) : (
          <ActivityIcon
            className={classes.eventIcon}
            activityType={session.activityType}
            size="3"
          />
        )}
        <Heading as="h4" size="5" className={classes.eventName}>
          <Link
            to="/$activityType/$slug"
            params={{ activityType: session.activityType, slug: session.activity.slug }}
          >
            {session.activity.name}
          </Link>
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

          {session.activityType === ActivityType.Workshop && (
            <Flex gap="2" mt="2">
              {inSession && !past && (
                <Button variant="soft" onClick={() => leave(id)}>
                  <CloseIcon />
                  Leave workshop
                </Button>
              )}
              {onWaitlist && !past && (
                <Button variant="soft" onClick={() => leave(id)}>
                  <CloseIcon />
                  Leave waitlist
                </Button>
              )}
              {past && (
                <Button variant="soft" disabled={!!feedback} onClick={() => setSelectedId(id)}>
                  {feedback ? <CheckIcon /> : <QuoteIcon />}
                  Give feedback
                </Button>
              )}
            </Flex>
          )}
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
    </Theme>
  );
};
