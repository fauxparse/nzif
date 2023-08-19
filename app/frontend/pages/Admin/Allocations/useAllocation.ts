import { useCallback, useMemo } from 'react';

import { useMoveAllocatedParticipantMutation } from '@/graphql/types';

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
              if (r) slot.session(sn.workshop.id)?.addToWaitlist(r);
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

      const sessionRegistrations = (session: Session) => {
        if (session === next && !waitlist) {
          return [...session.registrations, registration];
        } else if (session === previous || (session === next && waitlist)) {
          return session.registrations.filter((r) => r.id !== registration.id);
        }
        return session.registrations;
      };

      const sessionWaitlist = (session: Session) => {
        if (session === next && waitlist) {
          return [...session.waitlist, registration];
        } else if (session === previous || (session === next && !waitlist)) {
          return session.waitlist.filter((r) => r.id !== registration.id);
        }
        return session.waitlist;
      };

      move({
        variables: {
          registrationId: registration.id,
          oldSessionId: previous?.id || null,
          newSessionId: next?.id || null,
          waitlist,
          slot: slot.startsAt,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          moveAllocatedParticipant: {
            __typename: 'MoveAllocatedParticipantPayload',
            allocation: {
              __typename: 'WorkshopAllocation',
              id: allocation.id,
              slot: {
                __typename: 'WorkshopAllocationSlot',
                id: slot.id,
                startsAt: slot.startsAt,
                sessions: slot.sessions.map((s) => ({
                  __typename: 'WorkshopAllocationSession',
                  id: s.id,
                  capacity: s.capacity,
                  registrations: sessionRegistrations(s).map((r) => ({
                    __typename: 'Registration',
                    id: r.id,
                  })),
                  waitlist: sessionWaitlist(s).map((r) => ({
                    __typename: 'Registration',
                    id: r.id,
                  })),
                  workshop: {
                    __typename: 'Workshop',
                    id: s.workshop.id,
                    name: s.workshop.name,
                  },
                })),
              },
            },
          },
        },
      });
    },
    [move, allocation.id]
  );

  return { slots, registration, score, dispatch };
};

export default useAllocation;
