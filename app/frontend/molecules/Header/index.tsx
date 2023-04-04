import React, { useMemo } from 'react';
import { useHeaderQuery } from '../../graphql/types';
import { DateTime } from 'luxon';
import './Header.css';
import ThemeSwitch from './ThemeSwitch';

const dateRange = (start: DateTime, end: DateTime) => {
  if (start.hasSame(end, 'month')) {
    return `${start.toFormat('d')}–${end.toFormat('d MMMM, yyyy')}`;
  } else {
    return `${start.toFormat('d MMM')} – ${end.toFormat('d MMMM, yyyy')}`;
  }
};

const Header: React.FC = () => {
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
        <button className="button">
          <span className="button__text">{user?.name || 'Log in'}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.3163 19.4384C5.92462 18.0052 7.34492 17 9 17H15C16.6551 17 18.0754 18.0052 18.6837 19.4384M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <ThemeSwitch />
      </div>
    </header>
  );
};

export default Header;
