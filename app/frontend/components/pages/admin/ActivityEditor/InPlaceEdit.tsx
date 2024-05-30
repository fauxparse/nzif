import PencilIcon from '@/icons/PencilIcon';
import { ActionIcon, Box, Text, Textarea, TextareaProps } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import clsx from 'clsx';

type InPlaceEditProps = TextareaProps;

export const InPlaceEdit: React.FC<InPlaceEditProps> = ({ className, onBlur, ...props }) => {
  const [editing, { open, close }] = useDisclosure();

  return (
    <Box className={clsx('in-place-edit', className)}>
      {editing ? (
        <Textarea
          className="in-place-edit__input"
          unstyled
          autoFocus
          minRows={1}
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
          <Text className="in-place-edit__text" onClick={open}>
            {props.value}
          </Text>
          <ActionIcon
            className="in-place-edit__icon"
            variant="transparent"
            onClick={open}
            aria-label="Edit"
          >
            <PencilIcon />
          </ActionIcon>
        </>
      )}
    </Box>
  );
};
