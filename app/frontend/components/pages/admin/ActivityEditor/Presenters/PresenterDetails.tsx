import { CityPicker } from '@/components/molecules/CityPicker';
import { ImageUploader } from '@/components/molecules/ImageUploader';
import { useConfirmation } from '@/components/organisms/ConfirmationModal';
import { Editor } from '@/components/organisms/Editor';
import { CityAttributes, PersonAttributes } from '@/graphql/types';
import TrashIcon from '@/icons/TrashIcon';
import { useMutation } from '@apollo/client';
import { Box, Button, TextField } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { isEmpty, pickBy } from 'lodash-es';
import { UpdatePresenterMutation } from '../queries';
import { Presenter, WithUploadedPicture } from '../types';

import classes from './Presenters.module.css';

export type Fields = WithUploadedPicture<
  Omit<Presenter, 'picture' | 'city' | 'country'> & { city: string | null; country: string | null }
>;

type PresenterDetailsProps = {
  presenter: Presenter;
  onRemove: (presenter: Presenter) => void;
};

export const PresenterDetails: React.FC<PresenterDetailsProps> = ({ presenter, onRemove }) => {
  const [updateMutation] = useMutation(UpdatePresenterMutation);

  const update = (attributes: Partial<PersonAttributes>) =>
    updateMutation({
      variables: {
        id: presenter.id,
        attributes,
      },
    });

  const form = useForm({
    asyncDebounceMs: 1000,
    defaultValues: {
      id: presenter.id,
      name: presenter.name,
      pronouns: presenter.pronouns,
      bio: presenter.bio,
      city: presenter.city?.name ?? null,
      country: presenter.city?.country ?? null,
      uploadedPicture: null,
    } as Fields,
    onSubmit: async ({ value, formApi }) => {
      const attributes = pickBy(
        value,
        (_, key) => formApi.getFieldMeta(key as keyof Fields)?.isDirty
      ) as Partial<PersonAttributes>;

      if (attributes.city) {
        attributes.city =
          value.city && value.country
            ? ({
                name: value.city,
                country: value.country,
              } as CityAttributes)
            : null;
      }

      if (value.uploadedPicture) {
        attributes.uploadedPicture = value.uploadedPicture;
      }

      if (!isEmpty(attributes)) {
        await update(attributes);
        form.reset();
      }
    },
  });

  const name = form.useStore((state) => state.values.name);

  const { confirm } = useConfirmation();

  const removeClicked = () => {
    confirm({
      title: 'Remove presenter',
      children: `Are you sure you want to remove ${name}?`,
      countdown: 3,
    }).then(() => onRemove(presenter));
  };

  return (
    <Box className={classes.presenterDetails}>
      <form.Field name="name">
        {(field) => (
          <TextField.Root
            size="3"
            className={classes.presenterName}
            placeholder="Name"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.currentTarget.value)}
            onBlur={() => form.handleSubmit()}
          />
        )}
      </form.Field>
      <form.Field name="pronouns">
        {(field) => (
          <TextField.Root
            size="3"
            className={classes.presenterPronouns}
            placeholder="Pronouns"
            value={field.state.value || ''}
            onChange={(e) => field.handleChange(e.currentTarget.value)}
            onBlur={() => form.handleSubmit()}
          />
        )}
      </form.Field>
      <form.Field name="bio">
        {(field) => (
          <Editor
            className={classes.presenterBio}
            placeholder="Presenter bio"
            toolbar={false}
            value={field.state.value || ''}
            onChange={(value) => {
              if (value === field.state.value) return;
              field.handleChange(value);
              form.handleSubmit();
            }}
          />
        )}
      </form.Field>
      <form.Field name="uploadedPicture">
        {(field) => (
          <ImageUploader
            className={classes.presenterPicture}
            compact
            width={512}
            height={512}
            value={presenter.picture?.medium ?? null}
            onChange={(value) => {
              field.handleChange(value);
              form.handleSubmit();
            }}
          />
        )}
      </form.Field>
      <form.Field name="city">
        {(field) => (
          <CityPicker
            className={classes.presenterCity}
            city={field.state.value}
            country={field.form.getFieldValue('country')}
            onChange={(city, country) => {
              console.log(city, country);
              field.handleChange(city);
              form.setFieldValue('country', country);
              form.handleSubmit();
            }}
          />
        )}
      </form.Field>
      <Box className={classes.presenterButtons}>
        <Button variant="outline" size="3" onClick={removeClicked}>
          <TrashIcon />
          Remove {name}
        </Button>
      </Box>
    </Box>
  );
};
