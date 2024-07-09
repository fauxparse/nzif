import { size } from '@ladle/helpers/size';
import type { Story, StoryDefault } from '@ladle/react';
import { Button, Modal, ModalProps } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

type ModalStoryProps = ModalProps;

const ModalStory: Story<ModalStoryProps> = ({ opened: _opened, onClose, ...props }) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button onClick={open}>Open modal</Button>
      <Modal opened={opened} onClose={close} {...props}>
        Hello
      </Modal>
    </>
  );
};

export { ModalStory as Modal };

export default {
  title: 'Organisms',
  args: {
    centered: false,
    fullScreen: false,
    title: 'Modal title',
    withCloseButton: true,
  } as ModalStoryProps,
  argTypes: {
    size: {
      ...size,
      options: [...size.options, 'auto'],
    },
    withCloseButton: {
      control: {
        type: 'boolean',
      },
    },
  },
} satisfies StoryDefault;
