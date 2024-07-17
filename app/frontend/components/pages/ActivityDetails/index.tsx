import Placename from '@/components/atoms/Placename';
import ShareButton from '@/components/atoms/ShareButton';
import { Markdown } from '@/components/helpers/Markdown';
import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import sentence from '@/util/sentence';
import { randParagraph } from '@ngneat/falso';
import { Flex, Heading, Section, Skeleton, Text } from '@radix-ui/themes';
import { map, uniqBy } from 'lodash-es';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Activity } from './types';

import classes from './ActivityDetails.module.css';
import { AtAGlance } from './AtAGlance';
import { Presenters } from './Presenters';

type ActivityDetailsProps = {
  activity: Activity;
  loading?: boolean;
};

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity, loading }) => {
  const cities = useMemo(
    () => (loading ? [] : uniqBy(map(activity.presenters, 'city').filter(Boolean), 'id')),
    [activity.presenters, loading]
  );

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
        actions={<ShareButton />}
      />
      <Body>
        <Section className={classes.main}>
          <div className={classes.description}>
            {loading ? (
              <Text>
                <Skeleton loading>{randParagraph()}</Skeleton>
              </Text>
            ) : (
              <Text asChild size="4">
                <Markdown>{String(activity.description)}</Markdown>
              </Text>
            )}
          </div>
          <AtAGlance activity={activity} loading={loading} />
          <Presenters activity={activity} loading={loading} />
        </Section>
      </Body>
    </>
  );
};
