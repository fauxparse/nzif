import { useIsPresent } from 'framer-motion';
import React, { useRef } from 'react';
import { useOutlet } from 'react-router-dom';

import usePrevious from '@/hooks/usePrevious';

const AnimatedOutlet: React.FC = () => {
  const outlet = useOutlet();

  const isPresent = useIsPresent();

  const ref = useRef<typeof outlet | null>(null);

  const previousOutlet = usePrevious(outlet) ?? outlet;

  if (!isPresent && !ref.current) {
    ref.current = previousOutlet;
  }

  return <>{ref.current || outlet}</>;
};

export default AnimatedOutlet;
