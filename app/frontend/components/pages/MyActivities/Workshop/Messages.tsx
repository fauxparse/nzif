import { Markdown } from '@/components/helpers/Markdown';
import { FormField } from '@/components/molecules/FormField';
import { Editor } from '@/components/organisms/Editor';
import SendIcon from '@/icons/SendIcon';
import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  DataList,
  Flex,
  Heading,
  Inset,
  Separator,
  Spinner,
  Text,
} from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { sortBy } from 'lodash-es';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useWorkshopSession } from './WorkshopProvider';
import { MessageFragment, SendMessageMutation } from './queries';

import classes from './Workshop.module.css';

type Message = {
  subject: string;
  content: string;
};

export const Messages: React.FC = () => {
  const { session } = useWorkshopSession();
  const messages = useMemo(() => sortBy(session.messages, 'createdAt'), [session]);

  const [sending, setSending] = useState(false);

  const [sendMessage] = useMutation(SendMessageMutation, {
    update(cache, { data }) {
      cache.modify({
        id: cache.identify(session),
        fields: {
          messages: (existingMessages) => {
            if (!data?.sendMessage?.message) return existingMessages;

            const newMessageRef = cache.writeFragment({
              data: data.sendMessage.message,
              fragment: MessageFragment,
            });
            return [...existingMessages, newMessageRef];
          },
        },
      });
    },
  });

  const form = useForm({
    defaultValues: {
      subject: '',
      content: '',
    } as Message,
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      setSending(true);
      sendMessage({
        variables: { ...value, sessionId: session.id },
      })
        .then(() => {
          form.reset();
        })
        .finally(() => {
          setSending(false);
        });
    },
  });

  return (
    <div className={classes.messages}>
      <Card size="3" className={classes.messageForm}>
        <Heading as="h2">Send a message</Heading>
        <Text>
          Send a message to your workshop participants. When someone new joins your workshop,
          they’ll automatically receive any messages that have been sent so far.
        </Text>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <fieldset disabled={sending || undefined}>
            <form.Field
              name="subject"
              validators={{
                onSubmit: z.string().min(1, 'Please add a subject'),
              }}
            >
              {(field) => (
                <FormField.Root label="Subject" error={field.state.meta.errors[0]}>
                  <FormField.TextField
                    autoFocus
                    size="3"
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  />
                </FormField.Root>
              )}
            </form.Field>
            <form.Field
              name="content"
              validators={{
                onSubmit: z.string().min(1, 'You can’t send an empty message'),
              }}
            >
              {(field) => (
                <>
                  <Editor value={field.state.value} onChange={field.handleChange} />
                  {field.state.meta.errors[0] && (
                    <FormField.Error>{field.state.meta.errors[0]}</FormField.Error>
                  )}
                </>
              )}
            </form.Field>

            <Flex>
              <Button type="submit" size="3">
                {sending ? (
                  <>
                    <Spinner />
                    Sending…
                  </>
                ) : (
                  <>
                    <SendIcon />
                    Send message
                  </>
                )}
              </Button>
            </Flex>
          </fieldset>
        </form>
      </Card>
      {messages.length > 0 &&
        messages.map((message) => (
          <Card key={message.id} className={classes.message}>
            <DataList.Root>
              <DataList.Item>
                <DataList.Label>From</DataList.Label>
                <DataList.Value>{message.sender.profile?.name}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Date</DataList.Label>
                <DataList.Value>{message.createdAt.toLocaleString()}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Subject</DataList.Label>
                <DataList.Value>{message.subject}</DataList.Value>
              </DataList.Item>
            </DataList.Root>
            <Inset side="x">
              <Separator size="4" my="4" />
            </Inset>
            <Markdown>{message.content || ''}</Markdown>
          </Card>
        ))}
    </div>
  );
};
