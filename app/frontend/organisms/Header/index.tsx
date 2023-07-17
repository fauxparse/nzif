import React, { useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCycle } from 'framer-motion';
import { DateTime } from 'luxon';

import { useAuthentication } from '../Authentication/AuthenticationProvider';
import Avatar from '@/atoms/Avatar';
import Button from '@/atoms/Button';
import Icon from '@/atoms/Icon';
import Logo from '@/atoms/Logo';
import Placename from '@/atoms/Placename/Placename';
import ThemeSwitcher from '@/atoms/ThemeSwitcher';
import { useHeaderQuery } from '@/graphql/types';

import Overlay from './Overlay';
import HeaderSearch from './Search';

import './Header.css';

const dateRange = (start: DateTime, end: DateTime) => {
  if (start.hasSame(end, 'month')) {
    return `${start.toFormat('d')}–${end.toFormat('d MMMM, yyyy')}`;
  } else {
    return `${start.toFormat('d MMM')} – ${end.toFormat('d MMMM, yyyy')}`;
  }
};

const Header: React.FC = () => {
  const { year = null } = useParams<{ year?: string }>();

  const container = useRef<HTMLElement>(null);

  const [open, toggleOverlay] = useCycle(false, true);

  const { data } = useHeaderQuery({ variables: { year } });

  const { festival } = data || {};

  const { user, loading } = useAuthentication();

  const dates = useMemo(() => {
    if (!festival) return '';
    return (
      <>
        {dateRange(festival.startDate, festival.endDate)} in{' '}
        <Placename name="Wellington" traditionalName="Te Whanganui-a-Tara" />
      </>
    );
  }, [festival]);

  return (
    <header ref={container} className="header">
      <div className="header__logo">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="header__dates">{dates}</div>
      <div className="header__user">
        <HeaderSearch container={container} />
        {!loading && (
          <Button ghost className="user-button" onClick={() => toggleOverlay()}>
            <Avatar url={user?.profile?.picture?.small} name={user?.profile?.name || ''} />
            <span className="button__text">{user?.profile?.name || 'Log in'}</span>
            <Icon name="chevronDown" />
          </Button>
        )}
        <ThemeSwitcher />
      </div>
      {!loading && <Overlay user={user} open={open} onToggle={() => toggleOverlay()} />}
    </header>
  );
};

export default Header;
