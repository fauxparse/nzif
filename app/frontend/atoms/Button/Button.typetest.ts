/* eslint-disable @typescript-eslint/no-unused-vars */
/* c8 ignore file */

import { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';

/**
 * Describe: ButtonProps
 */

// @ts-expect-no-error - No required props
const testEmptyProps: ButtonProps = {};

// @ts-expect-error - `href` is not a valid prop
const testInvalidProperty: ButtonProps<'button'> = { href: 'https://example.com' };

// @ts-expect-no-error - `href` is a valid prop
const testValidProperty: ButtonProps<'a'> = { href: 'https://example.com' };

// @ts-expect-no-error - Can specify size as a named prop
const testNamedSize: ButtonProps = { size: ButtonSize.SMALL };

// @ts-expect-no-error - Can specify size as a shorthand prop
const testShorthandSize: ButtonProps = { [ButtonSize.SMALL]: true };

// @ts-expect-error - Can't specify two sizes
const testDoubleSize: ButtonProps = { size: ButtonSize.SMALL, [ButtonSize.SMALL]: true };

// @ts-expect-no-error - Can specify size as a named prop
const testNamedVariant: ButtonProps = { variant: ButtonVariant.PRIMARY };

// @ts-expect-no-error - Can specify variant as a shorthand prop
const testShorthandVariant: ButtonProps = { [ButtonVariant.PRIMARY]: true };

// @ts-expect-error - Can't specify two variants
const testDoubleVariant: ButtonProps = {
  variant: ButtonVariant.PRIMARY,
  [ButtonVariant.PRIMARY]: true,
};
