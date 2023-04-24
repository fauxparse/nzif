import { camelCase } from 'lodash-es';

import Button from '@/atoms/Button';
import Icon, { IconName } from '@/atoms/Icon';
import { TimetableSlotFragment } from '@/graphql/types';

import { Block } from './useTimetable';

interface TimetableSlotProps {
  slot: Block<TimetableSlotFragment>;
}

const TimetableSlot: React.FC<TimetableSlotProps> = ({ slot }) => (
  <div
    className="timetable__slot"
    style={{
      gridRow: `${slot.row + 2} / span ${slot.height}`,
      gridColumn: `${slot.column + 2} / span ${slot.width}`,
    }}
  >
    <Icon name={camelCase(slot.data.activityType) as IconName} />
    <span className="timetable__slot__type">{slot.data.activityType}</span>
    <span className="timetable__slot__venue">
      {slot.data.venue?.room || slot.data.venue?.building}
    </span>
    <Button small ghost icon="moreVertical" aria-label="options" />
  </div>
);

export default TimetableSlot;
