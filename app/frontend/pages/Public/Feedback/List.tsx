import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { keyBy } from 'lodash-es';
import { DateTime } from 'luxon';

import Checkbox from '@/atoms/Checkbox';
import { FeedbackListQuery, useFeedbackListQuery } from '@/graphql/types';
import PageHeader from '@/molecules/PageHeader';
import { ROUTES } from '@/Routes';
import sentence from '@/util/sentence';

import './Feedback.css';

type FeedbackListItem = {
  session: FeedbackListQuery['registration']['sessions'][number];
  feedback: FeedbackListQuery['registration']['feedback'][number] | null;
};

export const Component: React.FC = () => {
  const { data } = useFeedbackListQuery();

  const now = useMemo(() => DateTime.now(), []);

  const listItems = useMemo<FeedbackListItem[]>(() => {
    const sessions = data?.registration?.sessions ?? [];
    const feedback = keyBy(data?.registration?.feedback ?? [], (f) => f.session.id);
    return sessions.map((session) => ({
      session,
      feedback: feedback[session.id] || null,
    }));
  }, [data]);

  return (
    <div className="feedback-list">
      <PageHeader>
        <h1>Workshop feedback</h1>
      </PageHeader>
      <div className="inset">
        <p>We’d really value your feedback on the workshops you attend at this Festival.</p>
        <p>
          If you have a few moments to answer a couple of quick questions, we’d really appreciate
          it.
        </p>

        <div className="feedback-list__sessions">
          {listItems.map(
            (item) =>
              item.session.activity && (
                <Link
                  to={ROUTES.FEEDBACK.SESSION.buildPath({ id: item.session.id })}
                  className="feedback-session"
                  key={item.session.id}
                  data-future={item.session.startsAt > now || undefined}
                >
                  <Checkbox checked={!!item.feedback} />
                  <span className="feedback-session__name">{item.session.activity.name}</span>
                  <span className="feedback-session__tutor">
                    {sentence((item.session.activity?.presenters || []).map((p) => p.name))}
                  </span>
                  <span className="feedback-session__date">
                    {item.session.startsAt.plus(0).toFormat('EEEE d MMMM')}
                  </span>
                </Link>
              )
          )}
        </div>
      </div>
    </div>
  );
};
