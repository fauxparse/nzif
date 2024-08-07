import { ActivityType } from '@/graphql/types';
import { useFestival } from '@/hooks/useFestival';
import BATSIcon from '@/icons/BATSIcon';
import { Box, Button, Container, Flex, Grid, Text } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';

import WorkshopIcon from '@/icons/WorkshopIcon';
import classes from './Home.module.css';

export const Home = () => {
  const festival = useFestival();

  return (
    <div className={classes.home}>
      <Container className={classes.hero} size={{ initial: '1', md: '3' }} mx="4" my="9">
        <Grid columns={{ initial: '1', md: '2' }} gap="8">
          <Grid className={classes.upper} columns="1" rows="1fr auto">
            <h1>
              <Box className={classes.year} gridColumn="1" gridRow="1">
                <span>20</span>
                <span>{festival.startDate.toFormat('yy')}</span>
              </Box>
              <Box asChild className={classes.title} gridColumn="1" gridRow="1">
                <Text>
                  <span>New Zealand</span> <span>Improv</span> <span>Festival</span>
                </Text>
              </Box>
            </h1>
            <Box asChild gridColumn="1" gridRow="2">
              <Text size={{ initial: '5', md: '6' }} weight="medium">
                <span>
                  {festival.startDate.toFormat('d')}–{festival.endDate.toFormat('d MMMM')}
                </span>
                <span>Te Whanganui-a-Tara</span>
              </Text>
            </Box>
          </Grid>
          <Flex className={classes.lower} direction="column" align="stretch" justify="end" gap="3">
            <Text asChild color="gray" size="5" align="center" m="0">
              <p>
                A week of local, national, and international improvisation at BATS&nbsp;Theatre in
                Wellington.
              </p>
            </Text>
            <Button asChild size="4" variant="solid">
              <Link to="/register">
                <WorkshopIcon />
                Register for workshops
              </Link>
            </Button>
            <Button asChild size="3" variant="outline">
              <Link to="/$activityType" params={{ activityType: ActivityType.Workshop }}>
                Browse the programme
              </Link>
            </Button>
            <Button size="3" variant="outline" disabled>
              <BATSIcon size="3" />
              Tickets on sale soon
            </Button>
          </Flex>
        </Grid>
      </Container>
    </div>
  );
};
