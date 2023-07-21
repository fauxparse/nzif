import { range } from 'lodash-es';

import Checkbox from '@/atoms/Checkbox';
import { RegistrationSlotFragment, RegistrationWorkshopFragment } from '@/graphql/types';

import { useWorkshopSelectionContext } from './WorkshopSelectionContext';

type PreferenceCheckboxProps = {
  preference: number | null;
  workshop: RegistrationWorkshopFragment;
  slot: RegistrationSlotFragment;
  disabled?: boolean;
};

const PreferenceCheckbox: React.FC<PreferenceCheckboxProps> = ({
  workshop,
  slot,
  preference,
  disabled,
}) => {
  const { registrationStage, add, remove } = useWorkshopSelectionContext();

  const changed = () => {
    (preference ? remove : add)({
      workshop,
      slot,
    });
  };

  return (
    <Checkbox
      className="workshop__checkbox"
      checked={!!preference}
      preference={(registrationStage === 'earlybird' && preference) || undefined}
      disabled={disabled || undefined}
      value={workshop.id}
      onChange={changed}
    >
      <svg className="checkbox__burst" viewBox="-64 -64 128 128">
        {range(7).map((i) => (
          <g
            style={{ rotate: `${(i * 360) / 7}deg`, scale: String(Math.random() * 0.2 + 0.8) }}
            key={i}
          >
            <circle cx="0" cy="0" r="4" />
          </g>
        ))}
      </svg>
    </Checkbox>
  );
};

export default PreferenceCheckbox;
