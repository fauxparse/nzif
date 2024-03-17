import clsx from 'clsx';
import { ComponentProps, forwardRef, useRef } from 'react';
import Waves from './Waves';
import NavigationMenu from '@/components/organisms/NavigationMenu';
import Search from '@/components/organisms/Search';
import UserMenu from './UserMenu';
import { mergeRefs } from 'react-merge-refs';
import { useCurrentTheme } from '@/hooks/useTheme';

import './Navigation.css';
import { Link } from '@tanstack/react-router';
import useFestival from '@/hooks/useFestival';

type NavigationProps = ComponentProps<'header'>;

const Navigation = forwardRef<HTMLElement, NavigationProps>(({ className, ...props }, ref) => {
  const ownRef = useRef<HTMLElement>(null);

  const theme = useCurrentTheme(ownRef);

  const festival = useFestival();

  return (
    <header ref={mergeRefs([ref, ownRef])} className={clsx('navigation', className)}>
      <div className="container" data-theme={theme === 'dark' ? 'light' : 'dark'}>
        <div className="navigation__left">
          <NavigationMenu />
        </div>
        <h1 className="navigation__title">
          <Link to="/">
            <abbr title="New Zealand Improv Festival">
              NZ<b>IF</b>
            </abbr>{' '}
            {festival.id}
          </Link>
        </h1>
        <div className="navigation__right">
          <Search />
          <UserMenu />
        </div>
      </div>
      <Waves />
    </header>
  );
});

export default Navigation;
