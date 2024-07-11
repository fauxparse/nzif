import type { StoryDefault } from '@ladle/react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { TimeInput } from '.';

const TimeInputStory = () => {
  const [value, setValue] = useState<DateTime | null>(() => DateTime.now());

  return (
    <div style={{ width: '12rem' }}>
      <TimeInput value={value} onValueChange={setValue} />
    </div>
  );
};

export { TimeInputStory as TimeInput };

export default {
  title: 'Atoms',
  args: {},
  argTypes: {},
} satisfies StoryDefault;
