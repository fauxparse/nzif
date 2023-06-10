import { useReducer, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { range } from 'lodash-es';
import { DateTime } from 'luxon';

import {
  ActivityType,
  RegistrationWorkshopFragment,
  RegistrationWorkshopSlotFragment,
  useRegistrationQuery,
} from '@/graphql/types';

import HowWorkshopsWork from './HowWorkshopsWork';
import { SelectedWorkshop } from './types';
import WorkshopDetails from './WorkshopDetails';
import WorkshopSelectionContext from './WorkshopSelectionContext';
import WorkshopSlot from './WorkshopSlot';

import './WorkshopSelection.css';

const tempSlots: RegistrationWorkshopSlotFragment[] = range(5).map((days) => ({
  __typename: 'WorkshopSlot',
  id: `${days}`,
  startsAt: DateTime.now().plus({ days }),
  endsAt: DateTime.now().plus({ days, hours: 3 }),
  workshops: range(3).map(
    (w): RegistrationWorkshopFragment => ({
      __typename: 'Workshop',
      id: `${days}-${w}`,
      slug: 'workshop',
      name: 'The name of the workshop',
      type: ActivityType.Workshop,
      tutors: [
        {
          __typename: 'Person',
          id: '1',
          name: 'Lauren Ipsum',
          city: {
            __typename: 'PlaceName',
            id: '1',
            name: 'Wellington',
            traditionalName: 'Poneke',
          },
          country: {
            __typename: 'PlaceName',
            id: 'NZ',
            name: 'New Zealand',
            traditionalName: 'Aotearoa',
          },
        },
      ],
      picture: {
        __typename: 'ActivityPicture',
        id: `${days}-${w}`,
        blurhash: '',
        medium: '',
      },
    })
  ),
}));

type Action = { type: 'add' | 'remove' } & SelectedWorkshop;

const WorkshopSelection: React.FC = () => {
  const { data, loading } = useRegistrationQuery();

  const { festival } = data || {};

  const { workshopSlots = tempSlots } = festival || {};

  const [zoomed, moreInfo] = useState<SelectedWorkshop | null>(null);

  const [selected, dispatch] = useReducer(
    (state: Map<DateTime, RegistrationWorkshopFragment[]>, action: Action) => {
      switch (action.type) {
        case 'add':
          return new Map(state).set(action.slot.startsAt, [
            ...(state.get(action.slot.startsAt) || []),
            action.workshop,
          ]);
        case 'remove':
          return new Map(state).set(
            action.slot.startsAt,
            (state.get(action.slot.startsAt) || []).filter((w) => w.id !== action.workshop.id)
          );
        default:
          return state;
      }
    },
    undefined,
    () => new Map<DateTime, RegistrationWorkshopFragment[]>()
  );

  const add = (workshop: SelectedWorkshop) => dispatch({ type: 'add', ...workshop });

  const remove = (workshop: SelectedWorkshop) => dispatch({ type: 'remove', ...workshop });

  return (
    <WorkshopSelectionContext.Provider
      value={{
        loading,
        workshopSlots,
        selected,
        registrationStage: 'earlybird',
        add,
        remove,
        moreInfo,
      }}
    >
      <form className="workshop-selection">
        <HowWorkshopsWork />
        {workshopSlots.map((slot) => (
          <WorkshopSlot slot={slot} key={slot.id} />
        ))}
        <AnimatePresence>{zoomed && <WorkshopDetails {...zoomed} />}</AnimatePresence>
      </form>
    </WorkshopSelectionContext.Provider>
  );
};

export default WorkshopSelection;
