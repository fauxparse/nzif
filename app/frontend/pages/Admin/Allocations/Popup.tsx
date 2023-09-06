import { forwardRef, Fragment, useMemo } from 'react';

import Icon from '@/atoms/Icon';
import { useContextMenu } from '@/molecules/ContextMenu';

import { Registration, Session, Slot } from './types';

type PopupProps = {
  slots: Slot[];
  getRegistration: (registrationId: string) => Registration | undefined;
};

const Popup = forwardRef<HTMLDivElement, PopupProps>(({ slots, getRegistration }, ref) => {
  const { currentTarget } = useContextMenu();

  const registrationId = currentTarget?.dataset.registrationId;

  const registration = registrationId ? getRegistration(registrationId) : null;

  const slotData = useMemo(() => {
    if (!registration) return [];
    return slots.reduce(
      (data: { slot: Slot; session: Session | null; position: number | null }[], slot: Slot) => {
        const session = slot.find(registration.id);
        if (!session) return data;
        const s = session === 'waitlisted' ? null : session;
        return [
          ...data,
          {
            slot,
            session: s,
            position: s ? registration.workshopPosition(slot, s.workshop.id) : null,
          },
        ];
      },
      []
    );
  }, [registration, slots]);

  if (!registration) return null;

  return (
    <div ref={ref} className="allocations__popup">
      <h4>{registration.name}</h4>
      <div className="allocations__popup__slots">
        {slotData.map(({ slot, session, position }) => (
          <Fragment key={slot.startsAt.toISO()}>
            {session ? (
              <span className="allocations__popup__position" data-position={position}>
                {position}
              </span>
            ) : (
              <Icon className="allocations__popup__position" name="cancel" />
            )}
            <span className="allocations__popup__date">
              {slot.startsAt.plus(0).toFormat('ccc d')}
            </span>

            {!session ? (
              <span className="allocations__popup__missed">Missed out</span>
            ) : (
              <span className="allocations__popup__name">{session.workshop.name}</span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
});

Popup.displayName = 'ContextMenu.Popup';

export default Popup;
