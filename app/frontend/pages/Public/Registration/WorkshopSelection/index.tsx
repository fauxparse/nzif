import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reference } from '@apollo/client';
import { MotionContext } from 'framer-motion';
import { range, uniqueId } from 'lodash-es';
import { DateTime } from 'luxon';

import { useRegistrationContext } from '../RegistrationContext';
import {
  ActivityType,
  RegistrationPhase,
  RegistrationPreferenceFragmentDoc,
  RegistrationSessionFragment,
  RegistrationSlotFragment,
  RegistrationWorkshopFragment,
  useAddPreferenceMutation,
  useRegistrationStatusQuery,
  useRemovePreferenceMutation,
} from '@/graphql/types';

import { useConfirmation } from './ConfirmationModal';
import HowWorkshopsWork from './HowWorkshopsWork';
import Slot from './Slot';
import WorkshopDetails from './WorkshopDetails';
import WorkshopSelectionContext from './WorkshopSelectionContext';

import './WorkshopSelection.css';

const tempSessions: RegistrationSlotFragment[] = range(5).map((days) => ({
  __typename: 'Slot',
  id: `${days}`,
  startsAt: DateTime.now().plus({ days }),
  endsAt: DateTime.now().plus({ days, hours: 3 }),
  sessions: range(3).map(
    (s): RegistrationSessionFragment => ({
      __typename: 'Session',
      id: `${days}-${s}`,
      startsAt: DateTime.now().plus({ days }),
      capacity: 0,
      count: 0,
      workshop: {
        __typename: 'Workshop',
        id: `${days}-${s}`,
        slug: 'workshop',
        name: 'The name of the workshop',
        type: ActivityType.Workshop,
        tutors: [
          {
            __typename: 'Person',
            id: '1',
            name: 'Lauren Ipsum',
            city: {
              __typename: 'Placename',
              id: '1',
              name: 'Wellington',
              traditionalName: 'Poneke',
            },
            country: {
              __typename: 'Placename',
              id: 'NZ',
              name: 'New Zealand',
              traditionalName: 'Aotearoa',
            },
          },
        ],
        picture: {
          __typename: 'ActivityPicture',
          id: `${days}-${s}`,
          blurhash: '',
          medium: '',
        },
        sessions: [],
        show: null,
      },
    })
  ),
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
            __typename: 'Placename',
            id: '1',
            name: 'Wellington',
            traditionalName: 'Poneke',
          },
          country: {
            __typename: 'Placename',
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

export const Component: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);

  const { confirm, modal } = useConfirmation();

  const { data, loading } = useRegistrationStatusQuery();

  const { next } = useRegistrationContext();

  const { festival, registration } = data || {};

  const { registrationPhase, slots = tempSessions } = festival || {};

  const [zoomed, setZoomed] = useState<RegistrationSessionFragment | null>(null);

  const moreInfo = useCallback((w: RegistrationSessionFragment | null) => {
    setZoomed(w);
  }, []);

  const selected = useMemo<Map<number, RegistrationWorkshopFragment[]>>(() => {
    switch (registrationPhase) {
      case RegistrationPhase.Earlybird:
      case RegistrationPhase.Paused:
        return (registration?.preferences || []).reduce(
          (acc, p) =>
            acc.set(p.slot.startsAt.valueOf(), [
              ...(acc.get(p.slot.startsAt.valueOf()) || []),
              p.workshop,
            ]),
          new Map<number, RegistrationWorkshopFragment[]>()
        );
      default:
        return (registration?.sessions || []).reduce(
          (acc, s) =>
            s.workshop
              ? acc.set(s.startsAt.valueOf(), [
                  ...(acc.get(s.startsAt.valueOf()) || []),
                  s.workshop,
                ])
              : acc,
          new Map<number, RegistrationWorkshopFragment[]>()
        );
    }
  }, [registration, registrationPhase]);

  const waitlist = useMemo<Set<string>>(
    () => new Set(registration?.waitlist?.map((s) => s.id) || []),
    [registration]
  );

  const [addPreference] = useAddPreferenceMutation({ refetchQueries: ['RegistrationSummary'] });

  const [removePreference] = useRemovePreferenceMutation({
    refetchQueries: ['RegistrationSummary'],
  });

  const add = (session: RegistrationSessionFragment) => {
    const slot = slots.find((s) => s.startsAt.equals(session.startsAt));

    if (!slot || !session.workshop) return;

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
            workshop: session.workshop,
            slot,
            position: selected.get(slot.startsAt.valueOf())?.length || 0,
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

  const remove = (session: RegistrationSessionFragment) => {
    const slot = slots.find((s) => s.startsAt.equals(session.startsAt));

    if (!slot || !session?.workshop || !registration) return;

    const { workshop } = session;

    if (waitlist.has(session.id)) {
      confirm({
        title: 'Leave waitlist?',
        message: 'If you rejoin the waitlist for this workshop you will lose your place.',
      })
        .then(() => {
          console.log('Left waitlist');
        })
        .catch((e) => void 0);
      return;
    }

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

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !registration?.id) {
      navigate(festival ? `/${festival.id}/register` : '/');
    }
  }, [loading, registration, festival, navigate]);

  return (
    <WorkshopSelectionContext.Provider
      value={{
        loading,
        slots,
        selected,
        waitlist,
        registrationPhase: festival?.registrationPhase || RegistrationPhase.Closed,
        zoomed,
        add,
        remove,
        moreInfo,
        confirm,
      }}
    >
      <form ref={form} id="registration-form" className="workshop-selection" onSubmit={submit}>
        <HowWorkshopsWork />
        <MotionContext.Provider value={{}}>
          {slots.map((slot) => (
            <Slot slot={slot} key={slot.id} />
          ))}
          {zoomed && <WorkshopDetails session={zoomed} />}
        </MotionContext.Provider>
      </form>
      {modal}
    </WorkshopSelectionContext.Provider>
  );
};

Component.displayName = 'WorkshopSelection';

export default Component;
