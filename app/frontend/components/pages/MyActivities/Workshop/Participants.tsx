import Placename from '@/components/atoms/Placename';
import LocationIcon from '@/icons/LocationIcon';
import UserIcon from '@/icons/UserIcon';
import { Avatar, Badge, Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { sortBy } from 'lodash-es';
import { useMemo } from 'react';
import classes from './Workshop.module.css';
import { useWorkshopSession } from './WorkshopProvider';

export const Participants: React.FC = () => {
  const { session } = useWorkshopSession();

  const participants = useMemo(() => sortBy(session.participants, 'user.profile.name'), [session]);

  return (
    <div>
      <Heading as="h2">{`${participants.length}/${session.capacity} participants`}</Heading>
      <div className={classes.participants} role="list">
        {participants.map((participant) => (
          <Card size="1" key={participant.id} className={classes.participant} role="listitem">
            <Avatar
              className={classes.icon}
              radius="full"
              src={participant.user?.profile?.picture?.medium}
              fallback={<UserIcon />}
            />
            <Box className={classes.name}>
              <Text size={{ initial: '3', sm: '4' }} weight="medium">
                {participant.user?.profile?.name}
                {participant.user?.profile?.pronouns && (
                  <Text
                    weight="regular"
                    color="gray"
                  >{` (${participant.user.profile.pronouns.toLowerCase()})`}</Text>
                )}
              </Text>
            </Box>
            <Box className={classes.location}>
              {participant.user?.profile?.city ? (
                <Placename city={participant.user?.profile?.city} />
              ) : (
                <Badge asChild radius="full" size="1" color="gray">
                  <Flex align="center" pr={{ sm: '3' }} pl={{ sm: '1' }}>
                    <LocationIcon variant="filled" size="1" />
                    <Text size={{ initial: '1', sm: '2' }}>Unknown</Text>
                  </Flex>
                </Badge>
              )}
            </Box>
          </Card>
        ))}
      </div>
    </div>
  );
};
