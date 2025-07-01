import { Reference, useMutation } from '@apollo/client';
import { Button, Dialog, Flex, VisuallyHidden } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { useEffect, useState } from 'react';
import { FormField } from '@/components/molecules/FormField';
import { useToast } from '@/components/molecules/Toast';
import { Feedback } from '@/graphql/types';
import { useCalendar } from './Context';
import { SubmitWorkshopFeedbackMutation } from './queries';
import { CalendarSession } from './types';

type WorkshopFeeedbackProps = {
  session: CalendarSession | null;
};

type FormData = Pick<Feedback, 'positive' | 'constructive' | 'testimonial'>;

export const WorkshopFeedback: React.FC<WorkshopFeeedbackProps> = ({ session: passed }) => {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(passed);

  const { setSelectedId } = useCalendar();

  const { notify } = useToast();

  const [save] = useMutation(SubmitWorkshopFeedbackMutation, {
    update: (cache, { data }) => {
      const feedback = data?.saveFeedback?.feedback;
      if (!feedback || !session) return;

      const ref: Reference = { __ref: cache.identify(feedback) as string };
      cache.modify({
        id: cache.identify(session),
        fields: {
          feedback: () => ref,
        },
      });
    },
  });

  const form = useForm({
    defaultValues: {
      positive: '',
      constructive: '',
      testimonial: '',
    } satisfies FormData,
    onSubmit: async ({ value }) => {
      if (!session) return;

      await save({
        variables: {
          sessionId: session.id,
          attributes: value,
        },
      });

      setSelectedId(null);

      notify({
        description: 'Thanks for your feedback!',
      });
    },
  });

  const isSubmitting = form.useStore((state) => state.isSubmitting);

  useEffect(() => {
    if (passed) {
      setSession(passed);
      setOpen(true);
      form.reset();
    } else {
      setOpen(false);
    }
  }, [passed]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedId(null);
        }
        setOpen(open);
      }}
    >
      {session && (
        <Dialog.Content>
          <Dialog.Title>{`Workshop feedback: ${session.session.activity.name}`}</Dialog.Title>
          <VisuallyHidden>
            <Dialog.Description>Leave feedback on your workshop experience</Dialog.Description>
          </VisuallyHidden>
          <Flex asChild direction="column" gap="4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <fieldset style={{ display: 'contents' }} disabled={isSubmitting || undefined}>
                <form.Field name="positive">
                  {(field) => (
                    <FormField.Root>
                      <FormField.Label>
                        What did you like about this workshop? What did the tutor(s) do well?
                      </FormField.Label>
                      <FormField.TextArea
                        autoFocus
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      />
                    </FormField.Root>
                  )}
                </form.Field>
                <form.Field name="constructive">
                  {(field) => (
                    <FormField.Root>
                      <FormField.Label>
                        What could have gone better? What could the tutor improve for next time?
                      </FormField.Label>
                      <FormField.TextArea
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      />
                    </FormField.Root>
                  )}
                </form.Field>
                <form.Field name="testimonial">
                  {(field) => (
                    <FormField.Root>
                      <FormField.Label>
                        Would you like to leave a testimonial for the tutor(s) to use in future
                        marketing?
                      </FormField.Label>
                      <FormField.TextArea
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      />
                      <FormField.Description>
                        This will be attributed anonymously to “NZIF 2025 participant”, unless you
                        include your name.
                      </FormField.Description>
                    </FormField.Root>
                  )}
                </form.Field>
              </fieldset>
              <Flex>
                <Button type="submit" size="3">
                  Submit feedback
                </Button>
              </Flex>
            </form>
          </Flex>
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
};
