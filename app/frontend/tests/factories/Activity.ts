import { Factory } from 'fishery';

import { ActivityType, Session, Show, SocialEvent, Workshop } from '@/graphql/types';

type Activity = Workshop | Show | SocialEvent;

class ActivityFactory extends Factory<Activity> {
  defaults(type: ActivityType) {
    const id = this.sequence();
    return {
      __typename: String(type) as Activity['__typename'],
      type,
      description:
        'She peered at the rear of the arcade showed him broken lengths of damp chipboard and the dripping chassis of a gutted game console.',
    };
  }

  workshop() {
    return this.params({
      ...this.defaults(ActivityType.Workshop),
      tutors: [],
    });
  }

  show() {
    return this.params({
      ...this.defaults(ActivityType.Show),
      directors: [],
    });
  }

  socialEvent() {
    return this.params({
      ...this.defaults(ActivityType.SocialEvent),
      organisers: [],
    });
  }

  scheduled({ startsAt, endsAt }: Pick<Session, 'startsAt' | 'endsAt'>) {
    return this.afterBuild((activity) =>
      activity.sessions.push({
        __typename: 'Session',
        id: `session-${this.sequence()}`,
        startsAt,
        endsAt,
        activity,
        activityType: activity.type,
        venue: null,
      })
    );
  }
}

export const activityFactory = ActivityFactory.define(
  ({ sequence, associations }) =>
    ({
      id: `activity-${sequence}`,
      name: `Activity ${sequence}`,
      slug: `activity-${sequence}`,
      sessions: associations.sessions || [],
      picture: null,
      presenters: [],
    }) as unknown as Activity
);

export default activityFactory;
