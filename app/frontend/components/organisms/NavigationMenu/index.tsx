import Drawer from '@/components/molecules/Drawer';
import MenuIcon from '@/icons/MenuIcon';
import { useDisclosure } from '@mantine/hooks';

import { AdminNavigation } from './AdminNavigation';
import './NavigationMenu.css';
import { ActionIcon } from '@mantine/core';

const NavigationMenu: React.FC = () => {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <ActionIcon
        className="button--menu"
        variant="subtle"
        data-color="neutral"
        aria-expanded={opened}
        onClick={open}
      >
        <MenuIcon />
      </ActionIcon>
      <Drawer opened={opened} title="Hello" onClose={close}>
        <p>Todo</p>
        <AdminNavigation />
      </Drawer>
    </>
  );
};

export default NavigationMenu;
