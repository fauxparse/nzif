import { StoryDefault } from '@ladle/react';
import { DataMeter } from './';

const DataMeterStory = () => <DataMeter title="Demo" value={65} />;

export { DataMeterStory as DataMeter };

export default {
  title: 'Molecules',
  args: {},
  argTypes: {},
} satisfies StoryDefault;
