import React, { Fragment, useState } from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';

import { TimetableQuery } from '@/graphql/types';
import BaseGrid from '@/molecules/Grid';
import { Region } from '@/molecules/Grid/Grid.types';

import Cell from './Cell';
import ColumnHeader from './ColumnHeader';
import { GridContext } from './Context';
import { FloatingArrow } from './FloatingArrow';
import NewSlot from './NewSlot';
import RowHeader from './RowHeader';
import { Selection } from './Selection';
import TimetableSlot from './TimetableSlot';
import useTimetable from './useTimetable';

type Slot = TimetableQuery['festival']['timetable']['slots'][0];

type GridProps = {
  startHour?: number;
  endHour?: number;
  granularity?: number;
  slots: Slot[];
};

const popoverVariants: Variants = {
  initial: (placement) => ({
    opacity: 0,
    x: placement === 'right' ? 160 : placement === 'left' ? -160 : 0,
    y: placement === 'bottom' ? 160 : placement === 'top' ? -160 : 0,
    scale: 1,
  }),
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: 0,
    y: 0,
    scale: 0.5,
    transition: { ease: [0.4, 0, 0.2, 1], duration: 0.05 },
  },
};

const Grid: React.FC<GridProps> = ({ slots, startHour = 9, endHour = 26, granularity = 4 }) => {
  const { dates, rows, selectionHeight, cellToTime, timeToCell } = useTimetable<Slot>(slots);

  const arrowRef = React.useRef<SVGSVGElement>(null);

  const [ghostSelection, setGhostSelection] = useState<Region>({
    row: 0,
    column: 0,
    width: 1,
    height: 1,
  });

  const setSelection = (selection: Region | null) => {
    if (selection) {
      setGhostSelection(selection);
      setPopupOpen(true);
    }
  };

  const [popupOpen, setPopupOpen] = useState(false);

  const { x, y, refs, strategy, context, placement } = useFloating({
    placement: 'right',
    open: popupOpen,
    onOpenChange: setPopupOpen,
    middleware: [
      offset(24),
      flip({ fallbackAxisSideDirection: 'end' }),
      shift({ crossAxis: true }),
      arrow({
        element: arrowRef,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([role, dismiss]);

  return (
    <div className="timetable__grid">
      <GridContext.Provider value={{ dates, rows, selectionHeight, cellToTime, timeToCell }}>
        <BaseGrid
          rows={rows.length}
          columns={(endHour - startHour) * granularity}
          rowHeader={RowHeader}
          columnHeader={ColumnHeader}
          cell={Cell}
          selection={Selection}
          onSelectionChange={setSelection}
        >
          {rows.map((row, i) => (
            <Fragment key={i}>
              {row.blocks.map((slot, i) => (
                <TimetableSlot key={i} slot={slot} />
              ))}
            </Fragment>
          ))}
          <Selection
            className="timetable__selection--ghost"
            selection={ghostSelection}
            rowOffset={1}
            columnOffset={1}
            ref={refs.setReference}
            {...getReferenceProps()}
          />
        </BaseGrid>
        <AnimatePresence>
          {popupOpen && (
            <FloatingFocusManager context={context} modal={false} closeOnFocusOut={false}>
              <motion.div
                className="popover"
                ref={refs.setFloating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                }}
                {...getFloatingProps()}
                variants={popoverVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={placement}
              >
                <NewSlot selection={ghostSelection} onClose={() => setPopupOpen(false)} />
                <FloatingArrow ref={arrowRef} context={context} stroke="var(--popover-border)" />
              </motion.div>
            </FloatingFocusManager>
          )}
        </AnimatePresence>
      </GridContext.Provider>
    </div>
  );
};

export default Grid;
