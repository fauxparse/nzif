import { useAuthentication, LogInVariables } from '@/services/Authentication';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { DeepKeys, FieldApi, FormApi, createFormFactory, useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { ChangeEvent, ComponentPropsWithoutRef } from 'react';
import { Input, TextInput, Box, Button } from '@mantine/core';

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
      <h2>Log in</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <fieldset disabled={loading || undefined}>
          <form.Field name="email" validators={{ onChange: z.string() }}>
            {(field) => (
              <TextInput
                label="Your email address"
                type="email"
                placeholder="yes@and.com"
                autoFocus
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
          <Button type="submit">Log in</Button>
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
