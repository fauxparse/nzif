import { StoryDefault } from '@ladle/react';
import { Button } from '@radix-ui/themes';
import { useState } from 'react';
import { WaitlistExplainer as Explainer } from '.';

export const WaitlistExplainer = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Explainer open={open} onOpenChange={setOpen} />
      <Button onClick={() => setOpen(true)}>Open</Button>
    </>
  );
};

export default {
  title: 'Organisms/Explainer',
} satisfies StoryDefault;
