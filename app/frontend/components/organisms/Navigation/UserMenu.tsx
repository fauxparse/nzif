import UserIcon from '@/icons/UserIcon';
import { useAuthentication } from '@/services/Authentication';
import { Avatar, DropdownMenu, IconButton, Text, Theme, useThemeContext } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';

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
      <DropdownMenu.Root>
        <Theme appearance={appearance}>
          <DropdownMenu.Trigger>
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
              asChild
            >
              <button type="button" />
            </Avatar>
          </DropdownMenu.Trigger>
        </Theme>
        <DropdownMenu.Content variant="soft" style={{ zIndex: 'var(--z-index-popover)' }}>
          <DropdownMenu.Item asChild>
            <Link to="/profile">
              <Text color="gray">Your profile</Text>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item color="crimson">Log out</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Theme>
  );
};

export default UserMenu;
