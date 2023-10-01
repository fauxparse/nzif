import { forwardRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { motion, Variants } from 'framer-motion';
import { DateTime } from 'luxon';

import Button from '@/atoms/Button';
import Icon, { IconName } from '@/atoms/Icon';
import { DirectoryResultQuery, useDirectoryResultQuery } from '@/graphql/types';
import sentence from '@/util/sentence';

import { ROUTES } from './Routes';

const variants: Variants = {
  out: {
    scale: 1.25,
    opacity: 0,
  },
  in: {
    scale: 1,
    opacity: 1,
  },
};

const FLOORS: Record<string, string> = {
  'The Stage': 'Ground floor',
  'The Dome': 'First floor',
  'The Studio': 'Top floor',
} as const;

const ICONS: Record<string, IconName> = {
  'The Stage': 'floorGround',
  'The Dome': 'floorFirst',
  'The Studio': 'floorTop',
};

const Result = forwardRef<HTMLDivElement, unknown>((_, ref) => {
  const { id, timeslot } = useTypedParams(ROUTES.DIRECTORY.TIMESLOT.PERSON);

  const { data } = useDirectoryResultQuery({
    variables: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: id!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      time: DateTime.fromFormat(timeslot!, 'y-MM-dd-hhmm'),
    },
  });

  const [result, setResult] = useState<DirectoryResultQuery['directoryResult'] | null>(null);

  const [teaching, setTeaching] = useState(false);

  useEffect(() => {
    if (data) {
      setResult(data.directoryResult);
      setTeaching(
        data.directoryResult?.activity?.presenters?.some((presenter) => presenter?.id === id) ||
          false
      );
    }
  }, [data, id]);

  const time = timeslot && DateTime.fromFormat(timeslot, 'y-MM-dd-hhmm');

  if (!time) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      className="directory__result"
      variants={variants}
      initial="out"
      animate="in"
      exit="out"
    >
      {result?.activity ? (
        <div className="directory__session">
          <Button
            ghost
            as={Link}
            to={ROUTES.DIRECTORY.TIMESLOT.buildPath({ timeslot })}
            icon="arrowLeft"
            text="Back"
          />
          <div>
            <p>{`You are ${teaching ? 'teaching' : 'in'}`}</p>
            <h1>{result.activity.name}</h1>
            {!teaching && <p>with {sentence(result.activity.presenters.map((p) => p.name))}</p>}
          </div>
          {result.venue && (
            <div className="session__venue">
              <Icon name={ICONS[result.venue.room || ''] || 'location'} />
              <div className="venue__room">{result.venue.room}</div>
              <div className="venue__floor">
                {(result.venue.room && FLOORS[result.venue.room]) || result.venue.building}
              </div>
            </div>
          )}
        </div>
      ) : result ? (
        <div className="directory__session">
          <Button
            ghost
            as={Link}
            to={ROUTES.DIRECTORY.TIMESLOT.buildPath({ timeslot: timeslot })}
            icon="arrowLeft"
            text="Back"
          />
          <div>
            <h1>Sorry</h1>
            <p>
              We couldn’t find you in a workshop this {time.hour < 12 ? 'morning' : 'afternoon'}.{' '}
            </p>
            <p>Please see a Festival team member if you think this is a mistake.</p>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
});

Result.displayName = 'Result';

export default Result;
