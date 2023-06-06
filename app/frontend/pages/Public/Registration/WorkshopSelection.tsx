import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import {
  RegistrationWorkshopFragment,
  RegistrationWorkshopSlotFragment,
  useRegistrationQuery,
} from '@/graphql/types';

import HowWorkshopsWork from './HowWorkshopsWork';
import WorkshopCard from './WorkshopCard';
import WorkshopDetails from './WorkshopDetails';

const WorkshopSelection: React.FC = () => {
  const { data } = useRegistrationQuery();

  const { festival } = data || {};

  const { workshopSlots = [] } = festival || {};

  const [selected, setSelected] = useState<{
    workshop: RegistrationWorkshopFragment;
    slot: RegistrationWorkshopSlotFragment;
  } | null>(null);

  return (
    <form className="workshop-selection">
      <HowWorkshopsWork />
      {workshopSlots.map((slot) => (
        <section className="workshop-selection__slot" key={slot.id}>
          <header>
            <h3>{slot.startsAt.plus(0).toFormat('EEEE d MMMM')}</h3>
            <time dateTime={slot.startsAt.toISO() as string}>
              {[slot.startsAt, slot.endsAt].map((t) => t.toFormat('ha')).join('–')}
            </time>
          </header>
          <div className="workshop-selection__workshops">
            {slot.workshops.map((workshop) => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                onMoreInfoClick={() => setSelected({ workshop, slot })}
              />
            ))}
          </div>
        </section>
      ))}
      <AnimatePresence>
        {selected && <WorkshopDetails {...selected} onOpenChange={() => setSelected(null)} />}
      </AnimatePresence>
    </form>
  );
};

export default WorkshopSelection;
