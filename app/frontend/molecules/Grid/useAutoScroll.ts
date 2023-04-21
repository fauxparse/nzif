import { useEffect } from 'react';

type UseAutoScrollOptions = {
  container: HTMLElement;
  verticalContainer?: HTMLElement;
  enabled?: boolean;
  edgeSize?: number;
  speed?: number;
};

const scrollVelocity = (position: number, max: number, edgeSize): number => {
  if (position < edgeSize) {
    return (position - edgeSize) / edgeSize;
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
  speed = 32,
}: UseAutoScrollOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const { clientWidth, scrollWidth } = horizontalContainer;
    const { clientHeight, scrollHeight } = verticalContainer;
    const maxX = Math.max(0, scrollWidth - clientWidth);
    const maxY = Math.max(0, scrollHeight - clientHeight);
    let timer: ReturnType<typeof requestAnimationFrame>;

    const pointerMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;

      const vx = scrollVelocity(clientX, clientWidth, edgeSize);
      const vy = scrollVelocity(clientY, clientHeight, edgeSize);

      if (!vx && !vy) {
        cancelAnimationFrame(timer);
        return;
      }

      const checkScroll = () => {
        cancelAnimationFrame(timer);

        const x = horizontalContainer.scrollLeft;
        const x2 = Math.max(0, Math.min(maxX, x + vx * speed));
        const y = verticalContainer.scrollTop;
        const y2 = Math.max(0, Math.min(maxY, y + vy * speed));

        if (x !== x2 || y !== y2) {
          verticalContainer.scrollTop = y2;
          horizontalContainer.scrollLeft = x2;
          timer = requestAnimationFrame(checkScroll);
        }
      };

      checkScroll();
    };

    window.addEventListener('pointermove', pointerMove);
    horizontalContainer.style.scrollBehavior = 'auto';
    verticalContainer.style.scrollBehavior = 'auto';

    return () => {
      window.removeEventListener('pointermove', pointerMove);
      horizontalContainer.style.removeProperty('scroll-behavior');
      verticalContainer.style.removeProperty('scroll-behavior');
    };
  }, [enabled, horizontalContainer, verticalContainer, edgeSize, speed]);
};

export default useAutoScroll;
