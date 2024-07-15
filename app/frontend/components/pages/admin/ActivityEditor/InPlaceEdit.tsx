import { useDisclosure } from '@/hooks/useDisclosure';
import PencilIcon from '@/icons/PencilIcon';
import { Box, IconButton, Text, TextArea, TextAreaProps } from '@radix-ui/themes';
import clsx from 'clsx';

import classes from './InPlaceEdit.module.css';

type InPlaceEditProps = TextAreaProps;

export const InPlaceEdit: React.FC<InPlaceEditProps> = ({ className, onBlur, ...props }) => {
  const [editing, { open, close }] = useDisclosure();

  return (
    <Box className={clsx(classes.root, className)}>
      {editing ? (
        <TextArea
          className={classes.input}
          autoFocus
          onFocus={(e) => {
            e.currentTarget.selectionStart = e.currentTarget.value.length;
          }}
          onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
            onBlur?.(e);
            close();
          }}
          {...props}
        />
      ) : (
        <>
          <Text className={classes.text} onClick={open}>
            {props.value}
          </Text>
          <IconButton variant="ghost" radius="full" onClick={open} aria-label="Edit">
            <PencilIcon />
          </IconButton>
        </>
      )}
    </Box>
  );
};
