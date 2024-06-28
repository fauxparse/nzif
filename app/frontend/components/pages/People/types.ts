import { ResultOf } from 'gql.tada';
import { AllPresentersQuery, PersonQuery } from './queries';

export type Person = NonNullable<ResultOf<typeof PersonQuery>['person']>;

export type Appearance = Person['appearances'][number];

export type FestivalPresenter = NonNullable<
  ResultOf<typeof AllPresentersQuery>
>['festival']['people'][number];
