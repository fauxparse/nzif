import * as React from 'react';
import { Alignment, FloatingContext, Side } from '@floating-ui/react';

export interface Props extends React.SVGAttributes<SVGSVGElement> {
  context: FloatingContext;
  width?: number;
  stroke?: string;
}

export const FloatingArrow = React.forwardRef(function FloatingArrow(
  {
    context: {
      placement,
      middlewareData: { arrow },
    },
    width = 48,
    stroke,
    style = {},
    ...rest
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

  return (
    <svg
      {...rest}
      aria-hidden
      ref={ref}
      width={width}
      height={width}
      viewBox={`0 0 48 48`}
      style={{
        ...style,
        position: 'absolute',
        pointerEvents: 'none',
        [xOffsetProp]: arrowX,
        [yOffsetProp]: arrowY,
        [side]: `calc(100% - ${width / 2 - 1}px)`,
        transform: `${rotation}${style?.transform ? ` ${style.transform}` : ''}`,
      }}
    >
      <path
        d="M24.5 48v-5.375a3.998 3.998 0 0 0-1.172-2.829l-12.96-12.96a4.001 4.001 0 0 1 .01-5.667c4.358-4.32 8.735-8.638 12.982-12.975a3.998 3.998 0 0 0 1.14-2.796V0h2v48h-7.5Z"
        fill="var(--popover-background)"
      />
      <path
        d="M24.5 0v5.398a3.998 3.998 0 0 1-1.14 2.796c-4.247 4.337-8.624 8.655-12.982 12.975a3.998 3.998 0 0 0-.01 5.667l12.96 12.96a3.998 3.998 0 0 1 1.172 2.829V48"
        fill="none"
        stroke="var(--popover-border)"
        strokeWidth="1"
      />
    </svg>
  );
});
