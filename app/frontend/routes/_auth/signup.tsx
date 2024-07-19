import { Spinner } from '@/components/atoms/Spinner';
import { AuthenticationForm } from '@/components/layouts/Authentication/AuthenticationForm';
import { AuthenticationFormItem } from '@/components/layouts/Authentication/AuthenticationFormItem';
import { FormField } from '@/components/molecules/FormField';
import UserIcon from '@/icons/UserIcon';
import { SignUpVariables, useAuthentication } from '@/services/Authentication';
import { Button, Text, TextField } from '@radix-ui/themes';
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
                <FormField.Root label="Your name" error={field.state.meta.errors[0]}>
                  <FormField.TextField
                    type="text"
                    autoComplete="name"
                    autoCapitalize="words"
                    placeholder="Lauren Ipsum"
                    autoFocus
                    value={field.state.value}
                    onBlur={(e) => {
                      if (e.relatedTarget?.closest('a')) return;
                      field.handleBlur();
                    }}
                    onValueChange={field.handleChange}
                  >
                    <TextField.Slot side="left">
                      <UserIcon />
                    </TextField.Slot>
                  </FormField.TextField>
                </FormField.Root>
              )}
            </form.Field>
          </AuthenticationFormItem>
          <AuthenticationFormItem layoutId="auth-email">
            <form.Field
              name="email"
              validators={{ onBlur: z.string().email('Please enter a valid email address') }}
            >
              {(field) => (
                <FormField.Root label="Your email address" error={field.state.meta.errors[0]}>
                  <FormField.TextField
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    autoFocus
                    value={field.state.value}
                    onBlur={(e) => {
                      if (e.relatedTarget?.closest('a')) return;
                      field.handleBlur();
                    }}
                    onValueChange={field.handleChange}
                  >
                    <TextField.Slot side="left">
                      <UserIcon />
                    </TextField.Slot>
                  </FormField.TextField>
                </FormField.Root>
              )}
            </form.Field>
          </AuthenticationFormItem>
          <AuthenticationFormItem layoutId="auth-password">
            <form.Field name="password" validators={{ onChange: z.string() }}>
              {(field) => (
                <FormField.Root label="Choose a password" error={field.state.meta.errors[0]}>
                  <FormField.TextField
                    autoComplete="new-password"
                    autoFocus
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <TextField.Slot side="left">
                      <UserIcon />
                    </TextField.Slot>
                  </FormField.TextField>
                </FormField.Root>
              )}
            </form.Field>
          </AuthenticationFormItem>
          <AuthenticationFormItem layoutId="auth-submit">
            <form.Subscribe<boolean> selector={(state) => state.canSubmit}>
              {(canSubmit) => (
                <Button
                  type="submit"
                  variant="solid"
                  aria-disabled={loading || !canSubmit || undefined}
                >
                  {loading ? <Spinner /> : 'Log in'}
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
