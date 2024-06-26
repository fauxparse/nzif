import { DateTime } from 'luxon';
import { useMemo } from 'react';

import { RegistrationSessionFragment, RegistrationSlotFragment } from '@/graphql/types';
import Skeleton from '@/helpers/Skeleton';
import { useAuthentication } from '@/organisms/Authentication';

import WorkshopCard from './WorkshopCard';
import { useWorkshopSelectionContext } from './WorkshopSelectionContext';
import { WorkshopSession } from './types';

type SlotProps = {
  slot: RegistrationSlotFragment;
};

const hasWorkshop = (session: RegistrationSessionFragment): session is WorkshopSession =>
  !!session.workshop;

const Slot: React.FC<SlotProps> = ({ slot }) => {
  const { loading } = useWorkshopSelectionContext();

  const { user } = useAuthentication();

  const busy = useMemo(
    () =>
      !!user &&
      slot.sessions.some((s) => s.workshop?.tutors?.some((t) => t.id === user.profile?.id)),
    [slot, user]
  );

  const sessions = useMemo(() => slot.sessions.filter(hasWorkshop), [slot]);

  const past = slot.endsAt < DateTime.now();

  return (
    <section className="workshop-selection__slot">
      <header>
        <h3>
          <Skeleton text loading={loading}>
            {slot.startsAt.plus(0).toFormat('EEEE d MMMM')}
          </Skeleton>
        </h3>
        <time dateTime={slot.startsAt.toISO() as string}>
          <Skeleton text loading={loading}>
            {[slot.startsAt, slot.endsAt].map((t) => t.toFormat('ha')).join('–')}
          </Skeleton>
        </time>
      </header>
      {busy && (
        <div className="workshop-selection__busy">You’re teaching during this timeslot.</div>
      )}
      <div className="workshop-selection__workshops">
        {sessions.map((session) => (
          <WorkshopCard disabled={busy || past} key={session.id} session={session} slot={slot} />
        ))}
      </div>
    </section>
  );
};

export default Slot;
