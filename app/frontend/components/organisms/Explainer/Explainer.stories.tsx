import { StoryDefault } from '@ladle/react';
import { Button, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { Explainer } from '.';

import Image1 from './1.svg';
import Image2 from './2.svg';
import Image3 from './3.svg';

const PAGES = [
  {
    id: '1',
    content: <Text>First page</Text>,
    image: Image1,
  },
  {
    id: '2',
    content: <Text>Second page</Text>,
    image: Image2,
  },
  {
    id: '3',
    content: <Text>Third page</Text>,
    image: Image3,
  },
] as const;

export const Normal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Explainer
        title="Explainer"
        description="Demo"
        pages={PAGES}
        open={open}
        onOpenChange={setOpen}
      />
      <Button onClick={() => setOpen(true)}>Open</Button>
    </>
  );
};

export const Dismissible = () => {
  const [open, setOpen] = useState(false);

  const openChanged = (open: boolean, dontShowAgain: boolean) => {
    setOpen(open);
    if (dontShowAgain) {
      console.info('Don’t show again');
    }
  };

  return (
    <>
      <Explainer
        title="Explainer"
        description="Demo"
        pages={PAGES}
        dismissible
        dontShowAgain={false}
        open={open}
        onOpenChange={openChanged}
      />
      <Button onClick={() => setOpen(true)}>Open</Button>
    </>
  );
};

export default {
  title: 'Organisms/Explainer',
} satisfies StoryDefault;
