import { Link, useNavigate } from 'react-router-dom';
import { Portal } from '@chakra-ui/portal';

import { useAuthentication } from '../Authentication';
import Avatar from '@/atoms/Avatar';
import { AvatarSize } from '@/atoms/Avatar/Avatar.types';
import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import { AuthenticatedUserFragment, useCurrentUserQuery } from '@/graphql/types';
import Skeleton from '@/helpers/Skeleton';
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
  const { loading, data } = useCurrentUserQuery();

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

  return (
    <Portal>
      <Popover
        reference={reference}
        className="user-popup"
        open={open}
        placement="bottom-end"
        onOpenChange={onOpenChange}
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
        {loading || data?.registration?.id ? (
          <div className="user-popup__registration" aria-busy={loading || undefined}>
            <div>
              <p>
                <Skeleton text loading>
                  You’re registered for
                </Skeleton>
              </p>
              <p>
                <Skeleton text loading>
                  NZIF 2023!
                </Skeleton>
              </p>
            </div>
            <Skeleton rounded loading>
              <Button small as={Link} to={ROUTES.REGISTRATION.path} text="Your registration" />
            </Skeleton>
            <Skeleton rounded loading>
              <Button
                small
                primary
                as={Link}
                to={ROUTES.REGISTRATION.PAYMENT.path}
                text="$125 to pay"
              />
            </Skeleton>
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
      </Popover>
    </Portal>
  );
};

export default UserPopup;
