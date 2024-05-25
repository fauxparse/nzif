import Button from '@/components/atoms/Button';
import Drawer from '@/components/molecules/Drawer';
import MenuIcon from '@/icons/MenuIcon';
import { useDisclosure } from '@mantine/hooks';

import { AdminNavigation } from './AdminNavigation';
import './NavigationMenu.css';

const NavigationMenu: React.FC = () => {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <Button
        className="button--menu"
        variant="ghost"
        leftSection={<MenuIcon />}
        aria-expanded={opened}
        onClick={open}
      />
      <Drawer opened={opened} title="Hello" onClose={close}>
        <p>Todo</p>
        <AdminNavigation />
      </Drawer>
    </>
  );
};

export default NavigationMenu;
