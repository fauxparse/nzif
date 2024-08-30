import { useRegistration } from '@/services/Registration';
import { useQuery } from '@apollo/client';
import { isEqual, map, sortBy, uniqBy } from 'lodash-es';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { WorkshopRegistrationQuery } from './queries';
import { PERIODS, Period, Session as SessionWithWorkshop, WorkshopDay } from './types';

type Session = Omit<SessionWithWorkshop, 'workshop'>;

export const sessionPeriod = (session: { startsAt: DateTime; endsAt: DateTime }): Period =>
  session.startsAt.hour < 12 ? (session.endsAt.hour > 13 ? 'all-day' : 'morning') : 'afternoon';

type SessionKey = `${number}-${number}-${number}:${Period}`;

export const sessionKey = (session: { startsAt: DateTime; endsAt: DateTime }): SessionKey =>
  `${session.startsAt.toISODate()}:${sessionPeriod(session)}` as SessionKey;

type Preference = {
  position: number;
  session: Session;
};

type PreferencesState = Map<SessionKey, Preference[]>;

type PreferencesAction =
  | {
      type: 'add' | 'remove';
      session: Session;
    }
  | {
      type: 'reset';
      preferences: { sessionId: Session['id']; position: number }[];
      sessions: Session[];
    };

const addSessionPreference = (state: PreferencesState, session: Session): PreferencesState => {
  const existing = session.slots.map((slot) => state.get(sessionKey(slot)) ?? []);
  const position = Math.max(0, ...existing.flatMap((prefs) => map(prefs, 'position'))) + 1;
  return session.slots.reduce(
    (acc, slot) =>
      acc.set(sessionKey(slot), [...(acc.get(sessionKey(slot)) ?? []), { position, session }]),
    new Map(state)
  );
};

const removeSessionPreference = (state: PreferencesState, session: Session): PreferencesState => {
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
    (acc, { session }) => addSessionPreference(acc, session),
    slotKeys.reduce((acc, key) => acc.set(key, []), new Map(state))
  );
};

const trim = (state: PreferencesState): PreferencesState =>
  new Map(
    Array.from(state.entries()).reduce(
      (acc, [key, prefs]) => (prefs.length ? acc.set(key, prefs) : acc),
      new Map()
    )
  );

const preferencesReducer = (
  state: PreferencesState,
  action: PreferencesAction
): PreferencesState => {
  switch (action.type) {
    case 'add':
      return trim(addSessionPreference(state, action.session));
    case 'remove':
      return trim(removeSessionPreference(state, action.session));
    case 'reset': {
      const sessionsById = new Map(action.sessions.map((session) => [session.id, session]));
      return trim(
        sortBy(action.preferences, 'position').reduce(
          (acc, { sessionId }) => addSessionPreference(acc, sessionsById.get(sessionId) as Session),
          new Map()
        )
      );
    }
  }
};

type PlacementsState = {
  sessions: Set<Session['id']>;
  waitlist: Set<Session['id']>;
};

type PlacementsAction =
  | {
      type: 'add' | 'remove';
      waitlist: boolean;
      sessions: { id: Session['id'] }[];
    }
  | {
      type: 'reset';
      sessions: { id: Session['id'] }[];
      waitlist: { id: Session['id'] }[];
    };

const placementsReducer = (state: PlacementsState, action: PlacementsAction): PlacementsState => {
  switch (action.type) {
    case 'add': {
      const sessions = action.sessions.reduce(
        (acc, s) => acc.add(s.id),
        new Set(action.waitlist ? state.waitlist : state.sessions)
      );
      return { ...state, [action.waitlist ? 'waitlist' : 'sessions']: sessions };
    }
    case 'remove': {
      const sessions = new Set(action.waitlist ? state.waitlist : state.sessions);
      for (const session of action.sessions) {
        sessions.delete(session.id);
      }
      return { ...state, [action.waitlist ? 'waitlist' : 'sessions']: sessions };
    }
    case 'reset':
      return {
        sessions: new Set(action.sessions.map((s) => s.id)),
        waitlist: new Set(action.waitlist.map((s) => s.id)),
      };
  }
};

export const useWorkshopPreferences = () => {
  const { registration, earlybird } = useRegistration();

  const { loading, data } = useQuery(WorkshopRegistrationQuery);

  const [preferences, dispatchPreference] = useReducer(preferencesReducer, new Map());

  const [{ sessions, waitlist }, dispatchPlacement] = useReducer(placementsReducer, {
    sessions: new Set<Session['id']>(),
    waitlist: new Set<Session['id']>(),
  });

  const allSessions = useMemo(
    () =>
      data?.festival.workshops.flatMap((workshop) =>
        workshop.sessions.map((session) => ({ ...session, workshop }))
      ) ?? [],
    [data]
  );

  const mySessions = useMemo(() => data?.registration?.teaching ?? [], [data]);

  const disabledSessions = useMemo(
    () =>
      allSessions.filter((s) =>
        mySessions.some((ms) => ms.startsAt < s.endsAt && ms.endsAt > s.startsAt)
      ),
    [allSessions, mySessions]
  );

  const initial = useMemo(() => {
    if (!registration) return null;
    if (earlybird) {
      return registration.preferences.reduce(
        (acc, { sessionId, position }) => Object.assign(acc, { [sessionId]: position }),
        {}
      );
    }
    return {
      sessions: registration.sessions.map((s) => s.id).sort(),
      waitlist: registration.waitlist.map((s) => s.id).sort(),
    };
  }, [registration, earlybird]);

  const current = useMemo(() => {
    if (earlybird) {
      return Array.from(preferences.entries())
        .flatMap(([_, prefs]) => prefs)
        .reduce((acc, { session, position }) => Object.assign(acc, { [session.id]: position }), {});
    }
    return {
      sessions: Array.from(sessions).sort(),
      waitlist: Array.from(waitlist).sort(),
    };
  }, [preferences, sessions, waitlist, earlybird]);

  const dirty = useMemo(() => {
    if (!initial) return false;
    return !isEqual(initial, current);
  }, [initial, current]);

  useEffect(() => {
    if (!registration || !allSessions.length) return;

    dispatchPreference({
      type: 'reset',
      preferences: registration.preferences,
      sessions: allSessions,
    });

    dispatchPlacement({
      type: 'reset',
      sessions: registration.sessions,
      waitlist: registration.waitlist,
    });
  }, [registration, allSessions]);

  const workshopDays = useMemo<WorkshopDay[]>(() => {
    if (!data?.festival?.workshops) return [];

    const grouped = allSessions.reduce((acc, session) => {
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
  }, [data, allSessions]);

  const add = useCallback(
    (session: Session) => {
      if (earlybird) {
        dispatchPreference({ type: 'add', session });
        return;
      }

      const wasRegistered = (registration?.sessions || []).some((s) => s.id === session.id);

      if (session.capacity && session.count >= session.capacity && !wasRegistered) {
        dispatchPlacement({ type: 'add', waitlist: true, sessions: [session] });
        return;
      }

      const clashes = allSessions.filter(
        (s) =>
          sessions.has(s.id) &&
          s.id !== session.id &&
          s.startsAt < session.endsAt &&
          s.endsAt > session.startsAt
      );

      if (clashes.length) {
        dispatchPlacement({ type: 'remove', waitlist: false, sessions: clashes });
      }

      dispatchPlacement({ type: 'add', waitlist: false, sessions: [session] });
    },
    [dispatchPreference, earlybird, allSessions, sessions, registration]
  );

  const remove = useCallback(
    (session: Session) => {
      if (earlybird) {
        dispatchPreference({ type: 'remove', session });
        return;
      }

      dispatchPlacement({
        type: 'remove',
        sessions: [session],
        waitlist: waitlist.has(session.id),
      });
    },
    [dispatchPreference, earlybird, waitlist]
  );

  const positionsBySession = useMemo(() => {
    return Array.from(preferences.entries()).reduce(
      (acc, [_, prefs]) =>
        prefs.reduce((acc2, { session, position }) => acc2.set(session.id, position), acc),
      new Map<Session['id'], Preference['position']>()
    );
  }, [preferences]);

  const getPosition = useCallback(
    (session: { id: Session['id'] }) => positionsBySession.get(session.id),
    [positionsBySession]
  );

  const getWorkshop = (slug: string) => {
    const session = allSessions.find((s) => s.workshop.slug === slug);
    if (!session) {
      throw new Error(`Workshop ${slug} not found`);
    }
    return session.workshop;
  };

  const getSession = (id: string) => {
    const session = allSessions.find((s) => s.id === id);
    if (!session) {
      throw new Error(`Session ${id} not found`);
    }
    return session;
  };

  return {
    days: workshopDays,
    disabledSessions,
    loading,
    add,
    remove,
    preferences,
    sessions,
    waitlist,
    getPosition,
    value: current,
    dirty,
    getWorkshop,
    getSession,
  };
};
