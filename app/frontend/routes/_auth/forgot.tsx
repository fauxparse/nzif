import { AuthenticationForm } from '@/components/layouts/Authentication/AuthenticationForm';
import { AuthenticationFormItem } from '@/components/layouts/Authentication/AuthenticationFormItem';
import UserIcon from '@/icons/UserIcon';
import { RequestPasswordResetVariables, useAuthentication } from '@/services/Authentication';
import { Button, Text, TextInput } from '@mantine/core';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/_auth/forgot')({
  component: () => {
    const { requestPasswordReset, loading, error } = useAuthentication();

    const navigate = useNavigate();

    const search = Route.useSearch();

    const [message, setMessage] = useState<string | null>(null);

    const form = useForm({
      defaultValues: {
        email: '',
        redirectUrl: search.redirect || '/',
      } satisfies RequestPasswordResetVariables,
      validatorAdapter: zodValidator(),
      onSubmit: async ({ value }) => {
        await requestPasswordReset(value).then(setMessage);
      },
    });

    return (
      <AnimatePresence mode="wait">
        {message ? (
          <motion.div
            key="message"
            variants={{ out: { opacity: 0 }, in: { opacity: 1 } }}
            initial="out"
            animate="in"
            exit="out"
          >
            <Text fz="lg" lh={1.5}>
              {message}
            </Text>
          </motion.div>
        ) : (
          <AuthenticationForm key="form">
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
                  validators={{
                    onChange: z.string().email('Please enter a valid email address'),
                  }}
                >
                  {(field) => (
                    <TextInput
                      size="lg"
                      label="Enter your email address to reset your password"
                      type="email"
                      placeholder="you@email.com"
                      autoComplete="email"
                      leftSection={<UserIcon />}
                      autoFocus
                      value={field.state.value}
                      error={field.state.meta.errors[0]}
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
                      Reset password
                    </Button>
                  )}
                </form.Subscribe>
              </AuthenticationFormItem>
            </form>
          </AuthenticationForm>
        )}
      </AnimatePresence>
    );
  },
});
