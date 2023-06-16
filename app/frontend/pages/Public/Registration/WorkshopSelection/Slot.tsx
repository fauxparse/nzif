import { RegistrationSlotFragment } from '@/graphql/types';
import Skeleton from '@/helpers/Skeleton';

import WorkshopCard from './WorkshopCard';
import { useWorkshopSelectionContext } from './WorkshopSelectionContext';

type SlotProps = {
  slot: RegistrationSlotFragment;
};

const Slot: React.FC<SlotProps> = ({ slot }) => {
  const { loading } = useWorkshopSelectionContext();

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
      <div className="workshop-selection__workshops">
        {slot.workshops.map((workshop) => (
          <WorkshopCard key={workshop.id} workshop={workshop} slot={slot} />
        ))}
      </div>
    </section>
  );
};

export default Slot;
