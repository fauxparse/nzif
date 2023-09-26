import Avatar from '@/atoms/Avatar';
import Button from '@/atoms/Button';

import { usePersonPicker } from './Context';
import { Profile } from './PersonPicker.types';

import './PersonPicker.css';

type ChipProps<T extends Profile = Profile> = {
  person: T;
  active?: boolean;
  onRemove: (person: T) => void;
};

export const Chip = <T extends Profile = Profile>({ person, active, onRemove }: ChipProps<T>) => {
  const { uniqueId } = usePersonPicker();

  const remove = () => {
    onRemove(person);
  };

  return (
    <div
      data-active={active || undefined}
      id={`${uniqueId}${person.id}`}
      className="person-picker__person"
    >
      <Avatar name={person.name} />
      <div className="person-picker__name">{person.name}</div>
      <Button
        className="person-picker__delete"
        small
        ghost
        icon="close"
        aria-label="Delete"
        tabIndex={-1}
        onClick={remove}
      />
    </div>
  );
};

Chip.displayName = 'Chip';

export default Chip;
