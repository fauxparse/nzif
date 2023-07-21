import { Link } from 'react-router-dom';
import { camelCase, kebabCase } from 'lodash-es';
import pluralize from 'pluralize';

import { IconName } from '@/atoms/Icon';
import { ActivityType, Permission } from '@/graphql/types';
import Menu from '@/molecules/Menu';
import { useAuthentication } from '@/organisms/Authentication';
import { ROUTES } from '@/Routes';
import activityTypeLabel from '@/util/activityTypeLabel';

import './Dashboard.css';

export const Component: React.FC = () => {
  const { hasPermission } = useAuthentication();

  const year = String(new Date().getFullYear());

  return (
    <div className="dashboard inset">
      <h1>Dashboard</h1>
      <div className="dashboard__links">
        {hasPermission(Permission.People) && (
          <section>
            <h3>People</h3>
            <Menu.Item as={Link} to={ROUTES.ADMIN.PEOPLE.path} icon="user" label="Manage people" />
          </section>
        )}
        {hasPermission(Permission.Activities) && (
          <section>
            <h3>Activities</h3>
            {Object.entries(ActivityType).map(([key, value]) => (
              <Menu.Item
                as={Link}
                key={key}
                to={ROUTES.ADMIN.ACTIVITIES.buildPath({
                  type: pluralize(kebabCase(key)),
                })}
                icon={camelCase(value) as IconName}
                label={pluralize(activityTypeLabel(value))}
              />
            ))}
            <Menu.Item
              as={Link}
              to={ROUTES.ADMIN.TIMETABLE.buildPath({ year })}
              icon="calendar"
              label="Timetable"
            />
          </section>
        )}
        {hasPermission(Permission.Content) && (
          <section>
            <h3>Content</h3>
            <Menu.Item
              as={Link}
              to={ROUTES.ADMIN.TRANSLATIONS.path}
              icon="country"
              label="Translations"
            />
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

Component.displayName = 'Dashboard';

export default Component;
