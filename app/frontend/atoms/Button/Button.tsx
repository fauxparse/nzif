import React, { Children, ElementType, forwardRef } from 'react';
import clsx from 'clsx';

import { PolymorphicRef } from '../../types/polymorphic.types';
import { extractVariants } from '../../types/variants';
import Icon, { isIconName } from '../Icon';

import { AllButtonVariants, BUTTON_VARIANTS, ButtonComponent, ButtonProps } from './Button.types';

import './Button.css';

const useCustomButton = <T extends AllButtonVariants>(props: T): T =>
  extractVariants(BUTTON_VARIANTS, props);

export const Button: ButtonComponent = forwardRef(
  <C extends ElementType = 'button'>(
    { className, text, icon, as, stretch, children, ...props }: ButtonProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = (as ?? 'button') as ElementType;

    const { size, variant, ...buttonProps } = useCustomButton(props);

    const extraButtonProps = Component === 'button' ? { type: 'button' } : { role: 'button' };

    // Auto-wrap plain text children
    const buttonChildren = Children.map(children, (child) =>
      typeof child === 'string' ? <span className="button__text">{child}</span> : child
    );

    return (
      <Component
        ref={ref}
        className={clsx('button', className)}
        data-size={size}
        data-variant={variant}
        data-stretch={stretch || undefined}
        {...extraButtonProps}
        {...buttonProps}
      >
        {isIconName(icon) ? <Icon name={icon} /> : icon}
        {!!text && <span className="button__text">{text}</span>}
        {buttonChildren}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;
