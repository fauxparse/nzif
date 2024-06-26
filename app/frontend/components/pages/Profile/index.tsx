import { CityPicker } from '@/components/molecules/CityPicker';
import { ImageUploader } from '@/components/molecules/ImageUploader';
import Header from '@/components/organisms/Header';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Input, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { isEmpty, pickBy } from 'lodash-es';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { WithUploadedPicture } from '../admin/ActivityEditor/types';
import { ProfileQuery, UpdatePasswordMutation, UpdateProfileMutation } from './queries';

import './Profile.css';

type ProfileForm = WithUploadedPicture<{
  name: string;
  email: string;
  phone: string;
  city: string | null;
  country: string | null;
}>;

type PasswordForm = { password: string; passwordConfirmation: string };

export const Profile: React.FC = () => {
  const { loading, data } = useQuery(ProfileQuery);

  const [saving, setSaving] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);

  const defaultValues = useMemo<ProfileForm>(() => {
    if (data?.user?.profile) {
      return {
        name: data.user.profile.name || '',
        email: data.user.email || '',
        phone: data.user.profile.phone || '',
        city: data.user.profile.city?.name || null,
        country: data.user.profile.city?.country || null,
        uploadedPicture: null,
      };
    }

    return {
      name: '',
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
          className="profile__form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <fieldset disabled={loading || undefined}>
            <Title order={3}>Your details</Title>
            <form.Field
              name="name"
              validators={{
                onChangeAsync: z
                  .string()
                  .regex(/[^\s]{2,}\s+[^\s]{2,}/, 'Please enter your full name'),
              }}
            >
              {(field) => (
                <TextInput
                  size="md"
                  label="Name"
                  autoComplete="name"
                  description="Please give us your first and last name so we can tell everyone apart."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                  error={field.state.meta.errors[0]}
                />
              )}
            </form.Field>
            <form.Field
              name="email"
              validators={{
                onChangeAsync: z.string().email('Please enter a valid email address'),
              }}
            >
              {(field) => (
                <TextInput
                  size="md"
                  type="email"
                  autoComplete="email"
                  label="Email address"
                  description="So we can contact you about your registration"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                  error={field.state.meta.errors[0]}
                />
              )}
            </form.Field>
            <form.Field name="phone">
              {(field) => (
                <TextInput
                  size="md"
                  type="tel"
                  label="NZ mobile number"
                  description="For time-sensitive notifications"
                  autoComplete="tel"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                />
              )}
            </form.Field>
            <form.Field name="city">
              {(field) => (
                <Input.Wrapper size="md" label="Home town">
                  <CityPicker
                    className="presenter-details__city"
                    city={field.state.value}
                    country={field.form.getFieldValue('country')}
                    onChange={(city, country) => {
                      field.handleChange(city);
                      form.setFieldValue('country', country);
                    }}
                  />
                </Input.Wrapper>
              )}
            </form.Field>
            <form.Field name="uploadedPicture">
              {(field) => (
                <ImageUploader
                  className="presenter-details__picture"
                  compact
                  width={512}
                  height={512}
                  value={data?.user?.profile?.picture?.medium ?? null}
                  onChange={field.handleChange}
                />
              )}
            </form.Field>
            <div className="form__buttons">
              <Button
                type="submit"
                variant="filled"
                disabled={!isDirty}
                loading={saving || false}
                loaderProps={{ type: 'dots' }}
              >
                Save changes
              </Button>
            </div>
          </fieldset>
        </form>
        <form
          className="profile__form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            passwordForm.handleSubmit();
          }}
        >
          <Title order={3}>Change password</Title>
          <passwordForm.Field name="password">
            {(field) => (
              <TextInput
                size="md"
                type="password"
                autoComplete="new-password"
                label="New password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.currentTarget.value)}
              />
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
              <TextInput
                size="md"
                type="password"
                autoComplete="new-password"
                label="Confirm password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.currentTarget.value)}
                error={field.state.meta.errors[0]}
              />
            )}
          </passwordForm.Field>
          <div className="form__buttons">
            <Button
              type="submit"
              variant="filled"
              disabled={!passwordIsDirty}
              loading={changingPassword || false}
              loaderProps={{ type: 'dots' }}
            >
              Change password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
