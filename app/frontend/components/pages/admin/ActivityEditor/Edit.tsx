import { ImageUploader } from '@/components/molecules/ImageUploader';
import { useToast } from '@/components/molecules/Toast';
import { Editor } from '@/components/organisms/Editor';
import { ActivityAttributes } from '@/graphql/types';
import { useMutation } from '@apollo/client';
import { Flex, TextArea } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { ResultOf } from 'gql.tada';
import { isEmpty, pick, pickBy } from 'lodash-es';
import { useRef } from 'react';
import { Presenters } from './Presenters';
import { UpdateActivityMutation } from './queries';
import { Activity, ActivityDetails, Presenter, WithUploadedPicture, isShow } from './types';

import classes from './ActivityEditor.module.css';

type EditProps = {
  activity: Activity;
};

type Fields = WithUploadedPicture<ActivityDetails>;

const getDefaultValuesFromActivity = (activity: Activity): ActivityDetails => {
  return pick(activity, ['name', 'type', 'slug', 'description']) as ActivityDetails;
};

export const Edit: React.FC<EditProps> = ({ activity }) => {
  const [updateMutation] = useMutation(UpdateActivityMutation);

  const hasPresenters = true;

  const lastSaved = useRef<
    Activity | NonNullable<ResultOf<typeof UpdateActivityMutation>['updateActivity']>['activity']
  >(activity);

  const { notify } = useToast();

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
      pictureAltText: activity.picture?.altText ?? '',
    } as Fields,
    onSubmit: async ({ value, formApi }) => {
      const attributes = pickBy(
        value,
        (_, key) => formApi.getFieldMeta(key as keyof Fields)?.isDirty
      ) as Partial<ActivityAttributes>;

      if (isEmpty(attributes)) return;

      await updateMutation({
        variables: {
          id: activity.id,
          attributes,
        },
      }).then(({ data }) => {
        if (data?.updateActivity?.activity) {
          lastSaved.current = data.updateActivity.activity;
          notify({ description: 'Changes saved' });
          form.reset();
          form.setFieldValue('uploadedPicture', null);
        }
      });
    },
  });

  return (
    <div className={classes.edit}>
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
      <Flex direction="column" gap="3" className={classes.picture}>
        <form.Field name="uploadedPicture">
          {(field) => (
            <ImageUploader
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
        {activity.picture && (
          <form.Field name="pictureAltText">
            {(field) => (
              <TextArea
                size="2"
                placeholder="Image description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.currentTarget.value)}
                onBlur={() => {
                  if (field.state.meta.isDirty) form.handleSubmit();
                }}
              />
            )}
          </form.Field>
        )}
      </Flex>
    </div>
  );
};
