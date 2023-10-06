import React, { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { sortBy } from 'lodash-es';

import MessageComposer from '../MessageComposer';
import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import { ActivityType, TeachingSessionFragment, useTeachingSessionsQuery } from '@/graphql/types';
import Markdown from '@/helpers/Markdown';
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
  pronouns: string | null;
};

export const Component: React.FC = () => {
  const { loading, data } = useTeachingSessionsQuery();

  const { id } = useTypedParams(ROUTES.TEACHING.SESSION);

  const navigate = useNavigate();
  const location = useLocation();

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
    <BreadcrumbProvider label="Teaching" path="teaching">
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
              <li key={participant.id}>
                {participant.name}
                {participant.pronouns && (
                  <>
                    {' '}
                    <small>({participant.pronouns})</small>
                  </>
                )}
              </li>
            ))}
          </ul>
          <h2>Messages</h2>
          <MessageComposer
            session={session}
            open={location.pathname.endsWith('/message')}
            onClose={() => navigate(ROUTES.TEACHING.SESSION.buildPath({ id: session.id }))}
          />
          <p>
            Messages listed here have been sent to all participants, and will be sent to everyone
            who joins after they were sent.
          </p>
          <div className="session-messages">
            {session.messages.map((message) => (
              <details key={message.id} className="session-message">
                <summary>
                  <Icon name="chevronRight" />
                  <div className="session-message__sender">{message.sender.name}</div>
                  <div className="session-message__date">
                    {message.createdAt.toFormat('d MMMM, h:mm a')}
                  </div>
                </summary>
                <div className="session-message__content">
                  <Markdown>{message.content}</Markdown>
                </div>
              </details>
            ))}
          </div>
          <Button
            as={Link}
            to={ROUTES.TEACHING.SESSION.MESSAGE.buildPath({ id: session.id })}
            icon="email"
            text="New message"
          />
        </div>
      </div>
    </BreadcrumbProvider>
  );
};
