import SearchIcon from '@/icons/SearchIcon';
import { ButtonProps } from '@mantine/core';
import Button from '@/components/atoms/Button';
import { forwardRef } from 'react';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import SearchModal from './SearchModal';

import './Search.css';

type SearchButtonProps = ButtonProps;

const SearchButton = forwardRef<HTMLButtonElement, SearchButtonProps>(
  ({ className, ...props }, ref) => {
    const [opened, { open, close }] = useDisclosure(false);

    useHotkeys([['/', open]]);

    return (
      <>
        <Button variant="ghost" left={<SearchIcon />} aria-label="Search" onClick={open} />
        <SearchModal opened={opened} onClose={close} />
      </>
    );
  }
);

export default SearchButton;
