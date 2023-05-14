import { ActivityType } from '@/graphql/types';

type WithPresenters<T> =
  | {
      type: ActivityType.Workshop;
      tutors: T[];
    }
  | {
      type: ActivityType.Show;
      directors: T[];
    }
  | {
      type: ActivityType.SocialEvent;
      organisers: T[];
    };

const presenters = <T>(activity: WithPresenters<T>): T[] => {
  switch (activity.type) {
    case ActivityType.Workshop:
      return activity.tutors;
    case ActivityType.Show:
      return activity.directors;
    case ActivityType.SocialEvent:
      return activity.organisers;
  }
};

export default presenters;
