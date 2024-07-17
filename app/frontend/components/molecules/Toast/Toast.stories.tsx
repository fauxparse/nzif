import { StoryDefault } from '@ladle/react';
import { Button } from '@radix-ui/themes';
import { useToast } from './Provider';

export const Notifications = () => {
  const { notify } = useToast();

  return (
    <Button size="3" onClick={() => notify({ title: 'Toast message', description: 'Lorem ipsum' })}>
      Notify
    </Button>
  );
};

export default {
  title: 'Molecules/Toast',
} satisfies StoryDefault;
