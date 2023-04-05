import React, { useMemo } from 'react';
import { useHeaderQuery } from '../../graphql/types';
import { DateTime } from 'luxon';
import ThemeSwitch from './ThemeSwitch';
import { motion, useCycle } from 'framer-motion';
import UserIcon from './UserIcon';
import Overlay from './Overlay';
import './Header.css';

const dateRange = (start: DateTime, end: DateTime) => {
  if (start.hasSame(end, 'month')) {
    return `${start.toFormat('d')}–${end.toFormat('d MMMM, yyyy')}`;
  } else {
    return `${start.toFormat('d MMM')} – ${end.toFormat('d MMMM, yyyy')}`;
  }
};

const Header: React.FC = () => {
  const [open, toggleOverlay] = useCycle(false, true);

  const { data } = useHeaderQuery();

  const { festival, user } = data || {};

  const dates = useMemo(() => {
    if (!festival) return '';
    return `${dateRange(festival.startDate, festival.endDate)} in Te Whanganui-a-Tara`;
  }, [festival]);

  return (
    <header className="header">
      <div className="header__logo">NZIF {festival?.startDate?.year}</div>
      <div className="header__dates">{dates}</div>
      <div className="header__user">
        <button className="button" onClick={() => toggleOverlay()}>
          <span className="button__text">{user?.name || 'Log in'}</span>
          <UserIcon className="button__icon" />
        </button>
        <ThemeSwitch />
      </div>
      <Overlay open={open} onToggle={() => toggleOverlay()} />
    </header>
  );
};

export default Header;
