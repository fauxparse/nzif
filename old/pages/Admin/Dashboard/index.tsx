import { camelCase, kebabCase } from 'lodash-es';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/Routes';
import Button from '@/atoms/Button';
import { IconName } from '@/atoms/Icon';
import Money from '@/atoms/Money';
import Menu from '@/molecules/Menu';
import { useAuthentication } from '@/organisms/Authentication';
import activityTypeLabel from '@/util/activityTypeLabel';
import {
  ActivityType,
  Permission,
  useFestivalBalanceQuery,
  useRegistrationsCountSubscription,
} from '../../../graphql/types';

import './Dashboard.css';

export const Component: React.FC = () => {
  const { hasPermission } = useAuthentication();

  const year = String(new Date().getFullYear());

  const { data } = useRegistrationsCountSubscription({ variables: { year } });

  const { data: balanceData } = useFestivalBalanceQuery();

  const total = balanceData?.festival?.balance?.total || 0;
  const outstanding = total - (balanceData?.festival?.balance?.paid || 0);

  return (
    <div className="dashboard inset">
      <h1>Dashboard</h1>
      <div className="dashboard__stats">
        <div className="dashboard__stat">
          <div className="dashboard__stat__value">{data?.registrations?.count || '—'}</div>
          <div className="dashboard__stat__label">
            {pluralize('Registration', data?.registrations?.count || 0)}
          </div>
          <div className="dashboard__stat__action">
            {hasPermission(Permission.Registrations) && (
              <Button
                small
                as={Link}
                to={ROUTES.ADMIN.REGISTRATIONS.path}
                text="View registrations"
              />
            )}
          </div>
        </div>
        <div className="dashboard__stat">
          <Money className="dashboard__stat__value" cents={outstanding} />
          <div className="dashboard__stat__label">
            of <Money cents={total} /> outstanding
          </div>
          <div className="dashboard__stat__action">
            {hasPermission(Permission.Registrations) && (
              <Button small as={Link} to={ROUTES.ADMIN.PAYMENTS.path} text="View payments" />
            )}
          </div>
        </div>
      </div>
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
        {hasPermission(Permission.Payments) && (
          <section>
            <h3>Payments</h3>
            <Menu.Item as={Link} to={ROUTES.ADMIN.PAYMENTS.path} icon="bank" label="Payments" />
          </section>
        )}
        <section>
          <h3>Reports</h3>
          <Menu.Item
            as={Link}
            to={ROUTES.ADMIN.REPORTS.WORKSHOP_PREFERENCES.path}
            icon="workshop"
            label="Workshop preferences"
          />
        </section>
      </div>
    </div>
  );
};

Component.displayName = 'Dashboard';

export default Component;
