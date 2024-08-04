import { Factory } from 'fishery';
import { DateTime } from 'luxon';
import { Optional } from 'utility-types';

import { Festival, FestivalState, RegistrationPhase } from '@/graphql/types';

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
      startDate: DateTime.local(transientParams.year || 2024, 10, 4),
      endDate: DateTime.local(transientParams.year || 2024, 10, 12),
      activities: associations.activities || [],
      slots: associations.slots || [],
      venues: associations.venues || [],
      state: FestivalState.Upcoming,
      earlybirdOpensAt: DateTime.local(transientParams.year || 2024, 8, 1),
      earlybirdClosesAt: DateTime.local(transientParams.year || 2024, 9, 1),
      generalOpensAt: DateTime.local(transientParams.year || 2024, 9, 8),
      registrationPhase: RegistrationPhase.Earlybird,
      registrations: associations.registrations || [],
      workshopAllocation: null,
    }) satisfies FestivalWithoutQueryMethods
).transient({ year: 2024 });

export default festivalFactory;
