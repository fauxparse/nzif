import { Button, ButtonProps } from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';

type CountdownButtonProps = ButtonProps & {
  seconds?: number;
};

export const CountdownButton: React.FC<CountdownButtonProps> = ({
  seconds = 3,
  disabled,
  children,
  ...props
}) => {
  const startTime = useRef(Date.now());

  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, seconds - Math.floor(elapsed / 1000));
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Button disabled={timeLeft > 0 || disabled} {...props}>
      {timeLeft > 0 ? String(timeLeft) : children}
    </Button>
  );
};
