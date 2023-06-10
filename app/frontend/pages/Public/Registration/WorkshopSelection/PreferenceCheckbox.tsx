import Checkbox from '@/atoms/Checkbox';
import { RegistrationWorkshopFragment, RegistrationWorkshopSlotFragment } from '@/graphql/types';

import { useWorkshopSelectionContext } from './WorkshopSelectionContext';

type PreferenceCheckboxProps = {
  preference: number | null;
  workshop: RegistrationWorkshopFragment;
  slot: RegistrationWorkshopSlotFragment;
};

const PreferenceCheckbox: React.FC<PreferenceCheckboxProps> = ({ workshop, slot, preference }) => {
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
      onChange={changed}
    />
  );
};

export default PreferenceCheckbox;
