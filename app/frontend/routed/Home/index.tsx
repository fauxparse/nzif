import useFestival from '@/hooks/useFestival';
import { Link } from '@tanstack/react-router';
import Button from '@/components/Button';
import BATSIcon from '@/icons/BATSIcon';

import './Home.css';
import ThemeIcon from '@/icons/ThemeIcon';
import { useState } from 'react';
import useTheme from '@/hooks/useTheme';

export const Home = () => {
  const festival = useFestival();

  return (
    <div className="container">
      <div className="hero">
        <h1>
          <span className="hero__year">
            <span>20</span>
            <span>{festival.startDate.toFormat('yy')}</span>
          </span>{' '}
          <span className="hero__nzif">
            <span>New Zealand</span> <span>Improv</span> <span>Festival</span>
          </span>
        </h1>
        <div className="hero__dates">
          <span>
            {festival.startDate.toFormat('d')}–{festival.endDate.toFormat('d MMMM')}
          </span>
          <span>Te Whanganui-a-Tara</span>
        </div>
        <div className="hero__buttons">
          <p>
            A week of local, national, and international improvisation at BATS&nbsp;Theatre in
            Wellington.
          </p>
          <Button size="large" variant="solid" color="magenta">
            Register for workshops
          </Button>
          <Button component={Link} to="/workshops" size="large" variant="outline">
            Browse the programme
          </Button>
          <Button size="large" variant="outline" left={<BATSIcon size="large" />}>
            Book tickets
          </Button>
        </div>
      </div>
    </div>
  );
};
