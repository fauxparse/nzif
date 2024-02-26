import clsx from 'clsx';
import { ComponentProps } from 'react';

import './Header.css';
import Waves from './Waves';
import { Link } from '@tanstack/react-router';
import Avatar from '../Avatar';
import { useAuthentication } from '@/services/Authentication';
import SearchIcon from '@/icons/SearchIcon';
import Button from '@/components/Button';
import MenuIcon from '@/icons/MenuIcon';

type HeaderProps = ComponentProps<'header'>;

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  const { user, logOut } = useAuthentication();

  return (
    <header className={clsx('header', className)}>
      <div className="container" data-theme="invert">
        <div className="header__left">
          <Button rel="menu" variant="ghost" left={<MenuIcon />} />
        </div>
        <h1 className="header__title">
          <abbr title="New Zealand Improv Festival">
            NZ<b>IF</b>
          </abbr>{' '}
          2024
        </h1>
        <div className="header__right">
          <Button left={<SearchIcon />}>Search</Button>
          <Link to="/profile">
            <Avatar size="large" user={user} />
          </Link>
        </div>
      </div>
      <Waves />
    </header>
  );
};

export default Header;
