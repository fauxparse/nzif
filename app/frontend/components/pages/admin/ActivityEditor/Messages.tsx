import { Markdown } from '@/components/helpers/Markdown';
import { useToast } from '@/components/molecules/Toast';
import { ResultOf } from '@/graphql';
import SendIcon from '@/icons/SendIcon';
import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  DataList,
  Flex,
  Heading,
  Inset,
  Section,
  Separator,
  Spinner,
  Text,
} from '@radix-ui/themes';
import { orderBy } from 'lodash-es';
import { useMemo, useState } from 'react';
import { ActivityMessagesQuery, ResendMessageMutation } from './queries';

import classes from './ActivityEditor.module.css';

type Activity = NonNullable<ResultOf<typeof ActivityMessagesQuery>['festival']['activity']>;

type Session = Activity['sessions'][number];

type Message = Session['messages'][number];

export type MessagesProps = {
  activity: Activity;
};

export const Messages: React.FC<MessagesProps> = ({ activity }) => {
  const { notify } = useToast();

  const [resendingId, setResendingId] = useState<string | null>(null);

  const [resendMessage] = useMutation(ResendMessageMutation);

  const messages = useMemo(
    () =>
      orderBy(
        activity.sessions.flatMap((session) =>
          session.messages.map((message) => ({ session, message }))
        ),
        ({ message }) => message.createdAt,
        'desc'
      ),
    [activity]
  );

  const resend = (message: Message) => {
    if (resendingId !== null) return;

    setResendingId(message.id);
    resendMessage({ variables: { id: message.id } })
      .then(() => notify({ description: 'Message re-sent' }))
      .catch((error: Error) => notify({ description: error.message }))
      .finally(() => setResendingId(null));
  };

  return (
    <div className={classes.messages}>
      <Section>
        <Heading as="h3">Messages</Heading>
        <Text as="p" color="gray">
          Messages for this workshop's sessions, newest first. Re-sending sends the message to all
          current participants of its session, including those who already received it.
        </Text>
      </Section>
      {messages.length === 0 ? (
        <Text as="p" color="gray">
          No messages yet
        </Text>
      ) : (
        messages.map(({ session, message }) => (
          <Card key={message.id}>
            <DataList.Root>
              <DataList.Item>
                <DataList.Label>Session</DataList.Label>
                <DataList.Value>
                  {session.startsAt.toLocaleString({
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                  })}
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>From</DataList.Label>
                <DataList.Value>{message.sender.profile?.name}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Sent</DataList.Label>
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
            <Flex justify="end" mt="4">
              <Button
                variant="soft"
                disabled={resendingId !== null}
                onClick={() => resend(message)}
              >
                {resendingId === message.id ? (
                  <>
                    <Spinner />
                    Re-sending…
                  </>
                ) : (
                  <>
                    <SendIcon />
                    Re-send
                  </>
                )}
              </Button>
            </Flex>
          </Card>
        ))
      )}
    </div>
  );
};
