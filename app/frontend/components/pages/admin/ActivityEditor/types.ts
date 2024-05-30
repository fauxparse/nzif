import { ResultOf } from 'gql.tada';
import { ActivityDetailsQuery } from './queries';

export type Activity = NonNullable<ResultOf<typeof ActivityDetailsQuery>['festival']['activity']>;

export type Session = Activity['sessions'][number];

export type ActivityDetails = Pick<Activity, 'name' | 'slug' | 'description'>;
