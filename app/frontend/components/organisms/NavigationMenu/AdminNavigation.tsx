import { ActionList } from '@/components/molecules/ActionList';
import DashboardIcon from '@/icons/DashboardIcon';
import { useAuthentication } from '@/services/Authentication';
import { Title } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { isEmpty } from 'lodash-es';
import { NavigationItem } from './NavigationItem';

export const AdminNavigation = () => {
  const { user } = useAuthentication();

  if (isEmpty(user?.permissions)) return null;

  return (
    <div>
      <Title order={4} mb={2}>
        Admin
      </Title>
      <ActionList>
        <NavigationItem component={Link} to="/admin" leftSection={<DashboardIcon />}>
          Dashboard
        </NavigationItem>
      </ActionList>
    </div>
  );
};
