import { useEffect, useRef } from 'react';

const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    if (ref.current !== value) {
      ref.current = value;
    }
  }, [value]);

  return ref.current;
};

export default usePrevious;
