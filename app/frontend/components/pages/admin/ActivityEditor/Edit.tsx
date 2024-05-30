import { Editor } from '@/components/organisms/Editor';
import { ActivityAttributes } from '@/graphql/types';
import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { createFormFactory } from '@tanstack/react-form';
import { pick } from 'lodash-es';
import { UpdateActivityMutation } from './queries';
import { Activity, ActivityDetails } from './types';

type EditProps = {
  activity: Activity;
};

const formFactory = createFormFactory<ActivityDetails>({
  defaultValues: {
    name: '',
    slug: '',
    description: '',
  },
});

export const Edit: React.FC<EditProps> = ({ activity }) => {
  const [updateMutation] = useMutation(UpdateActivityMutation);

  const form = formFactory.useForm({
    defaultValues: activity,
    onSubmit: ({ value }) => {
      updateMutation({
        variables: {
          id: activity.id,
          attributes: pick(value, ['description']) as ActivityAttributes,
        },
        update: (cache, { data }) => {
          if (!data?.updateActivity?.activity) return;

          const updated = data.updateActivity.activity;

          cache.modify({
            id: cache.identify(activity),
            fields: {
              description: () => updated.description,
            },
          });
        },
      }).then(() => {
        notifications.show({ message: 'Changes saved' });
      });
    },
  });

  return (
    <div className="activity-editor__edit">
      <h1>{activity.name}</h1>
      <form.Field name="description">
        {(field) => (
          <Editor
            value={field.state.value || ''}
            onChange={(value) => {
              if (field.state.value === value) return;
              field.handleChange(value);
              form.handleSubmit();
            }}
          />
        )}
      </form.Field>
    </div>
  );
};
