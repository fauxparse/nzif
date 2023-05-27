import { Link } from 'react-router-dom';

import { Permission } from '@/graphql/types';
import Menu from '@/molecules/Menu';
import MenuItem from '@/molecules/Menu/Item';
import { useAuthentication } from '@/organisms/Authentication';

const Dashboard: React.FC = () => {
  const { hasPermission } = useAuthentication();

  return (
    <div className="dashboard inset">
      <h1>Dashboard</h1>
      {hasPermission(Permission.People) && (
        <section>
          <h3>People</h3>
          <Menu>
            <Menu.Item as={Link} to="people" icon="user" label="Manage people" />
          </Menu>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
