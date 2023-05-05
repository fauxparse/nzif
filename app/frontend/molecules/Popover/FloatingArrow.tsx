import * as React from 'react';
import { Alignment, FloatingContext, Side } from '@floating-ui/react';
import clsx from 'clsx';

export interface Props extends React.SVGAttributes<SVGSVGElement> {
  context: FloatingContext;
  width?: number;
  stroke?: string;
}

export const FloatingArrow = React.forwardRef(function FloatingArrow(
  {
    className,
    context: {
      placement,
      middlewareData: { arrow },
    },
    width = 20,
    height = 24,
    stroke,
    style = {},
    ...props
  }: Props,
  ref: React.Ref<SVGSVGElement>
): JSX.Element {
  const [side] = placement.split('-') as [Side, Alignment];

  const yOffsetProp = 'top';
  const xOffsetProp = 'left';

  const arrowX = arrow?.x != null ? arrow.x : '';
  const arrowY = arrow?.y != null ? arrow.y : '';

  const rotation = {
    top: 'rotate(-90deg)',
    left: 'rotate(180deg)',
    bottom: 'rotate(90deg)',
    right: 'rotate(0deg)',
  }[side];

  const sideOffset = side === 'top' || side === 'bottom' ? 9 : 7;

  return (
    <svg
      className={clsx('popover__arrow', className)}
      {...props}
      aria-hidden
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 20 24`}
      style={{
        ...style,
        position: 'absolute',
        pointerEvents: 'none',
        [xOffsetProp]: arrowX,
        [yOffsetProp]: arrowY,
        [side]: `calc(100% - ${sideOffset}px)`,
        transform: `${rotation}${style?.transform ? ` ${style.transform}` : ''}`,
      }}
    >
      <path
        d="M13,28l0,-5.858c0,-1.061 -0.421,-2.078 -1.172,-2.828c-1.541,-1.541 -4.246,-4.247 -5.899,-5.9c-0.781,-0.781 -0.781,-2.047 -0,-2.828c1.653,-1.653 4.358,-4.359 5.899,-5.9c0.751,-0.75 1.172,-1.767 1.172,-2.828c0,-2.213 0,-5.858 0,-5.858"
        fill="var(--popover-background)"
      />
      <path
        d="M12.5,28l0,-5.858c0,-1.061 -0.421,-2.078 -1.172,-2.828c-1.541,-1.541 -4.246,-4.247 -5.899,-5.9c-0.781,-0.781 -0.781,-2.047 -0,-2.828c1.653,-1.653 4.358,-4.359 5.899,-5.9c0.751,-0.75 1.172,-1.767 1.172,-2.828c0,-2.213 0,-5.858 0,-5.858"
        fill="none"
        stroke="var(--popover-border)"
        strokeWidth="1"
      />
    </svg>
  );
});
