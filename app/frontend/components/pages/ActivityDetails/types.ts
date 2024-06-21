import { ResultOf } from '@/graphql';
import { ActivityDetailsQuery } from './queries';

export type Activity = NonNullable<ResultOf<typeof ActivityDetailsQuery>['festival']['activity']>;
