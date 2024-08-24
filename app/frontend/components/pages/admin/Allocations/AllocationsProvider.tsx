import { useQuery } from '@apollo/client';
import { FragmentOf } from 'gql.tada';
import { deburr, first, sortBy, toPairs } from 'lodash-es';
import { DateTime } from 'luxon';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { WorkshopAllocationQuery, WorkshopAllocationRegistrationFragment } from './queries';
import { Registration, Session } from './types';

type Sort = 'name' | 'score';

type AllocationsContext = {
  days: [DateTime, Session[]][];
  registrations: Registration[];
  sort: Sort;
  setSort: Dispatch<SetStateAction<Sort>>;
  sortRegistrations: (registrations: Registration[]) => Registration[];
  registration: (id: string) => Registration;
  choice: (registrationId: string, sessionId: string) => number;
  score: (registrationId: string) => number;
  placements: (registrationId: string) => (number | null)[];
  placementMap: (registrationId: string) => Map<string, number | null>;
  count: (registrationId: string) => number;
};

const notImplemented = () => {
  throw new Error('Not implemented');
};

const AllocationsContext = createContext<AllocationsContext>({
  days: [],
  registrations: [],
  sort: 'name',
  setSort: notImplemented,
  registration: notImplemented,
  choice: notImplemented,
  sortRegistrations: notImplemented,
  score: notImplemented,
  placements: notImplemented,
  placementMap: notImplemented,
  count: notImplemented,
});

export const AllocationsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { loading, data } = useQuery(WorkshopAllocationQuery);

  const [sort, setSort] = useState<Sort>('name');

  const sessionsById = useMemo(
    () =>
      (data?.festival?.workshopAllocation?.slots ?? []).reduce((acc, slot) => {
        for (const session of slot.sessions) {
          acc.set(session.id, session);
        }
        return acc;
      }, new Map<string, Session>()),
    [data]
  );

  const registrations = useMemo(() => data?.festival?.registrations ?? [], [data]);

  const registrationsById = useMemo(
    () =>
      registrations.reduce(
        (acc, registration) => acc.set(registration.id, registration),
        new Map<string, FragmentOf<typeof WorkshopAllocationRegistrationFragment>>()
      ),
    [registrations]
  );

  const placementsByRegistrationId = useMemo(() => {
    const placements = new Map<string, Record<string, number>>();
    for (const slot of data?.festival?.workshopAllocation?.slots ?? []) {
      for (const session of slot.sessions) {
        for (const registration of session.registrations) {
          const r = registrationsById.get(registration.id);
          if (r) {
            const p = placements.get(registration.id) || {};
            const position = r.preferences.find((p) => p.sessionId === session.id)?.position;
            if (position) {
              for (const slot of session.slots) {
                p[slot.id] = position;
              }
            }
            placements.set(registration.id, p);
          }
        }
      }
    }
    return placements;
  }, [data, registrationsById]);

  const slotsByRegistrationId = useMemo(() => {
    const slots = new Map<string, Set<string>>();
    for (const registration of registrations) {
      for (const preference of registration.preferences) {
        const session = sessionsById.get(preference.sessionId);
        if (session) {
          for (const slot of session.slots) {
            const set = slots.get(registration.id) || new Set();
            set.add(slot.id);
            slots.set(registration.id, set);
          }
        }
      }
    }
    return slots;
  }, [registrations, sessionsById]);

  const count = useCallback(
    (registrationId: string) => slotsByRegistrationId.get(registrationId)?.size ?? 0,
    [slotsByRegistrationId]
  );

  const scores = useMemo(() => {
    const scores = new Map<string, number>();
    for (const registration of registrationsById.values()) {
      const placements = placementsByRegistrationId.get(registration.id) || {};
      const total = Object.values(placements).reduce((acc, v) => acc + 1.0 / v, 0);
      const score = Math.min(100, Math.round((100 * total) / Math.max(count(registration.id), 1)));
      scores.set(registration.id, score);
    }
    return scores;
  }, [registrationsById, placementsByRegistrationId, count]);

  const score = useCallback((registrationId: string) => scores.get(registrationId) ?? 0, [scores]);

  const days = useMemo(
    () =>
      sortBy(
        toPairs(
          (data?.festival?.workshopAllocation?.slots ?? []).reduce(
            (acc, slot) => {
              const date = slot.startsAt.toISODate() ?? '';
              acc[date] = [...(acc[date] ?? []), ...slot.sessions];
              return acc;
            },
            {} as Record<string, Session[]>
          )
        ),
        first
      ).map(([date, sessions]) => [DateTime.fromISO(date), sessions]) as [DateTime, Session[]][],
    [data]
  );

  const registration = useCallback(
    (id: string) => {
      const registration = registrationsById.get(id);
      if (!registration) throw new Error(`Registration with id ${id} not found`);
      return registration;
    },
    [registrationsById]
  );

  const choice = useCallback(
    (registrationId: string, sessionId: string) => {
      const r = registration(registrationId);
      const session = sessionsById.get(sessionId);
      const preference = r.preferences.find((p) => p.sessionId === session?.id);
      if (!preference)
        throw new Error(
          `Preference not found for registration ${registrationId} and session ${sessionId}`
        );
      return preference.position;
    },
    [registration, sessionsById]
  );

  const sortRegistrations = useCallback(
    (registrations: Registration[]) => {
      switch (sort) {
        case 'score':
          return sortBy(registrations, (r) => -score(r.id));
        default:
          return sortBy(registrations, (r) => deburr(r.user?.name ?? '').toLocaleLowerCase());
      }
    },
    [score, sort]
  );

  const placementMap = useCallback(
    (registrationId: string) => {
      const p = placementsByRegistrationId.get(registrationId);
      if (!p) throw new Error(`Placements not found for registration ${registrationId}`);
      const slots = slotsByRegistrationId.get(registrationId);
      if (!slots) throw new Error(`Slots not found for registration ${registrationId}`);
      return Array.from(slots).reduce(
        (acc, slotId) => acc.set(slotId, p[slotId] ?? null),
        new Map<string, number | null>()
      );
    },
    [placementsByRegistrationId]
  );

  const placements = useCallback(
    (registrationId: string) =>
      sortBy(Array.from(placementMap(registrationId).entries()), first).map(([, p]) => p),
    [placementMap]
  );

  return (
    <AllocationsContext.Provider
      value={{
        days,
        registrations,
        registration,
        choice,
        sort,
        setSort,
        sortRegistrations,
        score,
        placements,
        placementMap,
        count,
      }}
    >
      {children}
    </AllocationsContext.Provider>
  );
};

export const useAllocations = () => useContext(AllocationsContext);
