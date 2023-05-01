import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import Popover from '@/molecules/Popover';

type NewActivityProps = {
  name: string;
};

const NewActivity: React.FC<NewActivityProps> = () => {
  return (
    <form className="new-activity">
      <header className="new-activity__header">
        <Button icon="arrowLeft" aria-label="Back" />
        <Input className="popover__title" />
        <Popover.Close />
      </header>
    </form>
  );
};

export default NewActivity;
