import MinusIcon from '@/icons/MinusIcon';
import PlusIcon from '@/icons/PlusIcon';
import { IconButton, IconButtonProps, TextField } from '@radix-ui/themes';

import clsx from 'clsx';
import { useRef } from 'react';
import classes from './NumberInput.module.css';

type NumberInputProps = Omit<TextField.RootProps, 'value'> & {
  min?: number;
  max?: number;
  value: number | null;
  onValueChange: (value: number | null) => void;
};

export const NumberInput: React.FC<NumberInputProps> = ({
  className,
  value,
  min,
  max,
  onValueChange,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      onValueChange(e.currentTarget.valueAsNumber ?? null);
    } else {
      onValueChange(null);
    }
  };

  const decrement = () => {
    const value = ref.current?.valueAsNumber;
    if (value === undefined) return;
    onValueChange(min !== undefined ? Math.max(min, value - 1) : value - 1);
  };

  const increment = () => {
    const value = ref.current?.valueAsNumber;
    if (value === undefined) return;
    onValueChange(max !== undefined ? Math.min(max, value + 1) : value + 1);
  };

  return (
    <TextField.Root
      ref={ref}
      className={clsx(classes.root, className)}
      type="number"
      value={value === null ? '' : String(value)}
      min={min}
      max={max}
      onChange={change}
      {...props}
    >
      <TextField.Slot className={classes.slot} side="left">
        <HoldDownButton
          className={classes.button}
          type="button"
          size="1"
          color="gray"
          onClick={decrement}
        >
          <MinusIcon />
        </HoldDownButton>
      </TextField.Slot>
      <TextField.Slot className={classes.slot} side="right">
        <HoldDownButton
          className={classes.button}
          type="button"
          size="1"
          color="gray"
          onClick={increment}
        >
          <PlusIcon />
        </HoldDownButton>
      </TextField.Slot>
    </TextField.Root>
  );
};

const HoldDownButton: React.FC<IconButtonProps> = ({ children, onClick, ...props }) => {
  const startTimer = useRef<number | null>(null);
  const interval = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;

    interval.current = null;
    startTimer.current = window.setTimeout(() => {
      interval.current = window.setInterval(() => onClick?.(e), 100);
    }, 200);

    window.addEventListener(
      'mouseup',
      () => {
        if (interval.current) {
          clearInterval(interval.current);
          interval.current = null;
        }
      },
      { once: true }
    );
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    } else {
      onClick?.(e);
      if (startTimer.current) {
        clearTimeout(startTimer.current);
        startTimer.current = null;
      }
    }
  };

  return (
    <IconButton {...props} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      {children}
    </IconButton>
  );
};
