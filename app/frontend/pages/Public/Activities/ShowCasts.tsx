import { useMemo } from 'react';
import { isEmpty } from 'lodash-es';
import pluralize from 'pluralize';

import { ActivityDetailsQuery } from '@/graphql/types';

type Activity = ActivityDetailsQuery['festival']['activity'];

type Show = Extract<Activity, { __typename: 'Show' }>;

type Session = Show['sessions'][number];

type ShowCastsProps = {
  show: Show;
};

const ROLES = ['hosts', 'performers', 'musos', 'operators'] as const;

const ROLE_LABELS: Record<(typeof ROLES)[number], string> = {
  hosts: 'Host',
  performers: 'Performer',
  musos: 'Musician',
  operators: 'Operator',
} as const;

const ShowCasts: React.FC<ShowCastsProps> = ({ show }) => {
  const casts = useMemo(
    () =>
      show.sessions.reduce(
        (acc: Session[], session: Session) =>
          ROLES.some((role) => (session[role] || []).length > 0) ? [...acc, session] : acc,
        [] as Session[]
      ),
    [show]
  );

  if (casts.length === 0) return null;

  return (
    <div className="show-casts">
      <h2>Featuring</h2>
      {casts.map((session) => (
        <>
          {casts.length > 1 && <h3>{session.startsAt.plus(0).toFormat('EEEE d MMMM')}</h3>}
          <dl>
            {ROLES.map(
              (role) =>
                !isEmpty(session[role]) && (
                  <>
                    <dt>{pluralize(ROLE_LABELS[role], session[role].length)}</dt>
                    {session[role].map(({ id, name, pronouns }) => (
                      <dd key={id}>
                        {name} {pronouns && <small>({pronouns})</small>}
                      </dd>
                    ))}
                  </>
                )
            )}
          </dl>
        </>
      ))}
    </div>
  );
};

export default ShowCasts;
