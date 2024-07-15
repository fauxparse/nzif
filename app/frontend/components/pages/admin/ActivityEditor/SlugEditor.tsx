import { Spinner } from '@/components/atoms/Spinner';
import { pluralFromActivityType } from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import LinkIcon from '@/icons/LinkIcon';
import { Flex, IconButton, Text, TextField } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

import classes from './SlugEditor.module.css';

type SlugEditorProps = {
  value: string;
  busy: boolean;
  activityType: ActivityType;
  onValueChange: (value: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export const SlugEditor: React.FC<SlugEditorProps> = ({
  value,
  activityType,
  busy,
  onValueChange,
  onBlur,
}) => {
  const [input, setInput] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!input) return;

    const changed = () => {
      input.style.width = '0';
      input.style.width = `${input.scrollWidth}px`;
    };

    input.addEventListener('input', changed);

    setTimeout(changed);

    return () => {
      input.removeEventListener('input', changed);
    };
  }, [input]);

  return (
    <Flex className={classes.root} gap="1" align="center">
      <Text
        className={classes.prefix}
        size="2"
      >{`https://my.improvfest.nz/${pluralFromActivityType(activityType)}/`}</Text>

      <TextField.Root
        ref={setInput}
        className={classes.input}
        variant="soft"
        color="gray"
        value={value}
        onChange={(e) => onValueChange(e.currentTarget.value)}
        onBlur={onBlur}
      >
        <TextField.Slot side="right">
          <Spinner size="1" style={{ opacity: busy ? 1 : 0 }} />
        </TextField.Slot>
      </TextField.Root>
      <IconButton
        type="button"
        variant="ghost"
        radius="full"
        aria-label="Copy"
        onClick={() => {
          //
        }}
      >
        <LinkIcon />
      </IconButton>
    </Flex>
  );
};
