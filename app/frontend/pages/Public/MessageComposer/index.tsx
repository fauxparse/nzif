import { useRef } from 'react';

import Button from '@/atoms/Button';
import Input from '@/atoms/Input';
import {
  ActivityType,
  Scalars,
  SentMessageFragmentDoc,
  useSendMessageMutation,
} from '@/graphql/types';
import Dialog, { DialogProps } from '@/organisms/Dialog';

import './MessageComposer.css';

export type Session = {
  id: Scalars['ID'];
  activity: {
    type: ActivityType;
    name: string;
  };
};

type MessageComposerProps = Omit<DialogProps, 'onOpenChange'> & {
  session: Session;
  onClose: () => void;
};

const MessageComposer: React.FC<MessageComposerProps> = ({ session, open, onClose, ...props }) => {
  const openChange = (open: boolean) => {
    if (!open) onClose();
  };

  const textarea = useRef<HTMLTextAreaElement>(null);

  const [sendMessage, { loading: sending }] = useSendMessageMutation();

  const send = () => {
    const content = textarea.current?.value;
    if (!content) return;

    const subject = `Message about ${session.activity.name}`;

    sendMessage({
      variables: {
        subject,
        content,
        sessionId: session.id,
      },
      update: (cache, { data }) => {
        const message = data?.sendMessage?.message;

        if (!message) return;

        const ref = cache.writeFragment({
          id: cache.identify(message),
          fragment: SentMessageFragmentDoc,
          data: message,
        });

        cache.modify({
          id: cache.identify(session),
          fields: {
            messages(existing = []) {
              return [...existing, ref];
            },
          },
        });
      },
    }).then(() => onClose());
  };

  return (
    <Dialog className="message-composer" open={open} onOpenChange={openChange} {...props}>
      <Dialog.Header>
        <Dialog.Title>New message</Dialog.Title>
        <Dialog.Close />
      </Dialog.Header>
      <Dialog.Body>
        <Input
          as="textarea"
          ref={textarea}
          placeholder="Type your message here"
          disabled={sending}
        />
      </Dialog.Body>
      <Dialog.Footer>
        <Button primary icon="email" text="Send" disabled={sending} onClick={send} />
      </Dialog.Footer>
    </Dialog>
  );
};

export default MessageComposer;
