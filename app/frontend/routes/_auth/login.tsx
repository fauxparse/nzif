import { AuthenticationForm } from '@/components/layouts/Authentication/AuthenticationForm';
import { AuthenticationFormItem } from '@/components/layouts/Authentication/AuthenticationFormItem';
import KeyIcon from '@/icons/KeyIcon';
import UserIcon from '@/icons/UserIcon';
import { LogInVariables, useAuthentication } from '@/services/Authentication';
import { Button, Text, TextInput } from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

export const Route = createFileRoute('/_auth/login')({
  component: () => {
    const { logIn, loading, error } = useAuthentication();

    const navigate = useNavigate();

    const search = Route.useSearch();

    const form = useForm({
      defaultValues: {
        email: '',
        password: '',
      } satisfies LogInVariables,
      validatorAdapter: zodValidator(),
      onSubmit: async ({ value }) => {
        logIn(value).then(({ data }) => {
          if (data) {
            setTimeout(() => navigate({ to: search.redirect || '/' }));
          }
        });
      },
    });

    return (
      <AuthenticationForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <AuthenticationFormItem layoutId="auth-email">
            <form.Field
              name="email"
              validators={{ onBlur: z.string().email('Please enter a valid email address') }}
            >
              {(field) => (
                <TextInput
                  size="lg"
                  label="Your email address"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  leftSection={<UserIcon />}
                  autoFocus
                  value={field.state.value}
                  error={field.state.meta.errors[0]}
                  onBlur={(e) => {
                    if (e.relatedTarget?.closest('a')) return;
                    field.handleBlur();
                  }}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                />
              )}
            </form.Field>
          </AuthenticationFormItem>
          <AuthenticationFormItem layoutId="auth-password" fade>
            <form.Field name="password" validators={{ onChange: z.string() }}>
              {(field) => (
                <TextInput
                  type="password"
                  size="lg"
                  label={
                    <>
                      <span>Your password</span>
                      <Link to="/forgot">Forgot your password?</Link>
                    </>
                  }
                  autoComplete="current-password"
                  leftSection={<KeyIcon />}
                  value={field.state.value}
                  error={error || field.state.meta.errors[0]}
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                />
              )}
            </form.Field>
          </AuthenticationFormItem>
          <AuthenticationFormItem layoutId="auth-submit">
            <form.Subscribe<boolean> selector={(state) => state.canSubmit}>
              {(canSubmit) => (
                <Button
                  type="submit"
                  variant="filled"
                  size="lg"
                  loading={loading}
                  loaderProps={{ type: 'dots' }}
                  disabled={loading || !canSubmit || undefined}
                >
                  Log in
                </Button>
              )}
            </form.Subscribe>
          </AuthenticationFormItem>
          <AuthenticationFormItem layoutId="auth-link">
            <Text>
              New to NZIF? <Link to="/signup">Create an account</Link>.
            </Text>
          </AuthenticationFormItem>
        </form>
      </AuthenticationForm>
    );
  },
});
