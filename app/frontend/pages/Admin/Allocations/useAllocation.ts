import { useCallback, useMemo, useReducer, useState } from 'react';

import { AllocationData, Registration, RegistrationData, Session, Slot } from './types';

export type DragAction = {
  type: 'drag';
  slot: Slot;
  registration: Registration;
  previous: Session | null;
  next: Session | null;
  waitlist: boolean;
};

const reducer = (state: Registration[], action: DragAction) => {
  if (action.type === 'drag') {
    const { next, previous, slot, registration, waitlist } = action;
    if (next !== previous) {
      if (previous) {
        previous.remove(registration);
      }

      if (next) {
        if (waitlist) {
          next.addToWaitlist(registration);
        } else {
          registration.place(slot, next.workshop.id);
        }
      }
      return [...state];
    }
  }
  return state;
};

const useAllocation = (allocation: AllocationData, registrationsProp: RegistrationData[]) => {
  const [registrations, dispatch] = useReducer(
    reducer,
    registrationsProp.map((reg) => new Registration(reg))
  );

  const registrationsMap = useMemo(() => {
    const map = registrations.reduce(
      (acc, reg) => acc.set(reg.id, reg),
      new Map<string, Registration>()
    );
    return map;
  }, [registrations]);

  const [slots] = useState(() =>
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
    })
  );

  const registration = useCallback((id: string) => registrationsMap.get(id), [registrationsMap]);

  const score = useMemo(
    () =>
      [...registrationsMap.values()].reduce((acc, reg) => acc + reg.score, 0) /
      (registrationsMap.size || 1),
    [registrationsMap]
  );

  return { slots, registration, score, dispatch };
};

export default useAllocation;
