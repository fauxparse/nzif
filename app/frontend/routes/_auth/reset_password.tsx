import { AuthenticationForm } from '@/components/layouts/Authentication/AuthenticationForm';
import { AuthenticationFormItem } from '@/components/layouts/Authentication/AuthenticationFormItem';
import { FormField } from '@/components/molecules/FormField';
import KeyIcon from '@/icons/KeyIcon';
import { useAuthentication } from '@/services/Authentication';
import { Button, TextField } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

const searchSchema = z.object({
  token: z.string().catch(''),
  redirect: z.string().optional().default('/'),
});

export const Route = createFileRoute('/_auth/reset_password')({
  validateSearch: (search) => searchSchema.parse(search),
  component: () => {
    const { token, redirect } = Route.useSearch();

    const { resetPassword } = useAuthentication();

    const navigate = Route.useNavigate();

    const form = useForm({
      defaultValues: {
        token,
        password: '',
        passwordConfirmation: '',
      },
      validatorAdapter: zodValidator(),
      onSubmit: ({ value }) => {
        resetPassword(value).then(() => navigate({ to: redirect }));
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
          <AuthenticationFormItem layoutId="auth-password" fade>
            <form.Field name="password" validators={{ onChange: z.string() }}>
              {(field) => (
                <FormField.Root label="New password" error={field.state.meta.errors[0]}>
                  <FormField.TextField
                    type="password"
                    autoFocus
                    autoComplete="new-password"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <TextField.Slot side="left">
                      <KeyIcon />
                    </TextField.Slot>
                  </FormField.TextField>
                </FormField.Root>
              )}
            </form.Field>
          </AuthenticationFormItem>
          <AuthenticationFormItem layoutId="auth-password-confirmation" fade>
            <form.Field
              name="passwordConfirmation"
              validators={{
                onChangeListenTo: ['password'],
                onChange: ({ value, fieldApi }) => {
                  if (value !== fieldApi.form.getFieldValue('password')) {
                    return 'Passwords do not match';
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <FormField.Root label="Confirm password" error={field.state.meta.errors[0]}>
                  <FormField.TextField
                    type="password"
                    autoFocus
                    autoComplete="new-password"
                    value={field.state.value}
                    onValueChange={field.handleChange}
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
                  aria-disabled={!canSubmit || undefined}
                >
                  Change password
                </Button>
              )}
            </form.Subscribe>
          </AuthenticationFormItem>
        </form>
      </AuthenticationForm>
    );
  },
});
