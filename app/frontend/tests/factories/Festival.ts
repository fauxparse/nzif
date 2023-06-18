import { Factory } from 'fishery';
import { DateTime } from 'luxon';
import { Optional } from 'utility-types';

import { Festival, FestivalState } from '@/graphql/types';

type FestivalWithoutQueryMethods = Optional<Festival, 'timetable' | 'activity'>;

type FestivalTransientParams = {
  year: number;
};

class FestivalFactory extends Factory<FestivalWithoutQueryMethods, FestivalTransientParams> {}

const festivalFactory = FestivalFactory.define(
  ({ transientParams, associations }) =>
    ({
      __typename: 'Festival',
      id: String(transientParams.year),
      startDate: DateTime.local(transientParams.year || 2023, 10, 7),
      endDate: DateTime.local(transientParams.year || 2023, 10, 14),
      activities: associations.activities || [],
      slots: associations.slots || [],
      venues: associations.venues || [],
      state: FestivalState.Upcoming,
    } satisfies FestivalWithoutQueryMethods)
).transient({ year: 2023 });

export default festivalFactory;
