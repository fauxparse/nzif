import Button from '@/components/atoms/Button';
import useFestival from '@/hooks/useFestival';
import BATSIcon from '@/icons/BATSIcon';
import { Link } from '@tanstack/react-router';

import { ActivityType } from '@/graphql/types';
import './Home.css';

export const Home = () => {
  const festival = useFestival();

  return (
    <div className="body">
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

          <Button
            renderRoot={(props) => (
              <Link
                to="/$activityType"
                params={{ activityType: ActivityType.Workshop }}
                {...props}
              />
            )}
            size="large"
            variant="outline"
          >
            Browse the programme
          </Button>
          <Button size="large" variant="outline" leftSection={<BATSIcon size="large" />}>
            Book tickets
          </Button>
        </div>
      </div>
    </div>
  );
};
