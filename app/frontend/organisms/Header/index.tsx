import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCycle } from 'framer-motion';
import { DateTime } from 'luxon';

import Button from '../../atoms/Button';
import Placename from '../../atoms/Placename/Placename';
import ThemeSwitcher from '../../atoms/ThemeSwitcher';
import { useHeaderQuery } from '../../graphql/types';
import { useAuthentication } from '../Authentication/AuthenticationProvider';

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
  const container = useRef<HTMLElement>(null);

  const [open, toggleOverlay] = useCycle(false, true);

  const { data } = useHeaderQuery();

  const { festival } = data || {};

  const { user, loading } = useAuthentication();

  const dates = useMemo(() => {
    if (!festival) return '';
    return (
      <>
        {dateRange(festival.startDate, festival.endDate)} in{' '}
        <Placename name="Wellington" indigenousName="Te Whanganui-a-Tara" />
      </>
    );
  }, [festival]);

  return (
    <header ref={container} className="header">
      <div className="header__logo">
        <Link to="/">NZIF {festival?.startDate?.year}</Link>
      </div>
      <div className="header__dates">{dates}</div>
      <div className="header__user">
        <HeaderSearch container={container} />
        {!loading && (
          <Button
            toolbar
            className="user-button"
            icon="user"
            text={user?.name || 'Log in'}
            onClick={() => toggleOverlay()}
          />
        )}
        <ThemeSwitcher />
      </div>
      {!loading && <Overlay user={user} open={open} onToggle={() => toggleOverlay()} />}
    </header>
  );
};

export default Header;
