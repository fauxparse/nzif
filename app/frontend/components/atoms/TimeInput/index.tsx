import ChevronDownIcon from '@/icons/ChevronDownIcon';
import ClockIcon from '@/icons/ClockIcon';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Button, Flex, IconButton, Popover, SegmentedControl, TextField } from '@radix-ui/themes';
import clsx from 'clsx';
import { range } from 'lodash-es';
import { DateTime } from 'luxon';
import { CSSProperties } from 'react';
import classes from './TimeInput.module.css';

type TimeInputProps = Omit<TextField.RootProps, 'value'> & {
  value: DateTime | null;
  onValueChange: (value: DateTime | null) => void;
};

export const TimeInput: React.FC<TimeInputProps> = ({
  className,
  value,
  onValueChange,
  ...props
}) => {
  const changed = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    onValueChange(value ? DateTime.fromFormat(value, 'HH:mm') : null);
  };

  return (
    <Popover.Root>
      <PopoverPrimitive.Anchor>
        <Flex>
          <TextField.Root
            className={clsx(classes.root, className)}
            type="time"
            size="3"
            step={60 * 15}
            value={value?.toFormat('HH:mm') ?? undefined}
            onChange={changed}
          >
            <TextField.Slot side="left">
              <ClockIcon />
            </TextField.Slot>
            <TextField.Slot side="right">
              <PopoverPrimitive.Trigger asChild>
                <IconButton className={classes.chevron} color="gray" variant="ghost">
                  <ChevronDownIcon />
                </IconButton>
              </PopoverPrimitive.Trigger>
            </TextField.Slot>
          </TextField.Root>
        </Flex>
      </PopoverPrimitive.Anchor>
      <Popover.Content className={classes.content}>
        <ClockFace time={value || DateTime.now()} onChange={onValueChange} />
      </Popover.Content>
    </Popover.Root>
  );
};

const ClockFace: React.FC<{ time: DateTime; onChange: (value: DateTime) => void }> = ({
  time,
  onChange,
}) => {
  const hour = ((time.hour + 11) % 12) + 1;
  const minute = Math.floor(time.minute / 5) * 5;

  const setHour = (hour: number) => {
    onChange(time.set({ hour: time.hour < 12 ? hour : (hour + 12) % 24 }));
  };

  const setMinute = (minute: number) => {
    onChange(time.set({ minute }));
  };

  const setMeridiem = (meridiem: 'am' | 'pm') => {
    onChange(time.set({ hour: meridiem === 'am' ? time.hour % 12 : (time.hour % 12) + 12 }));
  };

  return (
    <div className={classes.clock}>
      <div
        className={classes.hands}
        style={{ '--arm-length': '27cqw', '--angle': `${(hour / 12) * 360}deg` } as CSSProperties}
      >
        <div className={classes.highlight} />
        {range(1, 13).map((i) => (
          <div
            key={i}
            className={classes.hand}
            style={{ '--angle': `${(i / 12) * 360}deg` } as CSSProperties}
          >
            <Button
              className={classes.button}
              aria-selected={hour === i}
              onClick={() => setHour(i)}
            >
              {i}
            </Button>
          </div>
        ))}
      </div>
      <div
        className={classes.hands}
        style={{ '--arm-length': '42.5cqw', '--angle': `${minute * 6}deg` } as CSSProperties}
      >
        <div className={classes.highlight} />
        {range(12).map((i) => (
          <div
            key={i}
            className={classes.hand}
            style={{ '--angle': `${(i / 12) * 360}deg` } as CSSProperties}
          >
            <Button
              className={classes.button}
              aria-selected={minute === i * 5}
              onClick={() => setMinute(i * 5)}
            >
              {`${i < 2 ? '0' : ''}${i * 5}`}
            </Button>
          </div>
        ))}
      </div>
      <SegmentedControl.Root
        value={time.hour < 12 ? 'am' : 'pm'}
        onValueChange={setMeridiem}
        radius="full"
        size="1"
      >
        <SegmentedControl.Item value="am">AM</SegmentedControl.Item>
        <SegmentedControl.Item value="pm">PM</SegmentedControl.Item>
      </SegmentedControl.Root>
    </div>
  );
};
