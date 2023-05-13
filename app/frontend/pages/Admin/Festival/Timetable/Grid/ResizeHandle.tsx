import { forwardRef, useEffect, useRef, useState } from 'react';

type ResizeHandleProps = {
  side: 'start' | 'end';
  column: number;
  onDrag: (column: number, final?: boolean) => void;
};

const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(
  ({ side, column: columnProp, onDrag }, ref) => {
    const [dragging, setDragging] = useState(false);

    const column = useRef(columnProp);

    useEffect(() => {
      column.current = columnProp;
    }, [columnProp]);

    const pointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      const { currentTarget: el } = e;
      const grid = el.closest('.timetable__grid') as HTMLDivElement;

      e.preventDefault();
      e.stopPropagation();

      if (!grid) return;

      setDragging(true);
      grid.setAttribute('data-resizing', 'true');

      const pointerMove = (e: PointerEvent) => {
        const cell = (e.target as HTMLElement).closest('[data-column]') as HTMLElement;
        if (!cell) return;
        const newColumn = Number(cell.dataset.column);
        if (newColumn !== column.current) {
          column.current = newColumn;
          onDrag(newColumn);
        }
      };

      const pointerUp = () => {
        grid.removeAttribute('data-resizing');
        setDragging(false);
        onDrag(column.current, true);
        grid.removeEventListener('pointermove', pointerMove);
        document.removeEventListener('pointerup', pointerUp);
      };

      grid.addEventListener('pointermove', pointerMove);
      document.addEventListener('pointerup', pointerUp);
    };

    return (
      <div
        ref={ref}
        className={`timetable__resize-handle`}
        data-dragging={dragging}
        data-side={side}
        onPointerDown={pointerDown}
      />
    );
  }
);

ResizeHandle.displayName = 'Timetable.ResizeHandle';

export default ResizeHandle;
