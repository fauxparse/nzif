import { ImageUploader } from '@/components/molecules/ImageUploader';
import { Editor } from '@/components/organisms/Editor';
import { ActivityAttributes } from '@/graphql/types';
import { useMutation } from '@apollo/client';
import { notifications } from '@mantine/notifications';
import { useForm } from '@tanstack/react-form';
import { ResultOf } from 'gql.tada';
import { isEmpty, pick } from 'lodash-es';
import { useRef } from 'react';
import { Presenters } from './Presenters';
import { UpdateActivityMutation } from './queries';
import { Activity, ActivityDetails, Presenter, WithUploadedPicture, isShow } from './types';

type EditProps = {
  activity: Activity;
};

const getDefaultValuesFromActivity = (activity: Activity): ActivityDetails => {
  return pick(activity, ['name', 'type', 'slug', 'description']) as ActivityDetails;
};

export const Edit: React.FC<EditProps> = ({ activity }) => {
  const [updateMutation] = useMutation(UpdateActivityMutation);

  const hasPresenters = true;

  const lastSaved = useRef<
    Activity | NonNullable<ResultOf<typeof UpdateActivityMutation>['updateActivity']>['activity']
  >(activity);

  const updatePresenters = (presenters: Presenter[]) => {
    updateMutation({
      variables: {
        id: activity.id,
        attributes: {
          profileIds: presenters.map((p) => p.id),
        },
      },
    }).then(({ data }) => {
      if (data?.updateActivity?.activity) {
        lastSaved.current = data.updateActivity.activity;
      }
    });
  };

  const addPresenter = (presenter: Presenter) => {
    updatePresenters([...activity.presenters, presenter]);
  };

  const removePresenter = (presenter: Presenter) => {
    updatePresenters(activity.presenters.filter((p) => p.id !== presenter.id));
  };

  const form = useForm({
    defaultValues: {
      ...getDefaultValuesFromActivity(activity),
      uploadedPicture: null,
    } as WithUploadedPicture<ActivityDetails>,
    onSubmit: async ({ value }) => {
      const attributes = {} as ActivityAttributes;

      if (value.description !== lastSaved.current.description) {
        attributes.description = value.description;
      }

      if (value.uploadedPicture && form.state.fieldMeta.uploadedPicture.isDirty) {
        attributes.uploadedPicture = value.uploadedPicture;
      }

      if (isEmpty(attributes)) return;

      await updateMutation({
        variables: {
          id: activity.id,
          attributes,
        },
      }).then(({ data }) => {
        if (data?.updateActivity?.activity) {
          lastSaved.current = data.updateActivity.activity;
          notifications.show({ message: 'Changes saved' });
          form.reset();
          form.setFieldValue('uploadedPicture', null);
        }
      });
    },
  });

  return (
    <div className="activity-editor__edit">
      <form.Field name="description">
        {(field) => (
          <Editor
            value={field.state.value || ''}
            onChange={(value) => {
              if (value === field.state.value) return;
              field.handleChange(value);
              form.handleSubmit();
            }}
          />
        )}
      </form.Field>
      {hasPresenters && (
        <form.Field name="presenters">
          {(field) => (
            <Presenters
              title={isShow(activity) ? 'Directors' : 'Tutors'}
              activity={activity}
              onAddPresenter={addPresenter}
              onRemovePresenter={removePresenter}
            />
          )}
        </form.Field>
      )}
      <form.Field name="uploadedPicture">
        {(field) => (
          <ImageUploader
            className="activity-editor__picture"
            width={1920}
            height={1080}
            value={activity.picture?.large ?? null}
            onChange={(value) => {
              field.handleChange(value);
              form.handleSubmit();
            }}
          />
        )}
      </form.Field>
    </div>
  );
};
