import { sortBy, uniqBy } from 'lodash-es';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { ROUTES } from '@/Routes';
import { RegistrationStatusQuery, useRegistrationStatusQuery } from '@/graphql/types';

type Session = RegistrationStatusQuery['registration']['sessions'][number];

type Waitlist = RegistrationStatusQuery['registration']['waitlist'][number];

const Placements = () => {
  const { id } = useTypedParams(ROUTES.ADMIN.PERSON);

  const { data } = useRegistrationStatusQuery({ variables: { id } });

  const sessions = useMemo(
    () =>
      (data?.registration?.sessions ?? []).reduce(
        (acc, session) => acc.set(session.startsAt, session),
        new Map<DateTime, Session>()
      ),
    [data]
  );

  const waitlists = useMemo(
    () =>
      (data?.registration?.waitlist ?? []).reduce(
        (acc, waitlist) =>
          acc.set(waitlist.startsAt, [...(acc.get(waitlist.startsAt) || []), waitlist]),
        new Map<DateTime, Waitlist[]>()
      ),
    [data]
  );

  const slots = useMemo(
    () =>
      uniqBy(sortBy([...sessions.keys(), ...waitlists.keys()]), (d) => d.valueOf()).map((t) => ({
        startsAt: t,
        session: sessions.get(t) || null,
        waitlists: waitlists.get(t) || [],
      })),
    [sessions, waitlists]
  );

  const preference = (session: Session) =>
    (data?.registration?.preferences ?? []).find((p) => p.workshop?.id === session.workshop?.id)
      ?.position || undefined;

  return (
    <div className="inset registration-summary">
      {slots.map(({ startsAt, session, waitlists }) => (
        <section key={startsAt.valueOf()} className="placement">
          <h4>{startsAt.plus(0).toFormat('cccc d MMMM, h:mm a')}</h4>
          {session?.workshop ? (
            <div className="placement__session">
              <div className="placement__workshop">
                <Link
                  to={ROUTES.ADMIN.ACTIVITY.SESSION.buildPath({
                    type: 'workshops',
                    slug: session.workshop.slug,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    date: session.startsAt.toISODate() || '',
                  })}
                >
                  {session.workshop.name}
                </Link>
              </div>
            </div>
          ) : (
            <p className="placement__session--empty">(Not currently in a session)</p>
          )}
          {waitlists.length > 0 && (
            <>
              <p>Waitlisted for:</p>
              <ul className="placement__waitlist">
                {waitlists.map(
                  (waitlist) =>
                    waitlist.workshop && (
                      <li key={waitlist.id} data-preference={preference(waitlist)}>
                        <Link
                          to={ROUTES.ADMIN.ACTIVITY.SESSION.buildPath({
                            type: 'workshops',
                            slug: waitlist.workshop.slug,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            date: waitlist.startsAt.toISODate() || '',
                          })}
                        >
                          {waitlist.workshop.name}
                        </Link>
                      </li>
                    )
                )}
              </ul>
            </>
          )}
        </section>
      ))}
    </div>
  );
};

export default Placements;
