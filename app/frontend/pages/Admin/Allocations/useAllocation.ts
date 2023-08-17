import { useCallback, useMemo } from 'react';

import {
  useMoveAllocatedParticipantMutation,
  WorkshopAllocationSessionDetailsFragment,
} from '@/graphql/types';

import { AllocationData, Registration, RegistrationData, Session, Slot } from './types';

export type DragAction = {
  type: 'drag';
  slot: Slot;
  registration: Registration;
  previous: Session | null;
  next: Session | null;
  waitlist: boolean;
};

const useAllocation = (allocation: AllocationData, registrations: RegistrationData[]) => {
  const registrationsMap = useMemo(() => {
    const map = registrations.reduce(
      (acc, reg) => acc.set(reg.id, new Registration(reg)),
      new Map<string, Registration>()
    );
    return map;
  }, [registrations]);

  const slots = useMemo(
    () =>
      allocation.slots.map((s) => {
        const slot = new Slot(s);
        s.sessions.forEach((sn) => {
          sn.registrations
            .map((r) => registrationsMap.get(r.id))
            .forEach((r) => {
              if (r) r.place(slot, sn.workshop.id);
            });
          sn.waitlist
            .map((r) => registrationsMap.get(r.id))
            .forEach((r) => {
              if (r) slot.session(sn.workshop.id)?.waitlist.push(r);
            });
        });
        return slot;
      }),
    [allocation, registrationsMap]
  );

  const registration = useCallback((id: string) => registrationsMap.get(id), [registrationsMap]);

  const score = useMemo(
    () =>
      [...registrationsMap.values()].reduce((acc, reg) => acc + reg.score, 0) /
      (registrationsMap.size || 1),
    [registrationsMap]
  );

  const [move] = useMoveAllocatedParticipantMutation();

  const dispatch = useCallback(
    (action: DragAction) => {
      const { registration, previous, next, slot, waitlist = false } = action;

      move({
        variables: {
          registrationId: registration.id,
          oldSessionId: previous?.id || null,
          newSessionId: next?.id || null,
          waitlist,
        },
        update: (cache) => {
          if (previous) {
            const id = `WorkshopAllocationSession:${previous.id}`;
            cache.modify({
              id,
              fields: {
                registrations: (
                  existing: WorkshopAllocationSessionDetailsFragment['registrations'],
                  { readField }
                ) => {
                  return existing.filter((r) => readField('id', r) !== registration.id);
                },
                waitlist: (
                  existing: WorkshopAllocationSessionDetailsFragment['registrations'],
                  { readField }
                ) => {
                  const preferences = registration.preferences.get(slot.id) || [];
                  const addToWaitlist =
                    !next ||
                    preferences.indexOf(next.workshop.id) >
                      preferences.indexOf(previous.workshop.id);
                  return addToWaitlist
                    ? [
                        ...existing.filter((r) => readField('id', r) !== registration.id),
                        { __typename: 'Registration', ...registration },
                      ]
                    : existing;
                },
              },
            });
          }
          if (next) {
            const id = `WorkshopAllocationSession:${next.id}`;
            cache.modify({
              id,
              fields: {
                registrations: (
                  existing: WorkshopAllocationSessionDetailsFragment['registrations']
                ) =>
                  waitlist
                    ? existing
                    : [...existing, { __typename: 'Registration', ...registration }],
                waitlist: (
                  existing: WorkshopAllocationSessionDetailsFragment['registrations'],
                  { readField }
                ) => existing.filter((r) => readField('id', r) !== registration.id),
              },
            });
            //   const newSession = cache.readFragment<WorkshopAllocationSessionDetailsFragment>({
            //     fragment: WorkshopAllocationSessionDetailsFragmentDoc,
            //     id,
            //   });
            //   if (newSession) {
            //     const newWaitlist = newSession.waitlist.filter((r) => r.id !== registration.id);
            //     cache.writeFragment({
            //       fragment: WorkshopAllocationSessionDetailsFragmentDoc,
            //       id,
            //       data: {
            //         ...newSession,
            //         registrations: waitlist
            //           ? newSession.registrations
            //           : [...newSession.registrations, registration],
            //         waitlist: waitlist ? [...newWaitlist, registration] : newWaitlist,
            //       },
            //     });
            // }
          }
        },
      });
    },
    [move]
  );

  return { slots, registration, score, dispatch };
};

export default useAllocation;
