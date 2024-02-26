import { useAuthentication } from '@/services/Authentication';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { ChangeEvent } from 'react';
import TextInput from '@/components/TextInput';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import AtSignIcon from '@/icons/AtSignIcon';
import KeyIcon from '@/icons/KeyIcon';
import XIcon from '@/icons/XIcon';

const LogIn = () => {
  const { logIn, loading, error } = useAuthentication();

  const navigate = useNavigate();

  const search = Route.useSearch();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) =>
      logIn(value).then(({ data }) => {
        if (data) {
          setTimeout(() => navigate({ to: search.redirect || '/' }));
        }
      }),
  });

  return (
    <form.Provider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Logo />
        <h2>Log in</h2>
        <fieldset disabled={loading || undefined}>
          <form.Field name="email" validators={{ onChange: z.string() }}>
            {(field) => (
              <TextInput
                label="Your email address"
                type="email"
                placeholder="yes@and.com"
                autoFocus
                leftSection={<AtSignIcon />}
                leftSectionPointerEvents="none"
                error={error}
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <form.Field name="password" validators={{ onChange: z.string() }}>
            {(field) => (
              <TextInput
                label={
                  <>
                    <span>Your password</span>
                    <span style={{ justifySelf: 'end' }}>Forgot your password?</span>
                  </>
                }
                labelProps={{ display: 'contents' }}
                leftSection={<KeyIcon />}
                leftSectionPointerEvents="none"
                type="password"
                placeholder="Password"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <Button variant="solid" color="primary" type="submit">
            Log in
          </Button>
        </fieldset>
      </form>
      <Link to="/signup" search={search}>
        Sign up
      </Link>
    </form.Provider>
  );
};

export const Route = createFileRoute('/_auth/login')({
  component: LogIn,
});
