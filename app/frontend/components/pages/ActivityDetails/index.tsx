import Placename from '@/components/atoms/Placename';
import ShareButton from '@/components/atoms/ShareButton';
import { Markdown } from '@/components/helpers/Markdown';
import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import { Permission } from '@/graphql/types';
import EditIcon from '@/icons/EditIcon';
import { useAuthentication } from '@/services/Authentication';
import sentence from '@/util/sentence';
import { randParagraph } from '@ngneat/falso';
import {
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  Inset,
  Section,
  Skeleton,
  Text,
} from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import { map, uniqBy } from 'lodash-es';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { AtAGlance } from './AtAGlance';
import { Presenters } from './Presenters';
import { Activity } from './types';

import classes from './ActivityDetails.module.css';
import { Cast } from './Cast';

type ActivityDetailsProps = {
  activity: Activity;
  loading?: boolean;
};

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity, loading }) => {
  const cities = useMemo(
    () => (loading ? [] : uniqBy(map(activity.presenters, 'city').filter(Boolean), 'id')),
    [activity.presenters, loading]
  );

  const { hasPermission } = useAuthentication();

  return (
    <>
      <Helmet>
        <title>{activity.name}</title>
      </Helmet>
      <Header
        background={
          !loading && activity.picture?.large
            ? {
                src: activity.picture.large,
                blurhash: activity.picture.blurhash,
              }
            : undefined
        }
        title={
          <>
            <Flex direction="column" gap="2">
              <Heading>
                <Skeleton loading={loading}>{loading ? 'Loading…' : activity.name}</Skeleton>
              </Heading>
              <Heading as="h2" size="6" weight="medium">
                <Skeleton loading={loading}>
                  {loading ? 'Loading…' : sentence(map(activity.presenters, 'name'))}
                </Skeleton>
              </Heading>
              <Flex wrap="wrap" gap="2">
                {cities.map((city) => city && <Placename key={city.id} city={city} />)}
              </Flex>
            </Flex>
          </>
        }
        actions={
          <Flex gap="3">
            <ShareButton />
            {hasPermission(Permission.Activities) && (
              <IconButton asChild variant="ghost" size="3" radius="full">
                <Link
                  to="/admin/$activityType/$slug"
                  params={{ activityType: activity.type, slug: activity.slug }}
                >
                  <EditIcon />
                </Link>
              </IconButton>
            )}
          </Flex>
        }
      />
      <Body>
        <Section className={classes.main}>
          <div className={classes.description}>
            {activity.tagline && (
              <Text
                as="div"
                size={{ initial: '4', sm: '5' }}
                weight="medium"
                className={classes.tagline}
              >
                <Markdown>{String(activity.tagline)}</Markdown>
              </Text>
            )}
            <Text as="div" size={{ initial: '3', sm: '4' }}>
              {loading ? (
                <Skeleton loading>{randParagraph()}</Skeleton>
              ) : (
                <Markdown>{String(activity.description)}</Markdown>
              )}
            </Text>
            {activity.quotes && (
              <Text as="div" size={{ initial: '3', sm: '4' }} className={classes.quotes}>
                <Markdown>{String(activity.quotes)}</Markdown>
              </Text>
            )}
            <Cast activity={activity} loading={loading} />
          </div>
          <AtAGlance activity={activity} loading={loading} />
          {activity.picture?.large && (
            <Box display={{ initial: 'none', sm: 'block' }}>
              <Card>
                <Inset>
                  <img
                    className={classes.picture}
                    src={activity.picture.large}
                    alt={activity.picture.altText || undefined}
                  />
                </Inset>
              </Card>
            </Box>
          )}
          <Presenters activity={activity} loading={loading} />
        </Section>
      </Body>
    </>
  );
};
