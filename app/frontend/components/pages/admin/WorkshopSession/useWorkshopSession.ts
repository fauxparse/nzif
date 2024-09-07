import { Reference, useMutation, useQuery } from '@apollo/client';
import { sortBy } from 'lodash-es';
import { useMemo } from 'react';
import {
  AddToSessionMutation,
  AddToWaitlistMutation,
  RemoveFromSessionMutation,
  RemoveFromWaitlistMutation,
  SessionRegistrationFragment,
  WorkshopSessionQuery,
} from './queries';
import { Registration } from './types';

export const useWorkshopSession = (slug: string, sessionId: string) => {
  const { loading, data } = useQuery(WorkshopSessionQuery, { variables: { slug } });

  const workshop = data?.festival?.activity;

  const session = workshop?.sessions?.find((s) => s.id === sessionId) ?? null;

  const participants = useMemo(() => sortBy(session?.participants ?? [], 'user.name'), [session]);

  const waitlist = useMemo(() => sortBy(session?.waitlist ?? [], 'position'), [session]);

  const [doAddToSession] = useMutation(AddToSessionMutation);

  const addToSession = (registration: Registration) => {
    if (!session) return;

    doAddToSession({
      variables: { sessionId: session.id, registrationId: registration.id },
      optimisticResponse: {
        addToSession: {
          registration,
        },
      },
      update: (cache, { data }) => {
        if (!data?.addToSession?.registration) return;

        const newRef = cache.writeFragment({
          data: data.addToSession.registration,
          fragment: SessionRegistrationFragment,
        });

        cache.modify({
          id: cache.identify(session),
          fields: {
            participants: (existingRefs, { readField }) => {
              if (existingRefs.some((ref: Reference) => readField('id', ref) === registration.id)) {
                return existingRefs;
              }

              return [...existingRefs, newRef];
            },

            waitlist: (existingRefs, { readField }) =>
              existingRefs.filter((ref: Reference) => readField('id', ref) !== registration.id),
          },
        });
      },
    });
  };

  const [doAddToWaitlist] = useMutation(AddToWaitlistMutation);

  const addToWaitlist = (registration: Registration, position: number) => {
    if (!session) return;

    doAddToWaitlist({
      variables: { sessionId: session.id, registrationId: registration.id, position },
      optimisticResponse: {
        addToWaitlist: {
          waitlist: {
            id: registration.id,
            position,
            registration,
          },
        },
      },
      update: (cache, { data }) => {
        if (!data?.addToWaitlist?.waitlist) return;

        const newRef = cache.writeFragment({
          data: data.addToWaitlist.waitlist.registration,
          fragment: SessionRegistrationFragment,
        });

        cache.modify({
          id: cache.identify(session),
          fields: {
            waitlist: (existingRefs, { readField }) => {
              const list = existingRefs.filter(
                (ref: Reference) => readField('id', ref) !== registration.id
              );
              list.splice(position - (existingRefs.length - list.length), 0, newRef);
              return list;
            },
            participants: (existingRefs, { readField }) =>
              existingRefs.filter((ref: Reference) => readField('id', ref) !== registration.id),
          },
        });
      },
    });
  };

  const [doRemoveFromSession] = useMutation(RemoveFromSessionMutation);

  const removeFromSession = (registration: Registration) => {
    if (!session) return;

    doRemoveFromSession({
      variables: { sessionId: session.id, registrationId: registration.id },
      optimisticResponse: {
        removeFromSession: {
          registration,
        },
      },
      update: (cache, { data }) => {
        if (!data?.removeFromSession?.registration) return;

        cache.modify({
          id: cache.identify(session),
          fields: {
            participants: (existingRefs, { readField }) =>
              existingRefs.filter((ref: Reference) => readField('id', ref) !== registration.id),
          },
        });
      },
    });
  };

  const [doRemoveFromWaitlist] = useMutation(RemoveFromWaitlistMutation);

  const removeFromWaitlist = (registration: Registration) => {
    if (!session) return;

    doRemoveFromWaitlist({
      variables: { sessionId: session.id, registrationId: registration.id },
      optimisticResponse: {
        removeFromWaitlist: true,
      },
      update: (cache, { data }) => {
        if (!data?.removeFromWaitlist) return;

        cache.modify({
          id: cache.identify(session),
          fields: {
            waitlist: (existingRefs, { readField }) =>
              existingRefs.filter((ref: Reference) => readField('id', ref) !== registration.id),
          },
        });
      },
    });
  };

  return {
    loading,
    workshop,
    session,
    participants,
    waitlist,
    addToSession,
    addToWaitlist,
    removeFromSession,
    removeFromWaitlist,
  };
};
