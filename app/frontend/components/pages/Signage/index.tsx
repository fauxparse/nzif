import { useQuery } from '@apollo/client';
import { Button } from '@radix-ui/themes';
import clsx from 'clsx';
import * as htmlToImage from 'html-to-image';
import { groupBy, sortBy, toPairs } from 'lodash-es';
import { DateTime } from 'luxon';
import { useMemo, useRef } from 'react';
import { FragmentOf, graphql } from '@/graphql';
import { ActivityType } from '@/graphql/types';
import BATSIcon from '@/icons/BATSIcon';
import sentence from '@/util/sentence';
import classes from './Signage.module.css';

const SignageActivityFragment = graphql(
  `
  fragment SignageActivity on Activity @_unmask {
    id
    name
    type

    ...on Workshop {
      presenters {
        id
        name
      }
    }

    sessions {
      id
      startsAt
      endsAt

      slots {
        id
        startsAt
        endsAt
      }

      venue {
        id
        room
        building
      }
    }
  }
  `
);

type SignageActivity = FragmentOf<typeof SignageActivityFragment>;
type Slot = SignageActivity['sessions'][number]['slots'][number];
type SignageActivityWithVenue = SignageActivity & {
  venue: SignageActivity['sessions'][number]['venue'];
  startsAt: DateTime;
};

const SignageQuery = graphql(
  `
  query Signage {
    festival {
      activities {
        ...SignageActivity
      }
    }
  }
`,
  [SignageActivityFragment]
);

export const Signage = () => {
  const { loading, data } = useQuery(SignageQuery);

  const container = useRef<HTMLDivElement>(null);

  const activities = useMemo(
    (): [DateTime, SignageActivityWithVenue[]][] =>
      sortBy(
        (
          toPairs(
            groupBy(
              (data?.festival.activities || [])
                .filter((activity: SignageActivity) => activity.type !== ActivityType.Show)
                .flatMap((activity: SignageActivity) =>
                  activity.sessions
                    .filter((session) => session.startsAt.hour < 18)
                    .flatMap((session) =>
                      session.slots.map((slot) => [
                        slot,
                        {
                          ...activity,
                          venue: session.venue,
                          startsAt: session.startsAt,
                        } as SignageActivityWithVenue,
                      ])
                    )
                ),
              ([slot]: [Slot, SignageActivityWithVenue]) =>
                `${slot.startsAt.toISODate()}-${slot.startsAt.hour < 12 ? 'morning' : 'afternoon'}`
            )
          ) as [string, [Slot, SignageActivityWithVenue][]][]
        ).map(([_, activities]) => [
          activities[0][0].startsAt,
          activities.map(([_, activity]) => activity),
        ]),
        [([d]) => d]
      ),
    [data]
  );

  const download = () => {
    const el = container.current;

    if (!el) return;

    const signs = Array.from(el.childNodes);

    const downloadBatch = (startIndex = 0, batchSize = 10) => {
      if (startIndex >= signs.length) return;

      for (const sign of signs.slice(startIndex, startIndex + batchSize)) {
        if (sign instanceof HTMLElement) {
          const filename = sign.dataset.filename as string;
          htmlToImage
            .toPng(sign)
            .then((dataUrl: string) => {
              var link = document.createElement('a');
              link.download = filename;
              link.href = dataUrl;
              link.click();
            })
            .catch((error: Error) => {
              console.error('Oops, something went wrong!', error);
            });
        }
      }

      setTimeout(() => downloadBatch(startIndex + batchSize), 3000);
    };

    downloadBatch();
  };

  return (
    <div>
      <Button onClick={() => download()}>Download</Button>
      <div ref={container}>
        {activities.map(([date, activities], i) => (
          <div
            key={i}
            className={classes.sign}
            data-filename={`${date.toISODate()}-${date.hour < 12 ? 'am' : 'pm'}.png`}
          >
            <h1>
              {date.plus({ hours: 0 }).toFormat('EEEE d MMMM')} (
              {date.hour < 12 ? 'morning' : 'afternoon'})
            </h1>
            {sortBy(activities, [(a) => a.startsAt, (a) => a.venue?.room || '']).map((activity) => {
              const isOnsite = activity.venue?.building === 'BATS Theatre';
              return (
                <div
                  key={activity.id}
                  className={clsx(
                    classes.activity
                    // activity.venue?.building === 'BATS Theatre' ? classes.onsite : classes.offsite
                  )}
                  style={{
                    gridColumn: isOnsite ? '1' : '2',
                  }}
                >
                  <BATSIcon size="4" variant={isOnsite ? 'outline' : 'not'} />
                  <h4>{activity.name}</h4>
                  {'presenters' in activity && (
                    <div>
                      with {sentence(activity.presenters.map((presenter) => presenter.name))}
                    </div>
                  )}
                  <div>
                    {`${activity.startsAt.toFormat('h:mm')} ${activity.venue?.room ? 'in' : 'at'} `}
                    {[activity.venue?.room, !isOnsite && activity.venue?.building]
                      .filter(Boolean)
                      .join(' at ')
                      .replace(/^The /, 'the ')}
                    {isOnsite &&
                      (activity.venue?.room === 'The Dome' ? ' (upstairs)' : ' (downstairs)')}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
