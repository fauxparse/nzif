import { range } from 'lodash-es';

import Checkbox from '@/atoms/Checkbox';
import { CheckboxIcon } from '@/atoms/Checkbox/Checkbox';
import {
  RegistrationPhase,
  RegistrationSessionFragment,
  RegistrationSlotFragment,
  RegistrationWorkshopFragment,
} from '@/graphql/types';

import { useWorkshopSelectionContext } from './WorkshopSelectionContext';

type PreferenceCheckboxProps = {
  preference: number | null;
  session: RegistrationSessionFragment;
  disabled?: boolean;
};

const PreferenceCheckbox: React.FC<PreferenceCheckboxProps> = ({
  session,
  preference,
  disabled,
}) => {
  const { registrationPhase, add, remove } = useWorkshopSelectionContext();

  const changed = () => {
    (preference ? remove : add)(session);
  };

  if (!session.workshop) return null;

  return (
    <Checkbox
      className="workshop__checkbox"
      checked={!!preference}
      preference={(registrationPhase === RegistrationPhase.Earlybird && preference) || undefined}
      disabled={disabled || undefined}
      value={session.workshop.id}
      onChange={changed}
    >
      <svg className="checkbox__burst" viewBox="-64 -64 128 128">
        <title>burst</title>
        {range(7).map((i) => (
          <g
            style={{ rotate: `${(i * 360) / 7}deg`, scale: String(Math.random() * 0.2 + 0.8) }}
            key={i}
          >
            <circle cx="0" cy="0" r="4" />
          </g>
        ))}
      </svg>
      <CheckboxIcon />
    </Checkbox>
  );
};

export default PreferenceCheckbox;
