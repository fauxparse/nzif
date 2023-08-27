import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
import UserPopup from './UserPopup';

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

  const [popupOpen, setPopupOpen] = useState(false);

  const { data } = useHeaderQuery();

  const { festival } = data || {};

  const { user, loading } = useAuthentication();

  const [userButton, setUserButton] = useState<HTMLElement | null>(null);

  const dates = useMemo(() => {
    if (!festival) return '';
    return (
      <>
        {dateRange(festival.startDate, festival.endDate)} in{' '}
        <Placename name="Wellington" traditionalName="Te Whanganui-a-Tara" />
      </>
    );
  }, [festival]);

  const userButtonClicked = () => {
    if (user) {
      setPopupOpen((current) => !current);
    } else {
      toggleOverlay();
    }
  };

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
          <Button
            ref={setUserButton}
            ghost
            className="user-button"
            aria-expanded={popupOpen || undefined}
            onClick={userButtonClicked}
          >
            <Avatar small url={user?.profile?.picture?.small} name={user?.profile?.name || ''} />
            <span className="button__text">{user?.profile?.name || 'Log in'}</span>
            {user && <Icon name="chevronDown" />}
          </Button>
        )}
        {user && userButton && (
          <UserPopup
            user={user}
            reference={userButton}
            open={popupOpen}
            onClose={() => setPopupOpen(false)}
          />
        )}
        <ThemeSwitcher />
      </div>
      {!loading && <Overlay user={user} open={open} onToggle={() => toggleOverlay()} />}
    </header>
  );
};

export default Header;
