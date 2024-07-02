import { useDisclosure } from '@/hooks/useDisclosure';
import MenuIcon from '@/icons/MenuIcon';
import { IconButton } from '@radix-ui/themes';

import classes from './NavigationMenu.module.css';

const NavigationMenu: React.FC = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <IconButton
      className={classes.menuButton}
      variant="ghost"
      size="4"
      radius="full"
      color="gray"
      aria-expanded={opened}
      onClick={toggle}
    >
      <MenuIcon />
    </IconButton>
  );
};

export default NavigationMenu;
