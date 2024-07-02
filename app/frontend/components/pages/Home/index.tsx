import { ActivityType } from '@/graphql/types';
import useFestival from '@/hooks/useFestival';
import BATSIcon from '@/icons/BATSIcon';
import { Button } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';

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
          <Button size="4" variant="solid">
            Register for workshops
          </Button>

          <Button asChild size="3" variant="outline">
            <Link to="/$activityType" params={{ activityType: ActivityType.Workshop }}>
              Browse the programme
            </Link>
          </Button>
          <Button size="3" variant="outline">
            <BATSIcon size="lg" />
            Book tickets
          </Button>
        </div>
      </div>
    </div>
  );
};
