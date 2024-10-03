import { Outlet } from '@tanstack/react-router';

import { Box, Flex } from '@radix-ui/themes';
import { useState } from 'react';
import classes from './Directory.module.css';
import { Search } from './Search';
import { Person } from './types';

export const Directory = () => {
  const [person, setPerson] = useState<Person | null>(null);

  return (
    <Flex className={classes.directory} direction="column" p="4" gap="2">
      <Search person={person} onChange={setPerson} />
      <Box className={classes.content}>
        <Outlet />
      </Box>
    </Flex>
  );
};
