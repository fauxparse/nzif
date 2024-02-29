import clsx from 'clsx';
import { ComponentProps, forwardRef, useRef } from 'react';
import Waves from './Waves';
import { useAuthentication } from '@/services/Authentication';
import SearchIcon from '@/icons/SearchIcon';
import TextInput from '../TextInput';
import NavigationMenu from '../NavigationMenu';
import UserMenu from './UserMenu';
import { mergeRefs } from 'react-merge-refs';
import useTheme from '@/hooks/useTheme';

import './Navigation.css';

type NavigationProps = ComponentProps<'header'>;

const Navigation = forwardRef<HTMLElement, NavigationProps>(({ className, ...props }, ref) => {
  const { user, logOut } = useAuthentication();

  const ownRef = useRef<HTMLElement>(null);

  const theme = useTheme(ownRef);

  return (
    <header ref={mergeRefs([ref, ownRef])} className={clsx('navigation', className)}>
      <div className="container" data-theme={theme === 'dark' ? 'light' : 'dark'}>
        <div className="navigation__left">
          <NavigationMenu />
        </div>
        <h1 className="navigation__title">
          <abbr title="New Zealand Improv Festival">
            NZ<b>IF</b>
          </abbr>{' '}
          2024
        </h1>
        <div className="navigation__right">
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

export default Navigation;
