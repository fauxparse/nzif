import { useApolloClient, useMutation, useQuery } from '@apollo/client';
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
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Generate } from './Generate';
import { DraggableData } from './dndkit';
import {
  MoveAllocatedParticipantMutation,
  WorkshopAllocationQuery,
  WorkshopAllocationRegistrationFragment,
} from './queries';
import { Registration, Session, Unassigned, isUnassigned } from './types';

type Sort = 'name' | 'score';

type MoveParams = {
  registration: Registration;
  from: Session | Unassigned;
  to: Session | Unassigned;
  waitlist?: boolean;
};

type AllocationsContext = {
  loading: boolean;
  days: [DateTime, Session[]][];
  registrations: Registration[];
  active: DraggableData | null;
  setActive: Dispatch<SetStateAction<DraggableData | null>>;
  sort: Sort;
  setSort: Dispatch<SetStateAction<Sort>>;
  sortRegistrations: (registrations: Registration[]) => Registration[];
  registration: (id: string) => Registration;
  choice: (registrationId: string, sessionId: string) => number;
  score: (registrationId: string) => number;
  placements: (registrationId: string) => (number | null)[];
  placementMap: (registrationId: string) => Map<string, number | null>;
  count: (registrationId: string) => number;
  move: (params: MoveParams) => void;
  notYetAllocated: boolean;
  regenerate: () => void;
  overallScore: number;
};

const notImplemented = () => {
  throw new Error('Not implemented');
};

const AllocationsContext = createContext<AllocationsContext>({
  loading: true,
  days: [],
  registrations: [],
  active: null,
  setActive: notImplemented,
  sort: 'name',
  setSort: notImplemented,
  registration: notImplemented,
  choice: notImplemented,
  sortRegistrations: notImplemented,
  score: notImplemented,
  placements: notImplemented,
  placementMap: notImplemented,
  count: notImplemented,
  move: notImplemented,
  notYetAllocated: false,
  regenerate: notImplemented,
  overallScore: 0,
});

export const AllocationsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const { loading, data } = useQuery(WorkshopAllocationQuery);

  const [sort, setSort] = useState<Sort>('name');

  const [active, setActive] = useState<DraggableData | null>(null);

  const notYetAllocated = !loading && !data?.festival?.workshopAllocation;

  useEffect(() => {
    if (notYetAllocated) {
      setShowGenerateModal(true);
    }
  }, [notYetAllocated]);

  const sessionsById = useMemo(
    () =>
      (data?.festival?.workshopAllocation?.sessions ?? []).reduce(
        (acc, session) => acc.set(session.id, session),
        new Map<string, Session>()
      ),
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
    for (const session of data?.festival?.workshopAllocation?.sessions ?? []) {
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
          (data?.festival?.workshopAllocation?.sessions ?? []).reduce(
            (acc, session) => {
              const date = session.startsAt.toISODate() ?? '';
              acc[date] = [...(acc[date] ?? []), session];
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

  const { cache } = useApolloClient();

  const addToWaitlist = (registration: Registration, session: Session) => {
    // cache.modify({
    //   id: cache.identify(session),
    //   fields: {
    //     registrations: (existingRefs: readonly Reference[], { readField }) =>
    //       existingRefs.filter((ref) => readField('id', ref) !== registration.id),
    //     waitlist: (existingRefs: readonly Reference[]) => [
    //       ...existingRefs,
    //       { __ref: cache.identify(registration) } as Reference,
    //     ],
    //   },
    // });
  };

  const removeFromSession = (
    registration: Registration,
    session: Session,
    addToWaitlist = false
  ) => {
    // cache.modify({
    //   id: cache.identify(session),
    //   fields: {
    //     registrations: (existingRefs: readonly Reference[], { readField }) =>
    //       existingRefs.filter((ref) => readField('id', ref) !== registration.id),
    //     waitlist: (existingRefs) =>
    //       addToWaitlist ? [...existingRefs, { __ref: cache.identify(registration) }] : existingRefs,
    //   },
    // });
    // Remove the registration from the session
    // Add the registration to the waitlist for the session
  };

  const removeFromWaitlist = (registration: Registration, session: Session) => {
    // cache.modify({
    //   id: cache.identify(session),
    //   fields: {
    //     waitlist: (existingRefs: readonly Reference[], { readField }) =>
    //       existingRefs.filter((ref) => readField('id', ref) !== registration.id),
    //   },
    // });
  };

  const addToSession = (registration: Registration, session: Session) => {
    // Remove from conflicting sessions
    // const slotIds = new Set(session.slots.map((s) => s.id));
    // const positionFor = (sessionId: string) => {
    //   const p = registration.preferences.find((p) => p.sessionId === sessionId)?.position;
    //   if (!p) {
    //     throw new Error('No preference for session');
    //   }
    //   return p;
    // };
    // const position = positionFor(session.id);
    // for (const s of sessionsById.values()) {
    //   if (s.slots.some(({ id }) => slotIds.has(id))) {
    //     if (s.registrations.some((r) => r.id === registration.id)) {
    //       removeFromSession(registration, s, positionFor(s.id) < position);
    //     }
    //     if (s.waitlist.some((r) => r.id === registration.id) && positionFor(s.id) > position) {
    //       removeFromWaitlist(registration, s);
    //     }
    //   }
    // }
    // Add to the session
    // cache.modify({
    //   id: cache.identify(session),
    //   fields: {
    //     registrations: (existingRefs: readonly Reference[]) => [
    //       ...existingRefs,
    //       { __ref: cache.identify(registration) } as Reference,
    //     ],
    //     waitlist: (existingRefs: readonly Reference[], { readField }) =>
    //       existingRefs.filter((ref) => readField('id', ref) !== registration.id),
    //   },
    // });
    // Remove from lower-priority waitlists
  };

  const [mutate] = useMutation(MoveAllocatedParticipantMutation);

  const move = ({ registration, from, to, waitlist }: MoveParams) => {
    const name = registration.user?.name || 'Participant';
    const fromActivity = (!isUnassigned(from) && from.workshop.name) || 'unassigned';
    const toActivity = (!isUnassigned(to) && to.workshop.name) || 'unassigned';
    const fromSlots = from.slots.map((s) => s.id);
    const toSlots = to.slots.map((s) => s.id);
    const sameSlot = fromSlots.some((s) => toSlots.includes(s));

    const currentlyInSession =
      !isUnassigned(to) && to.registrations.some((r) => r.id === registration.id);
    const currentlyOnWaitlist =
      !isUnassigned(to) && to.waitlist.some((r) => r.id === registration.id);
    const fromWaitlist = !isUnassigned(from) && from.waitlist.some((r) => r.id === registration.id);

    if (waitlist) {
      if (!to) {
        throw new Error('No session to move to');
      }
      if (from?.id !== to?.id) {
        throw new Error(
          `Can’t move ${name} from ${fromActivity} into a waitlist for a different session`
        );
      }
      if (currentlyOnWaitlist) {
        throw new Error(`${name} is already on the waitlist for ${toActivity}`);
      }
    } else {
      if (currentlyInSession) {
        throw new Error(`${name} is already in ${toActivity}`);
      }
    }

    if (!sameSlot) {
      throw new Error(`Can’t move ${name} between different slots`);
    }

    if (isUnassigned(to)) {
      if (fromWaitlist) {
        removeFromWaitlist(registration, from);
        return;
      }

      if (isUnassigned(from)) {
        throw new Error(`${name} is already unassigned`);
      }

      removeFromSession(registration, from, true);
      mutate({ variables: { registrationId: registration.id, from: from.id } });
    } else if (!registration.preferences.find((p) => p.sessionId === to.id)) {
      throw new Error(`${name} doesn’t have ${toActivity} in their preferences`);
    } else if (isUnassigned(from)) {
      addToSession(registration, to);
      mutate({ variables: { registrationId: registration.id, to: to.id } });
    } else {
      if (from === to && waitlist) {
        removeFromSession(registration, from, true);
        mutate({
          variables: {
            registrationId: registration.id,
            from: from.id,
            to: from.id,
            waitlist: true,
          },
        });
      } else {
        if (waitlist) {
          throw new Error(`Can’t add ${name} to a waitlist for a different session`);
        }

        addToSession(registration, to);
        mutate({ variables: { registrationId: registration.id, from: from.id, to: to.id } });
      }
    }
  };

  const overallScore = useMemo(() => {
    const total = Array.from(scores.values()).reduce(
      (acc, v) => acc + ((v / 100.0) * v) / 100.0,
      0
    );
    const count = Math.max(scores.size, 1);
    return Math.round((1000 * total) / count) / 10.0;
  }, [scores]);

  return (
    <AllocationsContext.Provider
      value={{
        loading,
        days,
        registrations,
        registration,
        choice,
        active,
        setActive,
        sort,
        setSort,
        sortRegistrations,
        score,
        placements,
        placementMap,
        count,
        move,
        notYetAllocated,
        regenerate: () => setShowGenerateModal(true),
        overallScore,
      }}
    >
      {children}
      <Generate
        open={showGenerateModal}
        canClose={!notYetAllocated}
        onOpenChange={setShowGenerateModal}
        onComplete={() => void 0}
      />
    </AllocationsContext.Provider>
  );
};

export const useAllocations = () => useContext(AllocationsContext);
