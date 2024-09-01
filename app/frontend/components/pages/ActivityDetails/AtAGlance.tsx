import { useConfirmation } from '@/components/organisms/ConfirmationModal';
import { ActivityType } from '@/graphql/types';
import BATSIcon from '@/icons/BATSIcon';
import CalendarIcon from '@/icons/CalendarIcon';
import ClockIcon from '@/icons/ClockIcon';
import CloseIcon from '@/icons/CloseIcon';
import LocationIcon from '@/icons/LocationIcon';
import PlusIcon from '@/icons/PlusIcon';
import ShowIcon from '@/icons/ShowIcon';
import WaitlistIcon from '@/icons/WaitlistIcon';
import { useRegistration } from '@/services/Registration';
import { formatSessionTime } from '@/util/formatSessionTime';
import { mapLink } from '@/util/mapLink';
import {
  Button,
  Card,
  DataList,
  Flex,
  HoverCard,
  Inset,
  Link,
  Separator,
  Skeleton,
  Text,
} from '@radix-ui/themes';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { Activity } from './types';

import classes from './ActivityDetails.module.css';

type AtAGlanceProps = {
  activity: Activity;
  loading?: boolean;
};

export const AtAGlance: React.FC<AtAGlanceProps> = ({ activity, loading }) => {
  const { registration, leaveSession, leaveWaitlist, joinSession, joinWaitlist } =
    useRegistration();

  const inSession = (id: string | number) => registration?.sessions?.some((s) => s.id === id);

  const onWaitlist = (id: string | number) => registration?.waitlist?.some((s) => s.id === id);

  const { confirm } = useConfirmation();

  const toggle = (id: string | number) => {
    const joined = inSession(id);
    const waiting = onWaitlist(id);
    const session = activity.sessions.find((s) => s.id === id);

    if (!session || !registration?.id) return;

    if (joined || waiting) {
      confirm({
        title: waiting ? 'Leave waitlist' : 'Leave session',
        children: (
          <>
            <p>Are you sure you want to leave{waiting && ' the waitlist for'} this session?</p>
            {!waiting && session.full && (
              <p>This session is currently full, so someone else will be given your spot.</p>
            )}
          </>
        ),
      }).then(() => {
        (waiting ? leaveWaitlist : leaveSession)(String(id));
      });
    } else if (session.full) {
      joinWaitlist(String(id));
    } else {
      joinSession(String(id));
    }
  };

  const sessions = useMemo(
    () =>
      loading
        ? [
            {
              id: 1,
              startsAt: DateTime.now(),
              endsAt: DateTime.now(),
              venue: null,
              full: false,
            },
          ]
        : activity.sessions,
    [activity, loading]
  );

  return (
    <Card asChild className={classes.atAGlance}>
      <aside>
        {sessions.map((session, i) => (
          <Flex direction="column" gap="2" key={session.id}>
            {!!i && (
              <Inset side="x">
                <Separator size="4" my="2" />
              </Inset>
            )}
            <DataList.Root size="2" my="2">
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
            {activity.type === ActivityType.Workshop && registration?.id && session && (
              <Button type="button" variant="soft" size="2" onClick={() => toggle(session.id)}>
                {inSession(session.id) ? (
                  <>
                    <CloseIcon /> Leave workshop
                  </>
                ) : onWaitlist(session.id) ? (
                  <>
                    <CloseIcon /> Leave waitlist
                  </>
                ) : session.full ? (
                  <>
                    <WaitlistIcon /> Join waitlist
                  </>
                ) : (
                  <>
                    <PlusIcon /> Join workshop
                  </>
                )}
              </Button>
            )}
          </Flex>
        ))}
      </aside>
    </Card>
  );
};
