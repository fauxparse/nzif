import React from 'react';
import Balanced from 'react-balanced';
import { Link } from 'react-router-dom';
import pluralize from 'pluralize';

import Button from '@/atoms/Button';
import { useCurrentFestivalQuery } from '@/graphql/types';
import { ROUTES } from '@/Routes';

import './Home.css';

export const Component: React.FC = () => {
  const { data, loading } = useCurrentFestivalQuery();

  const festival = data?.festival;

  if (loading || !festival) return null;

  const days = festival.endDate.diff(festival.startDate, 'days').days + 1;

  return (
    <div className="home">
      <section className="hero">
        <h1>
          <small>Welcome to the</small>{' '}
          <Balanced as="span">{festival.id} New Zealand Improv Festival</Balanced>
        </h1>
        <Balanced as="p">{pluralize('day', days, true)} of shows, workshops, and events.</Balanced>
        <div className="hero__buttons">
          <Button
            large
            primary
            as={Link}
            to={ROUTES.REGISTRATION.path}
            text="Register now"
            icon="new"
          />
          <Button
            large
            as={Link}
            to={ROUTES.ACTIVITIES.buildPath({ type: 'workshops' })}
            text="Programme"
            icon="calendar"
          />
        </div>
      </section>
    </div>
  );
};

Component.displayName = 'Home';

export default Component;
