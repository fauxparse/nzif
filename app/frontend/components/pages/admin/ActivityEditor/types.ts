import { ActivityType, Scalars } from '@/graphql/types';
import { ResultOf } from 'gql.tada';
import { ActivityDetailsQuery } from './queries';

export type Activity = NonNullable<ResultOf<typeof ActivityDetailsQuery>['festival']['activity']>;

export type Session = Activity['sessions'][number];

export type Presenter = { id: Scalars['ID']; name: string };

export type ActivityDetails = Pick<Activity, 'name' | 'type' | 'slug' | 'description'> & {
  presenters: Array<Presenter>;
};

export type Workshop = Extract<Activity, { tutors: Presenter[] }>;
export type Show = Extract<Activity, { directors: Presenter[] }>;

export const isWorkshop = (activity: Activity): activity is Workshop =>
  activity.type === ActivityType.Workshop;
export const isShow = (activity: Activity): activity is Show => activity.type === ActivityType.Show;
