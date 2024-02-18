import { sortBy } from 'lodash-es';
import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/Routes';
import Icon from '@/atoms/Icon';
import { ActivityType, CastingSessionFragment, useCastingSessionsQuery } from '@/graphql/types';
import BlurrableImage from '@/molecules/BlurrableImage';
import PageHeader from '@/molecules/PageHeader';
import Card from '@/organisms/Card';

import './Casting.css';

type ShowSession = Omit<CastingSessionFragment, 'activity'> & {
  activity: NonNullable<CastingSessionFragment['activity']>;
};

const isShowSession = (session: CastingSessionFragment): session is ShowSession =>
  session.activity?.type === ActivityType.Show;

export const Component: React.FC = () => {
  const { loading, data } = useCastingSessionsQuery();

  const navigate = useNavigate();

  const sessions = useMemo(
    () =>
      sortBy(
        (data?.user?.activities || []).flatMap((activity) =>
          activity.sessions.filter(isShowSession)
        ),
        'startsAt'
      ),
    [data]
  );

  useEffect(() => {
    if (!loading && !sessions.length) {
      navigate('/');
    }
  }, [loading, sessions, navigate]);

  return (
    <div className="casting">
      <PageHeader>
        <h1>Casting</h1>
      </PageHeader>
      <div className="casting__shows inset">
        {sessions.map((session) => (
          <Card
            key={session.id}
            as={Link}
            to={ROUTES.DIRECTING.SESSION.buildPath({ id: session.id })}
            className="programme__activity"
          >
            <div className="card__image">
              {session.activity.picture && (
                <BlurrableImage
                  className="show__image"
                  src={session.activity.picture.medium}
                  blurhash={session.activity.picture.blurhash}
                />
              )}
            </div>
            <div className="card__details">
              <h4 className="card__title activity__name">{session.activity.name}</h4>
              <dl>
                <dt>
                  <Icon name="calendar" />
                </dt>
                <dd>{session.startsAt.plus(0).toFormat('EEEE d MMMM, h:mm a')}</dd>
                {session.venue && (
                  <>
                    <dt>
                      <Icon name="location" />
                    </dt>
                    <dd>
                      {[session.venue.room, session.venue.building].filter(Boolean).join(' at ')}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
