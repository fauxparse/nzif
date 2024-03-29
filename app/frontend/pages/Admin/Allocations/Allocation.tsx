import { sortBy } from 'lodash-es';

import Button from '@/atoms/Button';
import { FestivalWorkshopAllocationQuery } from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import ContextMenu from '@/molecules/ContextMenu';
import PageHeader from '@/molecules/PageHeader';

import AllocationSlot from './AllocationSlot';
import Popup from './Popup';
import useAllocation from './useAllocation';

type AllocationProps = {
  allocation: NonNullable<FestivalWorkshopAllocationQuery['festival']['workshopAllocation']>;
  registrations: NonNullable<FestivalWorkshopAllocationQuery['festival']['registrations']>;
  onRerun: () => void;
};

const Allocation: React.FC<AllocationProps> = ({ allocation, registrations, onRerun }) => {
  const { slots, score, dispatch, registration } = useAllocation(allocation, registrations);

  return (
    <ContextMenu.Root>
      <PageHeader className="allocations__header">
        <Breadcrumbs />
        <h1>Workshop allocation</h1>

        <div className="allocations__score">
          <b>
            {(score / 100).toLocaleString(navigator.language, {
              style: 'percent',
              minimumFractionDigits: 2,
            })}
          </b>
          <Button small text="Re-run" onClick={onRerun} />
        </div>
      </PageHeader>
      <div className="allocations">
        {sortBy(slots, 'startsAt').map((slot) => (
          <AllocationSlot key={slot.id} slot={slot} dispatch={dispatch} />
        ))}
      </div>
      <ContextMenu>
        <Popup slots={slots} getRegistration={registration} />
      </ContextMenu>
    </ContextMenu.Root>
  );
};

export default Allocation;
