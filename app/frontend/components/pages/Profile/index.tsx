import { CityPicker } from '@/components/molecules/CityPicker';
import { FormField } from '@/components/molecules/FormField';
import { ImageUploader } from '@/components/molecules/ImageUploader';
import Header from '@/components/organisms/Header';
import { useMutation, useQuery } from '@apollo/client';
import { Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Button, Heading } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { isEmpty, pickBy } from 'lodash-es';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { WithUploadedPicture } from '../admin/ActivityEditor/types';
import { ProfileQuery, UpdatePasswordMutation, UpdateProfileMutation } from './queries';

import { Spinner } from '@/components/atoms/Spinner';
import classes from './Profile.module.css';

type ProfileForm = WithUploadedPicture<{
  name: string;
  pronouns: string;
  email: string;
  phone: string;
  city: string | null;
  country: string | null;
}>;

type PasswordForm = { password: string; passwordConfirmation: string };

const FULL_NAME_MESSAGE = 'Please give us your first and last name so we can tell everyone apart';

export const Profile: React.FC = () => {
  const { loading, data } = useQuery(ProfileQuery);

  const [saving, setSaving] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);

  const defaultValues = useMemo<ProfileForm>(() => {
    if (data?.user?.profile) {
      return {
        name: data.user.profile.name || '',
        pronouns: data.user.profile.pronouns || '',
        email: data.user.email || '',
        phone: data.user.profile.phone || '',
        city: data.user.profile.city?.name || null,
        country: data.user.profile.city?.country || null,
        uploadedPicture: null,
      };
    }

    return {
      name: '',
      pronouns: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      uploadedPicture: null,
    };
  }, [data]);

  const [updateProfile] = useMutation(UpdateProfileMutation);
  const [updatePassword] = useMutation(UpdatePasswordMutation);

  const form = useForm({
    defaultValues,
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value, formApi }) => {
      const attributes = pickBy(
        value,
        (_, key) => formApi.getFieldMeta(key as keyof ProfileForm)?.isDirty
      );

      if (isEmpty(attributes)) return;

      setSaving(true);
      updateProfile({
        variables: { attributes },
      }).finally(() => {
        form.reset();
        setSaving(false);
        notifications.show({ message: 'Profile updated' });
      });
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    } as PasswordForm,
    onSubmit: async ({ value }) => {
      setChangingPassword(true);
      updatePassword({
        variables: value,
      }).finally(() => {
        passwordForm.reset();
        setChangingPassword(false);
        notifications.show({ message: 'Password changed' });
      });
    },
  });

  const isDirty = form.useStore((state) => state.isDirty);

  const passwordIsDirty = passwordForm.useStore((state) => state.isDirty);

  return (
    <div className="profile">
      <Header title="Your profile" />
      <div className="body">
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <fieldset disabled={loading || undefined}>
            <Heading as="h3" size="5">
              Your details
            </Heading>
            <form.Field
              name="name"
              validators={{
                onChangeAsync: z.string().regex(/[^\s]{2,}\s+[^\s]{2,}/, FULL_NAME_MESSAGE),
              }}
            >
              {(field) => (
                <FormField.Root
                  label="Name"
                  description={field.state.meta.errors[0] ? null : FULL_NAME_MESSAGE}
                  error={field.state.meta.errors[0]}
                >
                  <FormField.TextField
                    autoComplete="name"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  />
                </FormField.Root>
              )}
            </form.Field>
            <form.Field name="pronouns">
              {(field) => (
                <FormField.Root label="Pronouns" error={field.state.meta.errors[0]}>
                  <FormField.TextField
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  />
                </FormField.Root>
              )}
            </form.Field>
            <form.Field
              name="email"
              validators={{
                onChangeAsync: z.string().email('Please enter a valid email address'),
              }}
            >
              {(field) => (
                <FormField.Root
                  label="Email address"
                  description="So we can contact you about your registration"
                  error={field.state.meta.errors[0]}
                >
                  <FormField.TextField
                    type="email"
                    autoComplete="email"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  />
                </FormField.Root>
              )}
            </form.Field>
            <form.Field name="phone">
              {(field) => (
                <FormField.Root
                  label="NZ mobile number"
                  description="For time-sensitive text notifications"
                  error={field.state.meta.errors[0]}
                >
                  <FormField.TextField
                    type="tel"
                    autoComplete="tel"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  />
                </FormField.Root>
              )}
            </form.Field>
            <form.Field name="city">
              {(field) => (
                <FormField.Root label="Home town" error={field.state.meta.errors[0]}>
                  <CityPicker
                    className="presenter-details__city"
                    city={field.state.value}
                    country={field.form.getFieldValue('country')}
                    onChange={(city, country) => {
                      field.handleChange(city);
                      form.setFieldValue('country', country);
                    }}
                  />
                </FormField.Root>
              )}
            </form.Field>
            <form.Field name="uploadedPicture">
              {(field) => (
                <ImageUploader
                  className={classes.picture}
                  compact
                  width={512}
                  height={512}
                  value={data?.user?.profile?.picture?.medium ?? null}
                  onChange={field.handleChange}
                />
              )}
            </form.Field>
            <div className={classes.buttons}>
              <Button type="submit" variant="solid" size="3" disabled={!isDirty || saving}>
                {saving ? (
                  <>
                    <Spinner color="gray" /> Saving…
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </div>
          </fieldset>
        </form>
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            passwordForm.handleSubmit();
          }}
        >
          <Title order={3}>Change password</Title>
          <passwordForm.Field name="password">
            {(field) => (
              <FormField.Root label="New password">
                <FormField.TextField
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onValueChange={field.handleChange}
                />
              </FormField.Root>
            )}
          </passwordForm.Field>
          <passwordForm.Field
            name="passwordConfirmation"
            validators={{
              onChangeListenTo: ['password'],
              onChangeAsync: ({ value, fieldApi }) => {
                if (value !== fieldApi.form.getFieldValue('password')) {
                  return 'Passwords do not match';
                }
              },
            }}
          >
            {(field) => (
              <FormField.Root label="Confirm password" error={field.state.meta.errors[0]}>
                <FormField.TextField
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onValueChange={field.handleChange}
                />
              </FormField.Root>
            )}
          </passwordForm.Field>
          <div className={classes.buttons}>
            <Button type="submit" variant="solid" size="3" disabled={!isDirty || changingPassword}>
              {changingPassword ? (
                <>
                  <Spinner color="gray" /> Saving…
                </>
              ) : (
                'Change password'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
