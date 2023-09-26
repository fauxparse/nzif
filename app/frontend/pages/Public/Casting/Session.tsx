import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { sortBy, upperFirst } from 'lodash-es';

import { ActivityType, CastingSessionFragment, useCastingSessionsQuery } from '@/graphql/types';
import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import PersonPicker from '@/molecules/PersonPicker';
import { ROUTES } from '@/Routes';

import Section from './Section';

import './Casting.css';

type ShowSession = Omit<CastingSessionFragment, 'activity'> & {
  activity: NonNullable<CastingSessionFragment['activity']>;
};

const isShowSession = (session: CastingSessionFragment): session is ShowSession =>
  session.activity?.type === ActivityType.Show;

type Participant = {
  id: string;
  name: string;
};

const ROLES = ['hosts', 'performers', 'musos', 'operators'] as const;

export const Component: React.FC = () => {
  const { loading, data } = useCastingSessionsQuery();

  const { id } = useTypedParams(ROUTES.DIRECTING.SESSION);

  const navigate = useNavigate();

  const session = useMemo(
    () =>
      (data?.user?.activities || [])
        .flatMap((activity) => activity.sessions.filter(isShowSession))
        .find((s) => s.id === id),
    [data, id]
  );

  useEffect(() => {
    if (!loading && !session) {
      navigate('/');
    }
  }, [loading, session, navigate]);

  // const participants: Participant[] = useMemo(
  //   () =>
  //     sortBy(
  //       (session?.participants || []).map((p) => p.user?.profile).filter(Boolean),
  //       'name'
  //     ) as Participant[],
  //   [session]
  // );

  if (!session) return null;

  return (
    <BreadcrumbProvider label="Casting" path={ROUTES.DIRECTING.path}>
      <div className="casting">
        <PageHeader>
          <Breadcrumbs />
          <h1>{session.activity.name}</h1>
          <div>{session.startsAt.plus(0).toFormat('EEEE d MMMM, h:mm a')}</div>
        </PageHeader>
        <div className="casting__session inset">
          {ROLES.map((role) => (
            <Section key={role} role={role} session={session} />
          ))}
        </div>
      </div>
    </BreadcrumbProvider>
  );
};
