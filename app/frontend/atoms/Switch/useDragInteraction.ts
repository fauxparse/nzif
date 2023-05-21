import { RefObject, useEffect } from 'react';
import { TinyColor } from '@ctrl/tinycolor';

const getStyle = (element: HTMLElement, prop: string, defaultValue = 0): number => {
  const result = parseInt(window.getComputedStyle(element).getPropertyValue(prop));
  return isNaN(result) ? defaultValue : result;
};

const getColor = (element: HTMLElement, prop = 'color'): TinyColor =>
  new TinyColor(window.getComputedStyle(element).getPropertyValue(prop));

export default (ref: RefObject<HTMLInputElement>) =>
  useEffect(() => {
    /* c8 ignore next: type safety */
    if (!ref.current) /* c8 ignore next */ return;

    const { current: input } = ref;

    let dragging = false;
    let position: number | undefined = undefined;

    const clicked = (event: MouseEvent) => {
      if (dragging) event.preventDefault();
      event.preventDefault();
    };

    const pointerDown = (_event: PointerEvent) => {
      if (input.disabled) return;

      input.style.setProperty('--thumb-transition-duration', '0s');

      const inactiveColor = getColor(input, '--switch-track-inactive');
      const activeColor = getColor(input, '--switch-track-active');

      const padding = getStyle(input, 'padding-left', 2) + getStyle(input, 'padding-right', 2);
      const thumbSize = input.clientHeight - padding;
      const bounds = {
        lower: 0,
        middle: (input.clientWidth - thumbSize - padding) / 2,
        upper: input.clientWidth - thumbSize - padding,
      };

      const pointerDrag = (event: PointerEvent) => {
        dragging = true;
        const directionality = getStyle(input, '--ltr');
        const track = directionality === -1 ? input.clientWidth * -1 + thumbSize + padding : 0;

        let pos = Math.round(event.offsetX - thumbSize / 2);

        if (pos < bounds.lower) {
          pos = 0;
        }

        if (pos > bounds.upper) {
          pos = bounds.upper;
        }

        const mix = Math.abs(track + pos) / (bounds.upper - bounds.lower);
        const trackColor = inactiveColor.mix(activeColor, mix * 100);
        position = track + pos;

        input.style.setProperty('--thumb-position', `${track + pos}px`);
        input.style.setProperty('--track-color', trackColor.toHslString());
      };

      const pointerUp = () => {
        const pos =
          position === undefined
            ? input.checked
              ? bounds.lower
              : bounds.upper
            : Math.abs(position);

        if (input.indeterminate) input.indeterminate = false;
        input.checked = pos >= bounds.middle;

        input.style.removeProperty('--thumb-transition-duration');
        input.style.removeProperty('--thumb-position');
        input.style.removeProperty('--track-color');
        input.removeEventListener('pointermove', pointerDrag);
        window.removeEventListener('pointerup', pointerUp);

        setTimeout(() => {
          dragging = false;
        }, 300);
      };

      dragging = true;
      position = undefined;
      input.addEventListener('click', clicked);

      input.addEventListener('pointermove', pointerDrag);
      window.addEventListener('pointerup', pointerUp, { once: true });
    };

    input.addEventListener('pointerdown', pointerDown);

    return () => {
      input.removeEventListener('pointerdown', pointerDown);
      input.removeEventListener('click', clicked);
    };
  }, [ref]);
