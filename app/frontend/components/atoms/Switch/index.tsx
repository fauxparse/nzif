import React, { ComponentPropsWithoutRef, forwardRef, useEffect, useRef, useState } from 'react';
import './Switch.css';
import { mergeRefs } from 'react-merge-refs';
import { clamp } from 'lodash-es';
import clsx from 'clsx';

type SwitchProps = ComponentPropsWithoutRef<'input'>;

type Bounds = {
  lower: number;
  middle: number;
  upper: number;
};

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onClick, ...props }, ref) => {
    const ownRef = useRef<HTMLInputElement>(null);

    const pointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
      const el = ownRef.current;
      if (!el || e.currentTarget.disabled) return;

      const thumbSize = getPseudoStyle(el, 'width');
      const padding = getStyle(el, 'padding-left') + getStyle(el, 'padding-right');
      const width = el.clientWidth;

      el.style.setProperty('--thumb-transition-duration', '0s');

      const bounds = {
        lower: 0,
        middle: (width - padding) / 4,
        upper: width - thumbSize - padding,
      };

      const drag = (e: PointerEvent) => {
        const directionality = getStyle(el, '--isLTR');
        const track = directionality === -1 ? el.clientWidth * -1 + thumbSize + padding : 0;
        const pos = clamp(Math.round(e.offsetX - thumbSize / 2), bounds.lower, bounds.upper);

        el.style.setProperty('--thumb-position', `${track + pos}px`);
      };

      const dragEnd = () => {
        el.checked = determineChecked(el, bounds);

        if (el.indeterminate) {
          el.indeterminate = false;
        }

        el.style.removeProperty('--thumb-transition-duration');
        el.style.removeProperty('--thumb-position');
        el.removeEventListener('pointermove', drag);
        window.removeEventListener('pointerup', dragEnd);
      };

      el.addEventListener('pointermove', drag);
      window.addEventListener('pointerup', dragEnd);
    };

    const click = (e: React.MouseEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();

      onClick?.(e);
    };

    return (
      <input
        ref={mergeRefs([ref, ownRef])}
        className={clsx('switch', className)}
        type="checkbox"
        // biome-ignore lint/a11y/useAriaPropsForRole:
        role="switch"
        onPointerDown={pointerDown}
        onClick={click}
        {...props}
      />
    );
  }
);

const getStyle = (element: HTMLElement, prop: string) => {
  return parseInt(window.getComputedStyle(element).getPropertyValue(prop));
};

const getPseudoStyle = (element: HTMLElement, prop: string) => {
  return parseInt(window.getComputedStyle(element, ':before').getPropertyValue(prop));
};

const determineChecked = (element: HTMLInputElement, bounds: Bounds) => {
  let curpos = Math.abs(Number.parseInt(element.style.getPropertyValue('--thumb-position')));

  if (!curpos) {
    curpos = element.checked ? bounds.lower : bounds.upper;
  }

  return curpos >= bounds.middle;
};

export default Switch;
