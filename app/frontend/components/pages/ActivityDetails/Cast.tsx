import { CastMemberFragment } from '@/components/organisms/ShowCast/queries';
import { FragmentOf } from '@/graphql';
import { ActivityType } from '@/graphql/types';
import { Card, Heading, Inset, Separator } from '@radix-ui/themes';
import { isEmpty } from 'lodash-es';
import { DateTime } from 'luxon';
import { Fragment, useMemo } from 'react';
import { Activity } from './types';

import pluralize from 'pluralize';
import classes from './ActivityDetails.module.css';

type CastMember = FragmentOf<typeof CastMemberFragment>;

const Roles = {
  hosts: 'Host',
  performers: 'Performer',
  musos: 'Musician',
  operators: 'Operator',
} as const;

type Role = keyof typeof Roles;

type CastProps = {
  activity: Activity;
  loading?: boolean;
};

const isShow = (activity: Activity): activity is Activity & { type: ActivityType.Show } =>
  activity.type === ActivityType.Show;

export const Cast: React.FC<CastProps> = ({ activity, loading }) => {
  const sessions = useMemo(() => (loading ? [] : activity.sessions), [activity, loading]);

  const cast = useMemo(() => {
    const roles = ['hosts', 'performers', 'musos', 'operators'] as const;
    return sessions.reduce((allSessions: [DateTime, [Role, CastMember[]][]][], session) => {
      const cast = roles.reduce(
        (acc, role) => (isEmpty(session[role]) ? acc : acc.concat([[role, session[role]]])),
        [] as [Role, CastMember[]][]
      );
      if (isEmpty(cast)) return allSessions;
      return allSessions.concat([[session.startsAt, cast]]);
    }, []);
  }, [activity]);

  if (isEmpty(cast)) return null;

  return (
    <Card mt="6" className={classes.cast}>
      {cast.map(([date, castMembers], i) => (
        <Fragment key={date.valueOf()}>
          {i > 0 && (
            <Inset side="x" my="4">
              <Separator />
            </Inset>
          )}
          {cast.length > 0 && (
            <Heading as="h4" size="2" mb="2">
              {`Cast for ${date.plus({}).toFormat('EEEE d MMMM')}`}
            </Heading>
          )}
          {castMembers.map(([role, members]) => (
            <Fragment key={role}>
              <Heading as="h5" size="3">
                {pluralize(Roles[role], members.length)}
              </Heading>

              <ul>
                {members.map((member) => (
                  <li key={member.id}>
                    {member.name}{' '}
                    {member.pronouns && <small>({member.pronouns.toLowerCase()})</small>}
                  </li>
                ))}
              </ul>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </Card>
  );
};
