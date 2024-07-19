import { Spinner } from '@/components/atoms/Spinner';
import { AuthenticationForm } from '@/components/layouts/Authentication/AuthenticationForm';
import { AuthenticationFormItem } from '@/components/layouts/Authentication/AuthenticationFormItem';
import { FormField } from '@/components/molecules/FormField';
import KeyIcon from '@/icons/KeyIcon';
import UserIcon from '@/icons/UserIcon';
import { LogInVariables, useAuthentication } from '@/services/Authentication';
import { Button, Text, TextField } from '@radix-ui/themes';
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
                <FormField.Root label="Your email address" error={field.state.meta.errors[0]}>
                  <FormField.TextField
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
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
          <AuthenticationFormItem layoutId="auth-password" fade>
            <form.Field name="password" validators={{ onChange: z.string() }}>
              {(field) => (
                <FormField.Root
                  label={
                    <>
                      <span>Your password</span>
                      <Link to="/forgot">Forgot your password?</Link>
                    </>
                  }
                  error={error || field.state.meta.errors[0]}
                >
                  <FormField.TextField
                    type="password"
                    autoComplete="current-password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.currentTarget.value)}
                  >
                    <TextField.Slot side="left">
                      <KeyIcon />
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
                  size="3"
                  disabled={loading || !canSubmit || undefined}
                >
                  {loading ? <Spinner /> : 'Log in'}
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
