import clsx from 'clsx';
import { ComponentProps, forwardRef, useRef } from 'react';

import './Header.css';
import Waves from './Waves';
import { Link } from '@tanstack/react-router';
import Avatar from '../Avatar';
import { useAuthentication } from '@/services/Authentication';
import SearchIcon from '@/icons/SearchIcon';
import Button from '@/components/Button';
import MenuIcon from '@/icons/MenuIcon';
import TextInput from '../TextInput';
import NavigationMenu from '../NavigationMenu';
import UserMenu from './UserMenu';
import { mergeRefs } from 'react-merge-refs';
import useTheme from '@/hooks/useTheme';

type HeaderProps = ComponentProps<'header'>;

const Header = forwardRef<HTMLElement, HeaderProps>(({ className, ...props }, ref) => {
  const { user, logOut } = useAuthentication();

  const ownRef = useRef<HTMLElement>(null);

  const theme = useTheme(ownRef);

  return (
    <header ref={mergeRefs([ref, ownRef])} className={clsx('header', className)}>
      <div className="container" data-theme={theme === 'dark' ? 'light' : 'dark'}>
        <div className="header__left">
          <NavigationMenu />
        </div>
        <h1 className="header__title">
          <abbr title="New Zealand Improv Festival">
            NZ<b>IF</b>
          </abbr>{' '}
          2024
        </h1>
        <div className="header__right">
          <TextInput
            className="search"
            type="search"
            leftSection={<SearchIcon />}
            placeholder="Search…"
          />
          <UserMenu />
        </div>
      </div>
      <Waves />
    </header>
  );
});

export default Header;
