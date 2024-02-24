import clsx from 'clsx';
import { ComponentProps } from 'react';

import './Header.css';
import Waves from './Waves';
import { Link } from '@tanstack/react-router';

type HeaderProps = ComponentProps<'header'>;

const Header: React.FC<HeaderProps> = ({ className, ...props }) => (
  <header className={clsx('header', className)}>
    <div className="container">
      <div className="header__left">
        <button type="button">Menu</button>
      </div>
      <h1 className="header__title">
        <abbr title="New Zealand Improv Festival">
          NZ<b>IF</b>
        </abbr>{' '}
        2024
      </h1>
      <div className="header__right">
        <button type="button">Search</button>
        <Link className="avatar" to="/profile" />
      </div>
    </div>
    <Waves />
  </header>
);

export default Header;
