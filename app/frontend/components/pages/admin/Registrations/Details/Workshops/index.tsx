import { useConfirmation } from '@/components/organisms/ConfirmationModal';
import { FragmentOf } from '@/graphql';
import { ActivityType } from '@/graphql/types';
import MoreIcon from '@/icons/MoreIcon';
import WorkshopIcon from '@/icons/WorkshopIcon';
import { Box, Card, DropdownMenu, Flex, Heading, IconButton, Text } from '@radix-ui/themes';
import { Link as RouterLink } from '@tanstack/react-router';
import { sortBy } from 'lodash-es';
import { useMemo } from 'react';
import { useRegistrationDetails } from '../RegistrationDetailsProvider';
import { RegistrationSessionFragment, RemoveFromSessionMutation } from '../queries';

import { useMutation } from '@apollo/client';
import classes from './Workshops.module.css';

type Session = FragmentOf<typeof RegistrationSessionFragment>;

export const Workshops = () => {
  const { loading, registration } = useRegistrationDetails();

  const sessions = useMemo(() => {
    if (loading || !registration) return [];
    return sortBy(registration.sessions, 'startsAt');
  }, [loading, registration]);

  const { confirm } = useConfirmation();

  const [remove] = useMutation(RemoveFromSessionMutation);

  const removeFromSession = (session: Session) => {
    if (!registration) return;

    confirm({
      title: 'Remove from session',
      children: `Remove ${registration?.user?.name} from ${session.activity?.name}?`,
    }).then(() => {
      remove({
        variables: {
          registrationId: registration.id,
          sessionId: session.id,
        },
        optimisticResponse: {
          removeFromSession: {
            registration: {
              id: registration.id,
              sessions: registration.sessions.filter((s) => s.id !== session.id),
            },
          },
        },
      });
    });
  };

  return (
    <div className={classes.workshops}>
      {sessions.map((session) => (
        <Card key={session.id}>
          <Flex align="center" gap="4">
            <Box className={classes.cardIcon}>
              <WorkshopIcon size="3" />
            </Box>
            <Flex direction="column" gap="1" flexGrow="1">
              <Text as="div" size="2">
                {`${session.startsAt.plus({}).toFormat('cccc, d LLLL, h:mm a')} – ${session.endsAt.toFormat('h:mm a')}`}
              </Text>
              <Heading as="h3" size="5">
                {session.activity?.name}
              </Heading>
            </Flex>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton className={classes.more} variant="ghost" color="gray" radius="full">
                  <MoreIcon />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="2">
                {session.activity && (
                  <DropdownMenu.Item asChild>
                    <RouterLink
                      to="/admin/$activityType/$slug/$session"
                      params={{
                        activityType: ActivityType.Workshop,
                        slug: session.activity.slug,
                        session: session.startsAt,
                      }}
                    >
                      Go to session
                    </RouterLink>
                  </DropdownMenu.Item>
                )}
                <DropdownMenu.Item onSelect={() => removeFromSession(session)}>
                  Remove from session
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Card>
      ))}
    </div>
  );
};
