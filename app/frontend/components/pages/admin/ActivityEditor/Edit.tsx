import { createFormFactory } from '@tanstack/react-form';
import { ActivityDetails } from './types';

type EditProps = {
  activity: ActivityDetails;
};

const formFactory = createFormFactory<ActivityDetails>({
  defaultValues: {
    name: '',
    slug: '',
  },
});

export const Edit: React.FC<EditProps> = ({ activity }) => {
  const form = formFactory.useForm({
    defaultValues: activity,
  });

  return (
    <div className="activity-editor__edit">
      <h1>{activity.name}</h1>
    </div>
  );
};
