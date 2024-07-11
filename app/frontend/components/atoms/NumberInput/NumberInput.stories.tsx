import type { StoryDefault } from '@ladle/react';
import { useState } from 'react';
import { NumberInput } from '.';

const NumberInputStory = () => {
  const [value, setValue] = useState<number | null>(50);

  return (
    <div style={{ width: '8rem' }}>
      <NumberInput min={0} max={100} value={value} onValueChange={setValue} />
    </div>
  );
};

export { NumberInputStory as NumberInput };

export default {
  title: 'Atoms',
  args: {},
  argTypes: {},
} satisfies StoryDefault;
