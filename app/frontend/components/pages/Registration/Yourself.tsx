import { Collapsible } from '@/components/helpers/Collapsible';
import { CityPicker } from '@/components/molecules/CityPicker';
import { FormField } from '@/components/molecules/FormField';
import WarningIcon from '@/icons/WarningIcon';
import { useAuthentication } from '@/services/Authentication';
import { useRegistration } from '@/services/Registration';
import { RegistrationQuery } from '@/services/Registration/queries';
import { useMutation } from '@apollo/client';
import { Callout } from '@radix-ui/themes';
import { FieldState, useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { last, omit, pickBy } from 'lodash-es';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { FULL_NAME_MESSAGE } from '../Profile';
import { UpdateProfileMutation } from '../Profile/queries';
import { Buttons } from './Buttons';

import classes from './Registration.module.css';
import { UpdateRegistrationMutation } from './queries';

type FormValues = {
  name: string;
  pronouns: string;
  email: string;
  password: string;
  city: string | null;
  country: string | null;
  phone: string;
};

const errorFrom = <T,>(state: FieldState<T>) => {
  const error = last(state.meta.errors);
  return state.meta.isPristine || error === 'Required' ? undefined : error;
};

export const Yourself: React.FC = () => {
  const { loading, registration, refetch, goToNextStep } = useRegistration();

  const { signUp, logIn, requestPasswordReset } = useAuthentication();

  const [busy, setBusy] = useState(false);

  const [incorrectPassword, setIncorrectPassword] = useState(false);

  const user = useMemo(() => {
    if (!registration?.user) return null;

    return { ...registration.user.profile, email: registration.user.email };
  }, [registration]);

  const [updateProfile] = useMutation(UpdateProfileMutation);

  const [updateRegistration] = useMutation(UpdateRegistrationMutation);

  const register = async (values: FormValues) => {
    const logInOrSignUp = async () => {
      setIncorrectPassword(false);

      const { data, errors } = await logIn({ email: values.email, password: values.password });
      if (data?.userLogin?.user) {
        return data.userLogin.user;
      }

      const { data: signUpData, errors: signUpErrors } = await signUp({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (signUpData?.userRegister?.user) {
        return signUpData.userRegister.user;
      }

      setIncorrectPassword(true);
      await requestPasswordReset({ email: values.email, redirectUrl: '/register' });

      return null;
    };

    setBusy(true);

    const loggedInUser = user || (await logInOrSignUp());

    if (loggedInUser) {
      const { city, country, ...attributes } = values;

      await updateProfile({
        variables: {
          attributes: {
            ...pickBy(omit(attributes, 'password'), (value) => !!value),
            city: city && country ? { name: city, country } : null,
          },
        },
      });

      await updateRegistration({
        variables: { attributes: {} },
        refetchQueries: [RegistrationQuery],
      });

      goToNextStep();
    }

    setBusy(false);
  };

  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      pronouns: user?.pronouns || '',
      email: user?.email || '',
      password: '',
      city: user?.city?.name || null,
      country: user?.city?.country || null,
      phone: user?.phone || '',
    } satisfies FormValues,
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      register(value);
    },
  });

  return (
    <form
      className={classes.page}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div />

      <div className={classes.yourself}>
        <Collapsible open={incorrectPassword}>
          <Callout.Root size="3">
            <Callout.Icon>
              <WarningIcon />
            </Callout.Icon>
            <Callout.Text>
              Looks like you’ve registered with us before, but that’s not the right password. We’ve
              sent you a link to reset it, but please get in touch if you’re having trouble.
            </Callout.Text>
          </Callout.Root>
        </Collapsible>

        <form.Field
          name="name"
          validators={{
            onChangeAsync: z
              .string()
              .regex(/[^\s]{2,}\s+[^\s]{2,}/, { message: FULL_NAME_MESSAGE }),
          }}
        >
          {(field) => (
            <FormField.Root label="Name" error={errorFrom(field.state)}>
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
              <FormField.TextField value={field.state.value} onValueChange={field.handleChange} />
            </FormField.Root>
          )}
        </form.Field>
        <form.Field
          name="email"
          validators={{
            onChange: z.string().email('Please enter a valid email address'),
          }}
        >
          {(field) => (
            <FormField.Root
              label="Email address"
              className={classes.fullWidth}
              error={errorFrom(field.state)}
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
        {!user && (
          <form.Field
            name="password"
            validators={{
              onChange: z.string().min(1, { message: 'Please choose a password' }),
            }}
          >
            {(field) => (
              <FormField.Root
                label="Choose a password"
                className={classes.fullWidth}
                error={errorFrom(field.state)}
              >
                <FormField.TextField
                  type="password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onValueChange={field.handleChange}
                />
              </FormField.Root>
            )}
          </form.Field>
        )}
        <form.Field name="phone">
          {(field) => (
            <FormField.Root
              label="NZ mobile number"
              className={classes.fullWidth}
              error={errorFrom(field.state)}
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
            <FormField.Root
              label="Home town"
              className={classes.fullWidth}
              error={errorFrom(field.state)}
            >
              <CityPicker
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
      </div>

      <form.Subscribe<boolean> selector={(state) => state.canSubmit}>
        {(canSubmit) => <Buttons disabled={!canSubmit} />}
      </form.Subscribe>
    </form>
  );
};
