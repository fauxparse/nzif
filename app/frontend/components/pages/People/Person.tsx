import { Markdown } from '@/components/helpers/Markdown';
import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import { ActivityType } from '@/graphql/types';
import { randParagraph } from '@ngneat/falso';
import { Heading, Section, Skeleton, Text } from '@radix-ui/themes';
import React, { useMemo } from 'react';
import { Appearance, Person as PersonType } from './types';

import { Appearances } from './Appearances';
import classes from './People.module.css';

type PersonProps = {
  person: PersonType;
  loading?: boolean;
};

export const Person: React.FC<PersonProps> = ({ person }) => {
  const loading = !person;

  const appearances = useMemo(
    () =>
      (person?.appearances || ([] as Appearance[])).reduce((map, appearance) => {
        return map.set(appearance.activity.type, [
          ...(map.get(appearance.activity.type) || []),
          appearance,
        ]);
      }, new Map<ActivityType, Appearance[]>()),
    [person]
  );

  return (
    <>
      <Header
        title={
          <>
            <Heading>
              <Skeleton loading={loading}>{loading ? 'Loading…' : person.name}</Skeleton>
            </Heading>
            <Text size="6" weight="medium">
              <Skeleton loading={loading}>{person?.pronouns?.toLowerCase()}</Skeleton>
            </Text>
          </>
        }
      />
      <Body>
        <Section className={classes.main}>
          <div className={classes.bio}>
            {loading ? (
              <Text size="4">
                <Skeleton loading>{randParagraph()}</Skeleton>
              </Text>
            ) : (
              <Text asChild size="4">
                <Markdown>{String(person?.bio)}</Markdown>
              </Text>
            )}
          </div>
          <div className={classes.portrait}>
            {loading ? (
              <Skeleton width="100%" />
            ) : (
              person?.picture?.large && <img src={person.picture.large} alt={person.name} />
            )}
          </div>
          <div className={classes.appearances}>
            <Appearances
              loading={loading}
              title="Workshops"
              appearances={appearances.get(ActivityType.Workshop) || []}
            />
            <Appearances
              title="Shows"
              loading={loading}
              appearances={appearances.get(ActivityType.Show) || []}
            />
            <Appearances
              loading={loading}
              title="Conferences"
              appearances={appearances.get(ActivityType.Conference) || []}
            />
          </div>
        </Section>
      </Body>
    </>
  );
};
