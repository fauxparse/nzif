import { PropsWithChildren, useMemo } from 'react';
import { useAllocations } from './AllocationsProvider';
import { useDroppable } from './dndkit';
import { Session } from './types';

import { isEqual } from 'lodash-es';
import styles from './Allocations.module.css';

type DropzoneProps = PropsWithChildren<{
  session: Session | null;
  slots: Session['slots'];
  waitlist?: boolean;
}>;

export const Dropzone: React.FC<DropzoneProps> = ({
  session,
  slots,
  waitlist = false,
  children,
}) => {
  const id = `${session?.id ?? 'unassigned'}-${slots[0].id}${waitlist ? '-waitlist' : ''}`;

  const { active } = useAllocations();

  const slotIds = useMemo(() => new Set(slots.map((slot) => slot.id)), [slots]);

  const preference = useMemo(() => {
    if (!active) return undefined;
    if (!session) return isEqual(active.slots, slots) ? 0 : undefined;
    if (!active.slots.some((slot) => slotIds.has(slot.id))) return undefined;
    if (waitlist && active.session?.id !== session.id) return undefined;
    return active.registration.preferences.find((p) => p.sessionId === session?.id)?.position;
  }, [active, session, waitlist, slotIds]);

  const { setNodeRef } = useDroppable({
    id,
    data: {
      session,
      slots,
      waitlist,
    },
  });

  return (
    <div className={styles.dropzone} ref={setNodeRef} data-preference={preference}>
      {children}
    </div>
  );
};
