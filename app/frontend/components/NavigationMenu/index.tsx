import MenuIcon from '@/icons/MenuIcon';
import Button from '@/components/Button';
import Drawer from '@/components/Drawer';
import { useDisclosure } from '@mantine/hooks';

import './NavigationMenu.css';

const NavigationMenu: React.FC = () => {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <Button
        className="button--menu"
        variant="ghost"
        left={<MenuIcon />}
        aria-expanded={opened}
        onClick={open}
      />
      <Drawer opened={opened} title="Hello" onClose={close}>
        <p>Todo</p>
      </Drawer>
    </>
  );
};

export default NavigationMenu;
