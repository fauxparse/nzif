import { CSSProperties, useMemo } from 'react';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { map, range, shuffle, sum, upperFirst } from 'lodash-es';

import Icon from '@/atoms/Icon';
import { useActivityFeedbackQuery } from '@/graphql/types';
import { ROUTES } from '@/Routes';

export const Component: React.FC = () => {
  const { slug } = useTypedParams(ROUTES.ADMIN.ACTIVITY.FEEDBACK);
  const { data } = useActivityFeedbackQuery({
    variables: { slug },
  });

  const feedback = useMemo(() => {
    const workshop = data?.festival?.activity;
    return workshop?.__typename === 'Workshop' ? workshop.feedback : [];
  }, [data]);

  const rating = useMemo(() => {
    const ratings = map(feedback, 'rating').filter(Boolean);
    return (sum(ratings) / (ratings.length || 1) - 1) / 6;
  }, [feedback]);

  const comments = useMemo(
    () =>
      ['positive', 'constructive', 'testimonial'].reduce(
        (acc, field) => ({
          ...acc,
          [field]: shuffle(map(feedback, field).filter(Boolean)),
        }),
        {} as Record<'positive' | 'constructive' | 'testimonial', string[]>
      ),
    [feedback]
  );

  if (!feedback.length)
    return (
      <div className="inset">
        <p>No feedback yet.</p>
      </div>
    );

  return (
    <div className="inset feedback-summary">
      <div
        className="feedback-summary__rating"
        style={{ '--percentage': `${rating * 100}%` } as CSSProperties}
      >
        <div className="off">
          {range(7).map((i) => (
            <Icon key={i} name="star" />
          ))}
        </div>
        <div className="on">
          {range(7).map((i) => (
            <Icon key={i} name="star" />
          ))}
        </div>
      </div>
      {['positive', 'constructive', 'testimonial'].map((field) => (
        <section key={field}>
          <h3>{upperFirst(field)}</h3>
          {comments[field as keyof typeof comments].map((comment, i) => (
            <p key={i}>{comment}</p>
          ))}
        </section>
      ))}
    </div>
  );
};
