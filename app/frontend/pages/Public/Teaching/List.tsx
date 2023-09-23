import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sortBy } from 'lodash-es';

import Icon from '@/atoms/Icon';
import { ActivityType, TeachingSessionFragment, useTeachingSessionsQuery } from '@/graphql/types';
import BlurrableImage from '@/molecules/BlurrableImage';
import PageHeader from '@/molecules/PageHeader';
import Card from '@/organisms/Card';
import { ROUTES } from '@/Routes';

import './Teaching.css';

type WorkshopSession = Omit<TeachingSessionFragment, 'activity'> & {
  activity: NonNullable<TeachingSessionFragment['activity']>;
};

const isWorkshopSession = (session: TeachingSessionFragment): session is WorkshopSession =>
  session.activity?.type === ActivityType.Workshop;

export const Component: React.FC = () => {
  const { loading, data } = useTeachingSessionsQuery();

  const navigate = useNavigate();

  const sessions = useMemo(
    () =>
      sortBy(
        (data?.user?.activities || []).flatMap((activity) =>
          activity.sessions.filter(isWorkshopSession)
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
    <div className="teaching">
      <PageHeader>
        <h1>Teaching</h1>
      </PageHeader>
      <div className="teaching__workshops inset">
        {sessions.map((session) => (
          <Card
            key={session.id}
            as={Link}
            to={ROUTES.TEACHING.SESSION.buildPath({ id: session.id })}
            className="programme__activity"
          >
            <div className="card__image">
              {session.activity.picture && (
                <BlurrableImage
                  className="workshop__image"
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
                <dt>
                  <Icon name="user" />
                </dt>
                <dd>
                  {session.participants.length} / {session.capacity}
                </dd>
              </dl>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
