import SearchIcon from '@/icons/SearchIcon';
import { ActionIcon, ButtonProps } from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { forwardRef } from 'react';
import SearchModal from './SearchModal';

import './Search.css';

type SearchButtonProps = ButtonProps;

const SearchButton = forwardRef<HTMLButtonElement, SearchButtonProps>(({ className }, ref) => {
  const [opened, { open, close }] = useDisclosure(false);

  useHotkeys([['/', open]]);

  return (
    <>
      <ActionIcon
        ref={ref}
        variant="transparent"
        data-color="neutral"
        aria-label="Search"
        onClick={open}
      >
        <SearchIcon />
      </ActionIcon>
      <SearchModal opened={opened} onClose={close} />
    </>
  );
});

export default SearchButton;
