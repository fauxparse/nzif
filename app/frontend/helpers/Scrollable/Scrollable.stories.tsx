import type { Meta, StoryObj } from '@storybook/react';

import { Scrollable } from './Scrollable';
import { Orientation, ScrollableProps } from './Scrollable.types';

type Story = StoryObj<typeof Scrollable>;

export default {
  title: 'Helpers/Scrollable',
  component: Scrollable,
  argTypes: {
    orientation: {
      description: 'Scrolling direction',
      table: {
        defaultValue: {
          summary: 'Orientation.HORIZONTAL',
        },
      },
      control: 'radio',
      options: Object.values(Orientation),
    },
  },
  args: {
    orientation: Orientation.VERTICAL,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Scrollable>;

export const Default: Story = {
  args: {
    orientation: Orientation.VERTICAL,
  },
  render: (args: ScrollableProps) => (
    <Scrollable
      {...args}
      style={{
        height: '20rem',
        width: '100vw',
        maxWidth: '40rem',
      }}
    >
      <div>
        <p>
          Oh…yeah…the guy in the…the $4,000 suit is holding the elevator for a guy who doesn’t make
          that in three months. Come on! Absolutely. And we’re going to be here every day. I don’t
          care if it takes from now till the end of Shrimpfest. George Bush doesn’t care about black
          puppets.
        </p>
        <p>
          George Michael may be suffering from what we in the soft-sciences call Obsessive
          Compulsive Disorder, or the “OC Disorder”. I’ve been in the film business for a while but
          I just can’t seem to get one in the can. No, Pop-pop does not get a treat. I just bought
          you a f**king pizza. Mister gay is bleeding! Mister gay! Yeah, I invited her. You said you
          wanted to spend time some with her. You said I was being an Ann hog. We’ll have to find
          something to do so that people can look at you without wanting to kill themselves. Oh
          please. They didn’t sneak into this country to be your friends. Douche chill!
        </p>
        <p>
          I guess you can say I’m buy-curious. He’s going to be all right. Dad asked me to do this
          on the day he pleads not guilty, as a spectacular protest. A…. ?
        </p>
        <p>
          I want to cry so bad, but I don’t think I can spare the moisture. How could I say no to
          the woman who gave me chlamydia? You need to do more with Rita. Believe me, I’d like to.
          Mister gay is bleeding! Mister gay! Stop licking my hand, you horse’s ass. Are you sure
          this isn’t her sister? Mrs Veal: What a lovely thing to say. Michael: That’s an awful
          thing to say. Don’t leave your Uncle T-bag hanging. Absolutely. And we’re going to be here
          every day. I don’t care if it takes from now till the end of Shrimpfest.
        </p>
        <p>
          Oh by the way, Doctor said no kissing her on the face for one week. I was like make it two
          weeks, see if I care! They frame my junk. Whenever she’d change clothes, she’d make me
          wait on the balcony until zip-up, and yet anything goes at bath time. She’s always got to
          wedge herself in the middle of us so that she can control everything. Yeah. Mom’s awesome.
        </p>
      </div>
    </Scrollable>
  ),
};

export const Horizontal: Story = {
  args: {
    orientation: Orientation.HORIZONTAL,
  },
  render: () => (
    <Scrollable horizontal style={{ minHeight: '10rem', minWidth: '20rem' }}>
      <div
        style={{
          width: '200vw',
          height: '10rem',
          background: 'linear-gradient(to right, red, blue)',
        }}
      />
    </Scrollable>
  ),
};
