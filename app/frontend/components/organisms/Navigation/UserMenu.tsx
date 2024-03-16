import Avatar from '@/components/atoms/Avatar';
import Menu from '@/components/molecules/Menu';
import { useAuthentication } from '@/services/Authentication';
import { Link } from '@tanstack/react-router';
import UserIcon from '@/icons/UserIcon';
import Switch from '@/components/atoms/Switch';

const UserMenu: React.FC = () => {
  const { user, logOut } = useAuthentication();

  if (!user) {
    return (
      <Link to="/login">
        <Avatar size="medium" user={user} />
      </Link>
    );
  }

  return (
    <Menu
      width="max-content"
      withArrow
      arrowSize={12}
      arrowOffset={15}
      arrowRadius={2}
      position="bottom-end"
      returnFocus
      shadow="md"
      transitionProps={{ transition: 'pop-top-right' }}
    >
      <Menu.Target>
        <Avatar component="button" size="medium" user={user} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} to="/profile" leftSection={<UserIcon />}>
          My profile
        </Menu.Item>
        <Menu.Item component="label" rightSection={<Switch />}>
          Dark mode
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item component={Link} to="/logout">
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;