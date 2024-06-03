import { PersonPicker } from '@/components/molecules/PersonPicker';
import { Editor } from '@/components/organisms/Editor';
import { ActivityAttributes, ActivityType } from '@/graphql/types';
import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { createFormFactory } from '@tanstack/react-form';
import { pick } from 'lodash-es';
import { UpdateActivityMutation } from './queries';
import { Activity, ActivityDetails, isShow, isWorkshop } from './types';

type EditProps = {
  activity: Activity;
};

const formFactory = createFormFactory<ActivityDetails>({
  defaultValues: {
    name: '',
    type: ActivityType.Workshop,
    slug: '',
    description: '',
    presenters: [],
  },
});

const getDefaultValuesFromActivity = (activity: Activity): ActivityDetails => {
  const result = pick(activity, ['name', 'type', 'slug', 'description']) as ActivityDetails;

  if (isWorkshop(activity)) {
    result.presenters = activity.tutors.map((presenter) => ({
      id: presenter.id,
      name: presenter.name,
    }));
  } else if (isShow(activity)) {
    result.presenters = activity.directors.map((presenter) => ({
      id: presenter.id,
      name: presenter.name,
    }));
  }
  return result;
};

export const Edit: React.FC<EditProps> = ({ activity }) => {
  const [updateMutation] = useMutation(UpdateActivityMutation);

  const hasPresenters = isWorkshop(activity) || isShow(activity);

  const form = formFactory.useForm({
    defaultValues: getDefaultValuesFromActivity(activity),
    onSubmit: ({ value }) => {
      const attributes = pick(value, ['description']) as ActivityAttributes;

      if (hasPresenters) {
        attributes.profileIds = value.presenters.map((presenter) => presenter.id);
      }

      updateMutation({
        variables: {
          id: activity.id,
          attributes,
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
      {hasPresenters && (
        <form.Field name="presenters">
          {(field) => (
            <PersonPicker
              value={field.state.value}
              allowAdd
              onChange={(value) => {
                field.handleChange(value);
                form.handleSubmit();
              }}
            />
          )}
        </form.Field>
      )}
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
