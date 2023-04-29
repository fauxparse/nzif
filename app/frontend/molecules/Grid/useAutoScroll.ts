import { useEffect } from 'react';

import scrollParent from '@/util/scrollParent';

type UseAutoScrollOptions = {
  container: HTMLElement;
  verticalContainer?: HTMLElement;
  enabled?: boolean;
  edgeSize?: number;
  offsetX?: () => number;
  speed?: number;
};

const scrollVelocity = (
  position: number,
  max: number,
  edgeSize: number,
  offset: number
): number => {
  if (position < edgeSize + offset) {
    return (position - edgeSize - offset) / edgeSize;
  }

  if (position > max - edgeSize) {
    return (position - max + edgeSize) / edgeSize;
  }

  return 0;
};

const useAutoScroll = ({
  container: horizontalContainer,
  verticalContainer = horizontalContainer,
  enabled = true,
  edgeSize = 100,
  offsetX = () => 0,
  speed = 32,
}: UseAutoScrollOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const horizontalScrollParent = scrollParent(horizontalContainer);
    const verticalScrollParent = scrollParent(verticalContainer);

    const { clientWidth, scrollWidth } = horizontalScrollParent;
    const { clientHeight, scrollHeight } = verticalScrollParent;
    const maxX = Math.max(0, scrollWidth - clientWidth);
    const maxY = Math.max(0, scrollHeight - clientHeight);
    let timer: ReturnType<typeof requestAnimationFrame>;

    const horizontalOffset = offsetX();

    const pointerMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;

      const vx = scrollVelocity(clientX, clientWidth, edgeSize, horizontalOffset);
      const vy = scrollVelocity(clientY, clientHeight, edgeSize, 0);

      if (!vx && !vy) {
        cancelAnimationFrame(timer);
        return;
      }

      const checkScroll = () => {
        cancelAnimationFrame(timer);

        const x = horizontalScrollParent.scrollLeft;
        const x2 = Math.max(0, Math.min(maxX, x + vx * speed));
        const y = verticalScrollParent.scrollTop;
        const y2 = Math.max(0, Math.min(maxY, y + vy * speed));

        if (x !== x2 || y !== y2) {
          verticalScrollParent.scrollTop = y2;
          horizontalScrollParent.scrollLeft = x2;
          timer = requestAnimationFrame(checkScroll);
        }
      };

      checkScroll();
    };

    window.addEventListener('pointermove', pointerMove);
    horizontalScrollParent.style.scrollBehavior = 'auto';
    verticalScrollParent.style.scrollBehavior = 'auto';

    return () => {
      window.removeEventListener('pointermove', pointerMove);
      horizontalScrollParent.style.removeProperty('scroll-behavior');
      verticalScrollParent.style.removeProperty('scroll-behavior');
      cancelAnimationFrame(timer);
    };
  }, [enabled, horizontalContainer, verticalContainer, edgeSize, speed, offsetX]);
};

export default useAutoScroll;
