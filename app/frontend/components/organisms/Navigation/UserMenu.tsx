import UserIcon from '@/icons/UserIcon';
import { useAuthentication } from '@/services/Authentication';
import {
  Avatar,
  Button,
  DropdownMenu,
  IconButton,
  Text,
  Theme,
  useThemeContext,
} from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';

import classes from './Navigation.module.css';

const UserMenu: React.FC = () => {
  const { user, logOut } = useAuthentication();

  const { appearance } = useThemeContext();

  if (!user) {
    return (
      <IconButton variant="ghost" radius="full" size="4" color="gray" asChild>
        <Link to="/login">
          <UserIcon color="gray" />
        </Link>
      </IconButton>
    );
  }

  return (
    <Theme appearance={appearance === 'dark' ? 'light' : 'dark'}>
      <Theme appearance={appearance}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button className={classes.avatarButton}>
              <Avatar
                src={user.profile?.picture?.small}
                fallback={
                  user.profile?.name
                    ?.split(/\s+/)
                    .map((x) => x[0])
                    .join('') || ''
                }
                alt={user.profile?.name}
                size="4"
                radius="full"
              />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant="soft" style={{ zIndex: 'var(--z-index-popover)' }}>
            <DropdownMenu.Item asChild>
              <Link to="/profile">
                <Text color="gray">Your profile</Text>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item color="crimson" asChild>
              <Link to="/logout">Log out</Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Theme>
    </Theme>
  );
};

export default UserMenu;
