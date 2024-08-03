import { useRegistration } from '@/services/Registration';
import { useQuery } from '@apollo/client';
import { isEqual, map, sortBy, uniqBy } from 'lodash-es';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { WorkshopRegistrationQuery } from './queries';
import { PERIODS, Period, Session, WorkshopDay } from './types';

const sessionPeriod = (session: { startsAt: DateTime; endsAt: DateTime }): Period =>
  session.startsAt.hour < 12 ? (session.endsAt.hour > 13 ? 'all-day' : 'morning') : 'afternoon';

type SessionKey = `${number}-${number}-${number}:${Period}`;

const sessionKey = (session: { startsAt: DateTime; endsAt: DateTime }): SessionKey =>
  `${session.startsAt.toISODate()}:${sessionPeriod(session)}` as SessionKey;

type Preference = {
  position: number;
  session: Session;
};

type State = Map<SessionKey, Preference[]>;

type Action =
  | {
      type: 'add' | 'remove';
      session: Session;
    }
  | {
      type: 'reset';
      preferences: { sessionId: Session['id']; position: number }[];
      sessions: Session[];
    };

const addSession = (state: State, session: Session): State => {
  const existing = session.slots.map((slot) => state.get(sessionKey(slot)) ?? []);
  const position = Math.max(0, ...existing.flatMap((prefs) => map(prefs, 'position'))) + 1;
  return session.slots.reduce(
    (acc, slot) =>
      acc.set(sessionKey(slot), [...(acc.get(sessionKey(slot)) ?? []), { position, session }]),
    new Map(state)
  );
};

const removeSession = (state: State, session: Session): State => {
  const slotKeys = PERIODS.map(
    (period) => `${session.startsAt.toISODate()}:${period}` as SessionKey
  );

  const others = sortBy(
    uniqBy(
      slotKeys.flatMap((key) => state.get(key)?.filter((s) => s.session.id !== session.id) ?? []),
      'session'
    ),
    'position'
  );

  return others.reduce(
    (acc, { session }) => addSession(acc, session),
    slotKeys.reduce((acc, key) => acc.set(key, []), new Map(state))
  );
};

const trim = (state: State): State =>
  new Map(
    Array.from(state.entries()).reduce(
      (acc, [key, prefs]) => (prefs.length ? acc.set(key, prefs) : acc),
      new Map()
    )
  );

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'add':
      return trim(addSession(state, action.session));
    case 'remove':
      return trim(removeSession(state, action.session));
    case 'reset': {
      const sessionsById = new Map(action.sessions.map((session) => [session.id, session]));
      return trim(
        sortBy(action.preferences, 'position').reduce(
          (acc, { sessionId }) => addSession(acc, sessionsById.get(sessionId) as Session),
          new Map()
        )
      );
    }
  }
};

export const useWorkshopPreferences = () => {
  const { registration } = useRegistration();

  const { loading, data } = useQuery(WorkshopRegistrationQuery);

  const [preferences, dispatch] = useReducer(reducer, new Map());

  const sessions = useMemo(
    () =>
      data?.festival.workshops.flatMap((workshop) =>
        workshop.sessions.map((session) => ({ ...session, workshop }))
      ) ?? [],
    [data]
  );

  const initial = useMemo(() => {
    if (!registration) return null;
    return registration.preferences.reduce(
      (acc, { sessionId, position }) => Object.assign(acc, { [sessionId]: position }),
      {}
    );
  }, [registration]);

  const current = useMemo(
    () =>
      Array.from(preferences.entries())
        .flatMap(([_, prefs]) => prefs)
        .reduce((acc, { session, position }) => Object.assign(acc, { [session.id]: position }), {}),
    [preferences]
  );

  const dirty = useMemo(() => {
    if (!initial) return false;
    return !isEqual(initial, current);
  }, [initial, current]);

  useEffect(() => {
    if (!registration || !sessions.length) return;

    dispatch({
      type: 'reset',
      preferences: registration.preferences,
      sessions,
    });
  }, [registration, sessions]);

  const workshopDays = useMemo<WorkshopDay[]>(() => {
    if (!data?.festival?.workshops) return [];

    const grouped = sessions.reduce((acc, session) => {
      const date = session.startsAt.toISODate() ?? '';
      const day = acc.get(date) ?? {
        date: session.startsAt.startOf('day'),
        workshops: { morning: [], afternoon: [], 'all-day': [] },
      };
      day.workshops[sessionPeriod(session)].push(session);
      acc.set(date, day);
      return acc;
    }, new Map<string, WorkshopDay>());

    return sortBy(Array.from(grouped.values()), 'date');
  }, [data, sessions]);

  const add = useCallback((session: Session) => dispatch({ type: 'add', session }), [dispatch]);

  const remove = useCallback(
    (session: Session) => dispatch({ type: 'remove', session }),
    [dispatch]
  );

  const positionsBySession = useMemo(
    () =>
      Array.from(preferences.entries()).reduce(
        (acc, [_, prefs]) =>
          prefs.reduce((acc2, { session, position }) => acc2.set(session.id, position), acc),
        new Map<Session['id'], Preference['position']>()
      ),
    [preferences]
  );

  const getPosition = useCallback(
    (session: { id: Session['id'] }) => positionsBySession.get(session.id),
    [positionsBySession]
  );

  const getWorkshop = (slug: string) => sessions.find((s) => s.workshop.slug === slug)?.workshop;

  const getSession = (id: string) => sessions.find((s) => s.id === id);

  return {
    days: workshopDays,
    loading,
    add,
    remove,
    preferences,
    getPosition,
    value: current,
    dirty,
    getWorkshop,
    getSession,
  };
};
