import NavigationMenu from '@/components/organisms/NavigationMenu';
import Search from '@/components/organisms/Search';
import useFestival from '@/hooks/useFestival';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { ComponentProps, forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import UserMenu from './UserMenu';
import Waves from './Waves';

import { Heading, Theme, useThemeContext } from '@radix-ui/themes';
import classes from './Navigation.module.css';

type NavigationProps = ComponentProps<'header'>;

const Navigation = forwardRef<HTMLElement, NavigationProps>(({ className, ...props }, ref) => {
  const ownRef = useRef<HTMLElement>(null);

  const festival = useFestival();

  const { appearance } = useThemeContext();

  return (
    <Theme appearance={appearance === 'dark' ? 'light' : 'dark'}>
      <header ref={mergeRefs([ref, ownRef])} className={clsx(classes.navigation, className)}>
        <div className={classes.container}>
          <div className={classes.left}>
            <NavigationMenu />
          </div>
          <Heading as="h1" className={classes.title}>
            <Link to="/">
              <abbr title="New Zealand Improv Festival">
                NZ<b>IF</b>
              </abbr>{' '}
              {festival.id}
            </Link>
          </Heading>
          <div className={classes.right}>
            <Search />
            <UserMenu />
          </div>
        </div>
        <Waves />
      </header>
    </Theme>
  );
});

export default Navigation;
