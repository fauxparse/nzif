import { useQuery } from '@apollo/client';
import { FragmentOf } from 'gql.tada';
import { deburr, first, identity, sortBy, toPairs } from 'lodash-es';
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
  sort: Sort;
  setSort: Dispatch<SetStateAction<Sort>>;
  sortRegistrations: (registrations: Registration[]) => Registration[];
  registration: (id: string) => Registration;
  choice: (registrationId: string, sessionId: string) => number;
};

const notImplemented = () => {
  throw new Error('Not implemented');
};

const AllocationsContext = createContext<AllocationsContext>({
  days: [],
  sort: 'name',
  setSort: notImplemented,
  registration: notImplemented,
  choice: notImplemented,
  sortRegistrations: identity,
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

  const registrationsById = useMemo(
    () =>
      (data?.festival?.registrations ?? []).reduce(
        (acc, registration) => acc.set(registration.id, registration),
        new Map<string, FragmentOf<typeof WorkshopAllocationRegistrationFragment>>()
      ),
    [data]
  );

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
      const preference = r.preferences.find((p) => p.workshop.id === session?.workshop.id);
      if (!preference)
        throw new Error(
          `Preference not found for registration ${registrationId} and session ${sessionId}`
        );
      return preference.position;
    },
    [registration, sessionsById]
  );

  const sortRegistrations = useCallback((registrations: Registration[]) => {
    return sortBy(registrations, (r) => deburr(r.user?.name ?? '').toLocaleLowerCase());
  }, []);

  return (
    <AllocationsContext.Provider
      value={{ days, registration, choice, sort, setSort, sortRegistrations }}
    >
      {children}
    </AllocationsContext.Provider>
  );
};

export const useAllocations = () => useContext(AllocationsContext);
