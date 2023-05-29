import { Link } from 'react-router-dom';

import { Permission } from '@/graphql/types';
import Menu from '@/molecules/Menu';
import { useAuthentication } from '@/organisms/Authentication';

const Dashboard: React.FC = () => {
  const { hasPermission } = useAuthentication();

  return (
    <div className="dashboard inset">
      <h1>Dashboard</h1>
      {hasPermission(Permission.People) && (
        <section>
          <h3>People</h3>
          <Menu.Item as={Link} to="people" icon="user" label="Manage people" />
        </section>
      )}
      {hasPermission(Permission.Activities) && (
        <section>
          <h3>Activities</h3>
          <Menu.Item as={Link} to="activities" icon="show" label="All activities" />
          <Menu.Item as={Link} to="timetable" icon="calendar" label="Timetable" />
        </section>
      )}
      {hasPermission(Permission.Content) && (
        <section>
          <h3>Content</h3>
          <Menu.Item as={Link} to="translations" icon="country" label="Translations" />
          <Menu.Item as="a" href="https://contentful.com" icon="edit" label="Edit content" />
        </section>
      )}
    </div>
  );
};

export default Dashboard;
