import { Link } from 'react-router-dom';

import { ROUTES } from '@/Routes';
import { RegistrationStatusQuery } from '@/graphql/types';

type PausedProps = {
  festival: RegistrationStatusQuery['festival'];
};

const Paused: React.FC<PausedProps> = ({ festival }) => {
  return (
    <div className="inset">
      <div style={{ maxWidth: '60ch', paddingBlock: '8rem' }}>
        <h1>Registrations paused</h1>
        <div style={{ lineHeight: 2, fontSize: 'var(--font-size-legible)' }}>
          <p>
            Thanks for your interest in NZIF {festival.id}. Registrations are currently{' '}
            <b>on hold</b> while we process the initial batch of workshop allocations.
          </p>
          {festival.generalOpensAt && (
            <p>
              We expect to reopen registrations on {festival.generalOpensAt.toFormat('d MMMM')}. The
              best place to watch for updates on this is{' '}
              <a
                href="https://www.facebook.com/groups/NZIFGreenRoom"
                target="_blank"
                rel="noopener noreferrer"
              >
                the NZIF Green Room page on Facebook
              </a>
              .
            </p>
          )}
          <p>
            In the meantime, you can still{' '}
            <Link to={ROUTES.ACTIVITIES.buildPath({ type: 'workshops' })}>
              browse the programme
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Paused;
