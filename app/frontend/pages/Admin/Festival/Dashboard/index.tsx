import { Link } from 'react-router-dom';
import { camelCase, kebabCase } from 'lodash-es';
import pluralize from 'pluralize';

import { IconName } from '@/atoms/Icon';
import { ActivityType, Permission } from '@/graphql/types';
import Menu from '@/molecules/Menu';
import { useAuthentication } from '@/organisms/Authentication';
import activityTypeLabel from '@/util/activityTypeLabel';

import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { hasPermission } = useAuthentication();

  return (
    <div className="dashboard inset">
      <h1>Dashboard</h1>
      <div className="dashboard__links">
        {hasPermission(Permission.People) && (
          <section>
            <h3>People</h3>
            <Menu.Item as={Link} to="people" icon="user" label="Manage people" />
          </section>
        )}
        {hasPermission(Permission.Activities) && (
          <section>
            <h3>Activities</h3>
            {Object.entries(ActivityType).map(([key, value]) => (
              <Menu.Item
                as={Link}
                key={key}
                to={pluralize(kebabCase(key))}
                icon={camelCase(value) as IconName}
                label={pluralize(activityTypeLabel(value))}
              />
            ))}
            <Menu.Item as={Link} to="timetable" icon="calendar" label="Timetable" />
          </section>
        )}
        {hasPermission(Permission.Content) && (
          <section>
            <h3>Content</h3>
            <Menu.Item as={Link} to="translations" icon="country" label="Translations" />
            <Menu.Item
              as="a"
              href="https://app.contentful.com/spaces/4hh9rxfdoza6/entries"
              icon="edit"
              label="Edit content"
              target="_blank"
              rel="noopener noreferrer"
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
