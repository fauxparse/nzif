import { Button, ButtonProps } from '@mantine/core';
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';

type CountdownButtonProps = ComponentPropsWithoutRef<'button'> &
  ButtonProps & {
    seconds?: number;
  };

export const CountdownButton: React.FC<CountdownButtonProps> = ({
  seconds = 3,
  leftSection,
  rightSection,
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
    <Button
      leftSection={timeLeft > 0 ? undefined : leftSection}
      rightSection={timeLeft > 0 ? undefined : rightSection}
      disabled={timeLeft > 0 || disabled}
      {...props}
    >
      {timeLeft > 0 ? String(timeLeft) : children}
    </Button>
  );
};
