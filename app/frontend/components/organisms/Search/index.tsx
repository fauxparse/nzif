import Button from '@/components/atoms/Button';
import SearchIcon from '@/icons/SearchIcon';
import type { ButtonProps } from '@mantine/core';
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
      <Button
        ref={ref}
        variant="ghost"
        leftSection={<SearchIcon />}
        aria-label="Search"
        onClick={open}
      />
      <SearchModal opened={opened} onClose={close} />
    </>
  );
});

export default SearchButton;
