import { describe, expect, it } from 'vitest';

import { PropsWithVariants, extractVariants } from './variants';

describe('extractVariants', () => {
  enum Size {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
  }

  enum Color {
    RED = 'red',
    GREEN = 'green',
    BLUE = 'blue',
  }

  const config = {
    size: {
      values: Size,
      defaultValue: Size.MEDIUM,
    },
    color: {
      values: Color,
      defaultValue: Color.GREEN,
    },
  };

  it('uses the default props', () => {
    expect(extractVariants(config, {})).toMatchObject({ size: 'medium', color: 'green' });
  });

  it('allows custom props', () => {
    expect(extractVariants(config, { size: Size.SMALL })).toMatchObject({
      size: 'small',
      color: 'green',
    });
  });

  type Props = PropsWithVariants<typeof config> & { shape?: string };

  it('passes other props through', () => {
    const props: Props = { shape: 'triangle' } as const;
    expect(extractVariants(config, props)).toMatchObject({
      shape: 'triangle',
    });
  });

  it('accepts shorthand props', () => {
    expect(extractVariants(config, { small: true })).toMatchObject({ size: 'small' });
  });
});
