import { useCallback, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Reference } from '@apollo/client';
import { MotionContext } from 'framer-motion';
import { range, uniqueId } from 'lodash-es';
import { DateTime } from 'luxon';

import { useRegistrationContext } from '../RegistrationContext';
import {
  ActivityType,
  RegistrationPreferenceFragmentDoc,
  RegistrationSlotFragment,
  RegistrationWorkshopFragment,
  useAddPreferenceMutation,
  useRegistrationStatusQuery,
  useRemovePreferenceMutation,
} from '@/graphql/types';

import HowWorkshopsWork from './HowWorkshopsWork';
import Slot from './Slot';
import { SelectedWorkshop } from './types';
import WorkshopDetails from './WorkshopDetails';
import WorkshopSelectionContext from './WorkshopSelectionContext';

import './WorkshopSelection.css';

const tempSessions: RegistrationSlotFragment[] = range(5).map((days) => ({
  __typename: 'Slot',
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
      sessions: [],
      show: null,
    })
  ),
}));

const WorkshopSelection: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);

  const { data, loading } = useRegistrationStatusQuery();

  const { next } = useRegistrationContext();

  const { festival, registration } = data || {};

  const { slots = tempSessions } = festival || {};

  const [zoomed, setZoomed] = useState<SelectedWorkshop | null>(null);

  const moreInfo = useCallback((w: SelectedWorkshop | null) => {
    setZoomed(w);
  }, []);

  const selected = useMemo<Map<DateTime, RegistrationWorkshopFragment[]>>(
    () =>
      (registration?.preferences || []).reduce(
        (acc, p) => acc.set(p.slot.startsAt, [...(acc.get(p.slot.startsAt) || []), p.workshop]),
        new Map<DateTime, RegistrationWorkshopFragment[]>()
      ),
    [registration]
  );

  const [addPreference] = useAddPreferenceMutation({});

  const [removePreference] = useRemovePreferenceMutation({});

  const add = ({ workshop, slot }: SelectedWorkshop) => {
    const session = workshop.sessions.find((s) => s.startsAt.equals(slot.startsAt));
    if (!session) return;

    addPreference({
      variables: {
        registrationId: registration?.id || null,
        sessionId: session.id,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        addPreference: {
          __typename: 'AddPreferencePayload',
          preference: {
            __typename: 'Preference',
            id: uniqueId(),
            workshop,
            slot,
            position: selected.get(slot.startsAt)?.length || 0,
          },
        },
      },
      update: (cache, { data }) => {
        const { preference } = data?.addPreference || {};
        if (!preference || !registration) return;

        const ref = cache.writeFragment({
          fragment: RegistrationPreferenceFragmentDoc,
          fragmentName: 'RegistrationPreference',
          data: preference,
        });
        cache.modify({
          id: cache.identify(registration),
          fields: {
            preferences: (existing) => [...existing, ref],
          },
        });
      },
    });
  };

  const remove = ({ workshop, slot }: SelectedWorkshop) => {
    const session = workshop.sessions.find((s) => s.startsAt.equals(slot.startsAt));
    if (!session || !registration) return;

    const preference = registration.preferences.find((p) => p.workshop.id === workshop.id);
    if (!preference) return;

    removePreference({
      variables: {
        registrationId: registration?.id || null,
        sessionId: session.id,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        removePreference: true,
      },
      update: (cache, { data }) => {
        if (!data?.removePreference) return;

        cache.modify({
          id: cache.identify(registration),
          fields: {
            preferences: (existing: Reference[], { readField }) =>
              existing.filter((p) => readField<string>('id', p) !== preference.id),
          },
        });
        registration.preferences.forEach((p) => {
          if (p.slot.id === slot.id && p.position > preference.position) {
            cache.modify({
              id: cache.identify(p),
              fields: {
                position: (current) => current - 1,
              },
            });
          }
        });
      },
    });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    next();
  };

  if (registration && !registration?.id) {
    return <Navigate to={festival ? `/${festival.id}/register` : '/'} />;
  }

  return (
    <WorkshopSelectionContext.Provider
      value={{
        loading,
        slots,
        selected,
        registrationStage: 'earlybird',
        zoomed,
        add,
        remove,
        moreInfo,
      }}
    >
      <form ref={form} id="registration-form" className="workshop-selection" onSubmit={submit}>
        <HowWorkshopsWork />
        <MotionContext.Provider value={{}}>
          {slots.map((slot) => (
            <Slot slot={slot} key={slot.id} />
          ))}
          {zoomed && <WorkshopDetails {...zoomed} />}
        </MotionContext.Provider>
      </form>
    </WorkshopSelectionContext.Provider>
  );
};

export default WorkshopSelection;
