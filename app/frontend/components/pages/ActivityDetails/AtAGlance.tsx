import BATSIcon from '@/icons/BATSIcon';
import CalendarIcon from '@/icons/CalendarIcon';
import ClockIcon from '@/icons/ClockIcon';
import LocationIcon from '@/icons/LocationIcon';
import ShowIcon from '@/icons/ShowIcon';
import { formatSessionTime } from '@/util/formatSessionTime';
import { mapLink } from '@/util/mapLink';
import { Card, DataList, HoverCard, Link, Skeleton, Text } from '@radix-ui/themes';
import { DateTime } from 'luxon';
import { Fragment, useMemo } from 'react';
import { Activity } from './types';

import classes from './ActivityDetails.module.css';

type AtAGlanceProps = {
  activity: Activity;
  loading?: boolean;
};

export const AtAGlance: React.FC<AtAGlanceProps> = ({ activity, loading }) => {
  const sessions = useMemo(
    () =>
      loading
        ? [
            {
              id: 1,
              startsAt: DateTime.now(),
              endsAt: DateTime.now(),
              venue: null,
            },
          ]
        : activity.sessions,
    [activity, loading]
  );

  return (
    <Card asChild className={classes.atAGlance}>
      <aside>
        <DataList.Root size="3">
          {sessions.map((session) => (
            <Fragment key={session.id}>
              <DataList.Item>
                <DataList.Label>
                  <Skeleton loading={loading}>
                    <CalendarIcon title="Date" />
                  </Skeleton>
                </DataList.Label>
                <DataList.Value>
                  <Skeleton loading={loading}>
                    {session.startsAt.plus({}).toFormat('EEEE d MMMM')}
                  </Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>
                  <Skeleton loading={loading}>
                    <ClockIcon title="Time" />
                  </Skeleton>
                </DataList.Label>
                <DataList.Value>
                  <Skeleton loading={loading}>{formatSessionTime(session)}</Skeleton>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>
                  <Skeleton loading={loading}>
                    {session.venue && !session.venue.building.match(/^BATS/) ? (
                      <BATSIcon variant="not" title="Not at BATS" />
                    ) : (
                      <LocationIcon title="Venue" />
                    )}
                  </Skeleton>
                </DataList.Label>
                <DataList.Value>
                  {session.venue ? (
                    <HoverCard.Root>
                      <HoverCard.Trigger>
                        <Skeleton loading={loading}>
                          <Link
                            href={mapLink(session.venue)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {[session.venue.room, session.venue.building].join(' at ')}
                          </Link>
                        </Skeleton>
                      </HoverCard.Trigger>
                      <HoverCard.Content side="top" sideOffset={4}>
                        <Text asChild weight="medium">
                          <div>{[session.venue.room, session.venue.building].join(' at ')}</div>
                        </Text>
                        <Text asChild>
                          <div>{session.venue.address}, Wellington</div>
                        </Text>
                        <Text asChild color="gray" size="2">
                          <div>(click for map)</div>
                        </Text>
                      </HoverCard.Content>
                    </HoverCard.Root>
                  ) : (
                    <Skeleton loading={loading}>Venue TBC</Skeleton>
                  )}
                </DataList.Value>
              </DataList.Item>
            </Fragment>
          ))}
          {!!activity.bookingLink && (
            <DataList.Item>
              <DataList.Label>
                <Skeleton loading={loading}>
                  <ShowIcon title="Book tickets" />
                </Skeleton>
              </DataList.Label>
              <DataList.Value>
                <Skeleton loading={loading}>
                  <Link href={activity.bookingLink} target="_blank" rel="noreferrer">
                    Book tickets
                  </Link>
                </Skeleton>
              </DataList.Value>
            </DataList.Item>
          )}
        </DataList.Root>
      </aside>
    </Card>
  );
};
