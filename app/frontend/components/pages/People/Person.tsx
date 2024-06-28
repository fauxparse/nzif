import { ParagraphSkeleton } from '@/components/helpers/Skeleton';
import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import Markdown from '@/helpers/Markdown';
import { Image, Skeleton, Text } from '@mantine/core';
import React, { useMemo } from 'react';
import { Appearance, Person as PersonType } from './types';

import './People.css';
import { ActivityType } from '@/graphql/types';
import { Appearances } from './Appearances';

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
            {loading ? (
              <Skeleton className="person__photo" width={128} height={128} radius="50%" />
            ) : (
              person.picture && (
                <Image
                  src={person.picture.medium}
                  alt={person.name}
                  className="person__photo"
                  radius="50%"
                />
              )
            )}
            <Skeleton visible={loading} radius="sm" width={loading ? '40%' : undefined}>
              <h1>{person?.name ?? 'Loading…'}</h1>
            </Skeleton>
          </>
        }
      />
      <Body>
        <section className="person__bio">
          {loading ? (
            <div>
              <ParagraphSkeleton />
            </div>
          ) : (
            <>
              {person.bio ? (
                <Markdown>{String(person.bio)}</Markdown>
              ) : (
                <Text size="md">This person has not provided a bio.</Text>
              )}
            </>
          )}
        </section>
        <section className="person__appearances">
          <Appearances
            title="Workshops"
            appearances={appearances.get(ActivityType.Workshop) || []}
          />
          <Appearances title="Shows" appearances={appearances.get(ActivityType.Show) || []} />
          <Appearances
            title="Conferences"
            appearances={appearances.get(ActivityType.Conference) || []}
          />
        </section>
      </Body>
    </>
  );
};
