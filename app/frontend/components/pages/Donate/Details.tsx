import { Checkbox } from '@/components/atoms/Checkbox';
import { FormField } from '@/components/molecules/FormField';
import { Box, Flex, Text } from '@radix-ui/themes';
import { FieldState, useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { z } from 'zod';
import { useDonation } from './DonationProvider';
import { PageProps } from './types';

import styles from './Donate.module.css';

const size = { initial: '2', md: '3' } as const;

const getError = (state: FieldState<string>) => {
  if (state.meta.isPristine || !state.meta.errors.length) return null;
  return state.meta.errors.find((e) => e !== 'mount');
};

const Details: React.FC<PageProps> = ({ formRef }) => {
  const { pageIndex, details, setValid, submitDetails } = useDonation();

  const submitted = useRef<(() => void) | null>(null);
  const invalid = useRef<(() => void) | null>(null);

  const form = useForm({
    defaultValues: details,
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      await submitDetails(value);
      submitted.current?.();
    },
    onSubmitInvalid: () => {
      invalid.current?.();
    },
  });

  form.useStore((state) => {
    if (state.isTouched) {
      state.errorMap.onMount = undefined;
    }
  });

  const canSubmit = form.useStore(({ canSubmit, isTouched }) => canSubmit && isTouched);

  useEffect(() => {
    setValid(canSubmit);
  }, [canSubmit]);

  useImperativeHandle(formRef, () => ({
    submit: () => {
      const promise = new Promise<void>((resolve, reject) => {
        submitted.current = resolve;
        invalid.current = reject;
      });
      form.handleSubmit();
      return promise;
    },
  }));

  return (
    <Flex className={styles.page} direction="column" gap="4">
      <form.Field
        name="name"
        validators={{
          onMount: z.string().min(1, 'mount'),
          onBlur: z.string().min(1, 'Please enter your name'),
        }}
      >
        {(field) => (
          <FormField.Root label="Your name" size={size} error={getError(field.state)}>
            <FormField.TextField
              autoComplete="name"
              autoFocus
              value={field.state.value}
              onBlur={field.handleBlur}
              onValueChange={(v) => {
                field.state.meta.errorMap.onMount = undefined;
                field.handleChange(v);
              }}
            />
          </FormField.Root>
        )}
      </form.Field>
      <form.Field
        name="email"
        validators={{
          onMount: z.string().email('mount'),
          onBlur: z.string().email('Please enter a valid email address'),
        }}
      >
        {(field) => (
          <FormField.Root label="Your email address" size={size} error={getError(field.state)}>
            <FormField.TextField
              type="email"
              autoComplete="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onValueChange={(v) => {
                field.state.meta.errorMap.onMount = undefined;
                field.handleChange(v);
              }}
            />
          </FormField.Root>
        )}
      </form.Field>
      <form.Field name="message">
        {(field) => (
          <FormField.Root label="Your message (optional)" size={size}>
            <FormField.TextArea value={field.state.value} onValueChange={field.handleChange} />
          </FormField.Root>
        )}
      </form.Field>
      <form.Field name="anonymous">
        {(field) => (
          <label className={styles.labeledCheckbox}>
            <Checkbox
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(!!checked)}
            />
            <Text as="div" size={size}>
              I’d like to remain anonymous
            </Text>
            <Box asChild gridColumn="2">
              <Text size="2" color="gray">
                We won’t publish your name in our donor list
              </Text>
            </Box>
          </label>
        )}
      </form.Field>
      <form.Field name="newsletter">
        {(field) => (
          <label className={styles.labeledCheckbox}>
            <Checkbox
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(!!checked)}
            />
            <Text as="div" size={size}>
              Sign me up for the NZIF email newsletter
            </Text>
          </label>
        )}
      </form.Field>
    </Flex>
  );
};

Details.displayName = 'Details';

export default Details;
