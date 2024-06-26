import { AuthenticationForm } from '@/components/layouts/Authentication/AuthenticationForm';
import { AuthenticationFormItem } from '@/components/layouts/Authentication/AuthenticationFormItem';
import KeyIcon from '@/icons/KeyIcon';
import UserIcon from '@/icons/UserIcon';
import { SignUpVariables, useAuthentication } from '@/services/Authentication';
import { Button, Text, TextInput } from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

export const Route = createFileRoute('/_auth/signup')({
  component: () => {
    const { signUp, loading, error } = useAuthentication();

    const navigate = useNavigate();

    const search = Route.useSearch();

    const form = useForm({
      defaultValues: {
        name: '',
        email: '',
        password: '',
      } satisfies SignUpVariables,
      validatorAdapter: zodValidator(),
      onSubmit: async ({ value }) => {
        signUp(value).then(({ data }) => {
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
          <AuthenticationFormItem layoutId="auth-name" fade>
            <form.Field
              name="name"
              validators={{
                onBlur: z
                  .string()
                  .trim()
                  .regex(/[^\s]{2,}\s+[^\s]{2,}/, 'We need your full (first and last) name'),
              }}
            >
              {(field) => (
                <TextInput
                  size="lg"
                  label="Your name"
                  type="text"
                  autoComplete="name"
                  autoCapitalize="words"
                  placeholder="Lauren Ipsum"
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
                  autoComplete="email"
                  placeholder="you@email.com"
                  leftSection={<UserIcon />}
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
          <AuthenticationFormItem layoutId="auth-password">
            <form.Field name="password" validators={{ onChange: z.string() }}>
              {(field) => (
                <TextInput
                  size="lg"
                  label="Your password"
                  autoComplete="new-password"
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
                  aria-disabled={loading || !canSubmit || undefined}
                >
                  Log in
                </Button>
              )}
            </form.Subscribe>
          </AuthenticationFormItem>
          <AuthenticationFormItem layoutId="auth-link">
            <Text>
              Already have an account? <Link to="/login">Log in here</Link>.
            </Text>
          </AuthenticationFormItem>
        </form>
      </AuthenticationForm>
    );
  },
});
