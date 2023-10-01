import { Fragment, useMemo } from 'react';
import { sortBy, upperFirst } from 'lodash-es';
import { DateTime } from 'luxon';

import { CastMemberFragment, MasterCastListQuery } from '@/graphql/types';

export type Slot = MasterCastListQuery['festival']['slots'][number];

export type Session = Slot['sessions'][number];

export type Day = { date: DateTime; sessions: Slot['sessions'] };

export const ROLES = ['hosts', 'musos', 'performers', 'operators'] as const;

type CastListProps = {
  session: Session;
};

const CastList: React.FC<CastListProps> = ({ session }) => {
  const cast = useMemo(
    () =>
      ROLES.reduce(
        (acc, role) => ({ ...acc, [role]: sortBy(session[role], 'name') as CastMemberFragment[] }),
        {} as Record<(typeof ROLES)[number], CastMemberFragment[]>
      ),
    [session]
  );

  const empty = useMemo(() => ROLES.every((role) => !cast[role]?.length), [cast]);

  if (!session.activity) return null;

  return (
    <div className="cast-list" key={session.id}>
      <h3>
        {session.startsAt.toLocaleString(DateTime.TIME_SIMPLE)} {session.activity.name}
      </h3>
      {empty ? (
        <p>No cast assigned</p>
      ) : (
        <dl>
          {ROLES.map(
            (role) =>
              !!session[role]?.length && (
                <Fragment key={role}>
                  <dt>{upperFirst(role)}</dt>
                  {cast[role].map((person) => (
                    <dd key={person.id}>{person.name}</dd>
                  ))}
                </Fragment>
              )
          )}
        </dl>
      )}
    </div>
  );
};

export default CastList;
