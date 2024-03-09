import { useMatches, useMatch } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import AnimatedOutlet from './AnimatedOutlet';
import { Direction } from './types';
import usePreviousDistinct from '@/hooks/usePreviousDistinct';

type RouteTransitionProps = {
  direction?: Direction;
  routeKey?: string;
};

const RouteTransition: React.FC<RouteTransitionProps> = ({ direction, routeKey }) => {
  const matches = useMatches();
  const match = useMatch({ strict: false });
  const nextMatchIndex = matches.findIndex((d) => d.id === match.id) + 1;
  const nextMatch = matches[nextMatchIndex];

  const nextMatchId = nextMatch?.routeId.replace(/\/$/, '');

  const previousMatchId = usePreviousDistinct(String(nextMatchId));

  const dir = useMemo(() => {
    if (direction !== undefined) return direction;

    const previousLength = previousMatchId?.split('/')?.length || 0;
    const newLength = nextMatchId?.split('/')?.length || 0;
    return newLength < previousLength ? 'right' : 'left';
  }, [direction, nextMatchId, previousMatchId]);

  return (
    <AnimatePresence mode="popLayout" initial={false} custom={dir}>
      <AnimatedOutlet key={routeKey ?? nextMatch?.routeId} direction={dir} />
    </AnimatePresence>
  );
};

export default RouteTransition;
