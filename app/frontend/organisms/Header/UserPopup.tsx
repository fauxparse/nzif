import { Link, useNavigate } from 'react-router-dom';
import { Portal } from '@chakra-ui/portal';
import pluralize from 'pluralize';

import { useAuthentication } from '../Authentication';
import Avatar from '@/atoms/Avatar';
import { AvatarSize } from '@/atoms/Avatar/Avatar.types';
import Button, { ButtonVariant } from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import Money from '@/atoms/Money';
import {
  AuthenticatedUserFragment,
  Permission,
  useCurrentUserQuery,
  useRegistrationSummaryQuery,
} from '@/graphql/types';
import Skeleton from '@/helpers/Skeleton';
import Menu from '@/molecules/Menu';
import Popover from '@/molecules/Popover';
import { ROUTES } from '@/Routes';

import './UserPopup.css';

type UserPopupProps = {
  reference: HTMLElement;
  user: AuthenticatedUserFragment;
  open: boolean;
  onClose: () => void;
};

const UserPopup: React.FC<UserPopupProps> = ({ user, reference, open, onClose }) => {
  const { loading: userLoading } = useCurrentUserQuery();

  const { loading: registrationLoading, data: registrationData } = useRegistrationSummaryQuery({
    fetchPolicy: 'cache-first',
  });

  const loading = userLoading || registrationLoading;

  const { logOut } = useAuthentication();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const navigate = useNavigate();

  const onLogOut = () => {
    onClose();
    logOut().then(() => navigate('/'));
  };

  const registration = registrationData?.registration;

  const cart = registration?.cart;

  const { hasPermission } = useAuthentication();

  return (
    <Portal>
      <Popover
        reference={reference}
        className="user-popup"
        open={open}
        placement="bottom-end"
        onOpenChange={onOpenChange}
        onClick={onClose}
      >
        <div className="user-popup__user">
          <Avatar
            size={AvatarSize.LARGE}
            url={user.profile?.picture?.small}
            name={user.profile?.name || ''}
          />
          <div>
            <div className="user-popup__name">{user.profile?.name}</div>
            <div className="user-popup__email">{user.email}</div>
          </div>
          <Button small text="Edit profile" as={Link} to={ROUTES.PROFILE.path} />
          <Button small text="Log out" onClick={onLogOut} />
        </div>
        <hr />
        {loading || registration?.id ? (
          <div className="user-popup__registration" aria-busy={loading || undefined}>
            <div className="user-popup__registration-status">
              <p>
                <Skeleton text loading={loading}>
                  You’re registered for
                </Skeleton>
              </p>
              <p>
                <Skeleton text loading={loading}>
                  NZIF 2023!
                </Skeleton>
              </p>
            </div>
            <div className="user-popup__cart">
              {cart && (
                <>
                  <p>{pluralize('workshop', cart.workshopsCount, true)}</p>
                  <p>
                    {cart.total < cart.value && (
                      <del>
                        <Money cents={cart.value} />
                      </del>
                    )}
                    <Money cents={cart.total} includeCurrency />
                  </p>
                </>
              )}
            </div>
            <Skeleton rounded loading={loading}>
              <Button
                small
                as={Link}
                to={ROUTES.REGISTRATION.WORKSHOPS.path}
                text="Your registration"
              />
            </Skeleton>
            {cart && (
              <Skeleton rounded loading={loading}>
                <Button
                  small
                  variant={cart.outstanding ? ButtonVariant.PRIMARY : undefined}
                  as={Link}
                  to={ROUTES.REGISTRATION.PAYMENT.path}
                  aria-disabled={cart.outstanding <= 0 || undefined}
                >
                  <Button.Text>
                    <Money cents={cart.outstanding} /> to pay
                  </Button.Text>
                </Button>
              </Skeleton>
            )}
          </div>
        ) : (
          <div className="user-popup__registration" data-registered={false}>
            <div className="alert">
              <Icon name="alert" />
              <p>You’re signed in, but you’re not registered for the Festival.</p>
            </div>
            <Button small primary as={Link} to={ROUTES.REGISTRATION.path} text="Register now" />
          </div>
        )}
        {user.permissions.length > 0 && (
          <>
            <hr />
            <Menu className="user-popup__admin">
              <Menu.Item as={Link} to={ROUTES.ADMIN.path} icon="settings" label="Admin" />
              {hasPermission(Permission.Registrations) && (
                <Menu.Item
                  as={Link}
                  to={ROUTES.ADMIN.REGISTRATIONS.path}
                  icon="user"
                  label="Registrations"
                />
              )}
              {hasPermission(Permission.People) && (
                <Menu.Item as={Link} to={ROUTES.ADMIN.PEOPLE.path} icon="user" label="People" />
              )}
              {hasPermission(Permission.Activities) && (
                <>
                  <Menu.Item
                    as={Link}
                    to={ROUTES.ADMIN.ACTIVITIES.buildPath({ type: 'workshops' })}
                    icon="show"
                    label="Activities"
                  />
                  <Menu.Item
                    as={Link}
                    to={ROUTES.ADMIN.TIMETABLE.path}
                    icon="calendar"
                    label="Timetable"
                  />
                </>
              )}
            </Menu>
          </>
        )}
      </Popover>
    </Portal>
  );
};

export default UserPopup;
