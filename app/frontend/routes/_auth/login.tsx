import { useAuthentication, LogInVariables } from '@/services/Authentication';
import { Link, createFileRoute } from '@tanstack/react-router';
import { DeepKeys, FieldApi, FormApi, createFormFactory, useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import Box from '@/components/Box';
import { ChangeEvent, ComponentPropsWithoutRef } from 'react';

const LogIn = () => {
  const { logIn, loading, error } = useAuthentication();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => logIn(value),
  });

  const search = Route.useSearch();

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
          {error && <p>{error}</p>}
          <form.Field name="email" validators={{ onChange: z.string() }}>
            {(field) => (
              <Box
                as="input"
                type="email"
                placeholder="Email"
                autoFocus
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
              <input
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
          <button type="submit">Log in</button>
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
