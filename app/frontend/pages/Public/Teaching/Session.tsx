import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { sortBy } from 'lodash-es';

import { ActivityType, TeachingSessionFragment, useTeachingSessionsQuery } from '@/graphql/types';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import { ROUTES } from '@/Routes';

import './Teaching.css';

type WorkshopSession = Omit<TeachingSessionFragment, 'activity'> & {
  activity: NonNullable<TeachingSessionFragment['activity']>;
};

const isWorkshopSession = (session: TeachingSessionFragment): session is WorkshopSession =>
  session.activity?.type === ActivityType.Workshop;

type Participant = {
  id: string;
  name: string;
};

export const Component: React.FC = () => {
  const { loading, data } = useTeachingSessionsQuery();

  const { id } = useTypedParams(ROUTES.TEACHING.SESSION);

  const navigate = useNavigate();

  const session = useMemo(
    () =>
      (data?.user?.activities || [])
        .flatMap((activity) => activity.sessions.filter(isWorkshopSession))
        .find((s) => s.id === id),
    [data, id]
  );

  useEffect(() => {
    if (!loading && !session) {
      navigate('/');
    }
  }, [loading, session, navigate]);

  const participants: Participant[] = useMemo(
    () =>
      sortBy(
        (session?.participants || []).map((p) => p.user?.profile).filter(Boolean),
        'name'
      ) as Participant[],
    [session]
  );

  if (!session) return null;

  return (
    <BreadcrumbProvider label="Teaching" path={ROUTES.TEACHING.path}>
      <div className="teaching">
        <PageHeader>
          <Breadcrumbs />
          <h1>{session.activity.name}</h1>
          <div>{session.startsAt.plus(0).toFormat('EEEE d MMMM, h:mm a')}</div>
        </PageHeader>
        <div className="teaching__session inset">
          <h2>Workshop participants</h2>
          <ul className="teaching__participants">
            {participants.map((participant) => (
              <li key={participant.id}>{participant.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </BreadcrumbProvider>
  );
};
