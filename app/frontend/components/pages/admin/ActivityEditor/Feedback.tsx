import { ResultOf } from '@/graphql';
import { Heading, Section, Text } from '@radix-ui/themes';
import { shuffle } from 'lodash-es';
import React, { useMemo } from 'react';
import { ActivityDetailsQuery } from './queries';

import classes from './ActivityEditor.module.css';

type Activity = NonNullable<ResultOf<typeof ActivityDetailsQuery>['festival']['activity']>;

const FeedbackTypes = ['positive', 'constructive', 'testimonial'] as const;

const FeedbackHeadings = {
  positive: 'Positive feedback',
  constructive: 'Constructive feedback',
  testimonial: 'Testimonials',
};

type Feedback = {
  [k in (typeof FeedbackTypes)[number]]: string;
};

type Feedbacks = {
  [k in keyof Feedback]: string[];
};

export type FeedbackProps = {
  activity: Activity;
};

export const Feedback: React.FC<FeedbackProps> = ({ activity }) => {
  const feedback = useMemo(() => {
    const empty = { positive: [], constructive: [], testimonial: [] };
    if (!('feedback' in activity)) {
      return empty;
    }
    return activity.feedback.reduce((acc: Feedbacks, feedback: Feedback): Feedbacks => {
      for (const k in feedback) {
        const key = k as keyof Feedback;
        if (feedback[key]) {
          acc[key] = shuffle([...(acc[key] || []), feedback[key]]);
        }
      }
      return acc;
    }, empty);
  }, [activity]);

  return (
    <div className={classes.feedback}>
      {FeedbackTypes.map((key) => (
        <Section key={key}>
          <Heading as="h3">{FeedbackHeadings[key]}</Heading>
          {feedback[key].length > 0 ? (
            feedback[key].map((text, i) => (
              <Text key={i} as="p">
                {text}
              </Text>
            ))
          ) : (
            <Text as="p" color="gray">
              No {key} feedback yet
            </Text>
          )}
        </Section>
      ))}
    </div>
  );
};
