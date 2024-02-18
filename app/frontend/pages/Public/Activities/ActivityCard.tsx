import { map, sortBy, uniqBy } from 'lodash-es';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import Placename from '@/atoms/Placename';
import { Placename as PlacenameType, ProgrammeQuery } from '@/graphql/types';
import Skeleton from '@/helpers/Skeleton';
import BlurrableImage from '@/molecules/BlurrableImage';
import Card from '@/organisms/Card';
import sentence from '@/util/sentence';

type ActivityCardProps = {
  loading?: boolean;
  activity: ProgrammeQuery['festival']['activities'][number];
  path: string;
};

const ActivityCard: React.FC<ActivityCardProps> = ({ loading = false, activity, path }) => {
  const presenters = useMemo(() => sortBy(activity.presenters, 'name'), [activity.presenters]);

  const places = useMemo(
    () =>
      uniqBy(
        map(presenters, (t) =>
          t.country?.id === 'NZ' || t.country?.id === 'AU' ? t.city : t.country
        ).filter(Boolean) as PlacenameType[],
        'name'
      ),
    [presenters]
  );

  return (
    <Card
      as={Link}
      to={path}
      className="programme__activity"
      aria-hidden={loading || undefined}
      data-loading={loading || undefined}
    >
      {loading ? (
        <div className="card__image">
          <Skeleton loading={loading} className="workshop__image">
            <img alt="loading" />
          </Skeleton>
        </div>
      ) : (
        <div className="card__image">
          {activity.picture && (
            <BlurrableImage
              className="workshop__image"
              src={activity.picture.medium}
              blurhash={activity.picture.blurhash}
            />
          )}
        </div>
      )}
      <div className="card__details">
        <h4 className="card__title activity__name">
          <Skeleton text loading={loading}>
            {activity.name}
          </Skeleton>
        </h4>
        {loading ? (
          <>
            <div className="activity__presenters">
              <Skeleton paragraph lines={1} />
            </div>
            <div className="activity__placenames">
              <Skeleton rounded>
                <Placename name="Wellington" />
              </Skeleton>
            </div>
          </>
        ) : (
          <>
            <div className="activity__presenters">{sentence(sortBy(map(presenters, 'name')))}</div>
            <div className="activity__placenames">
              {places.map((place) => (
                <Placename
                  key={place.id}
                  name={place.name}
                  traditionalName={place.traditionalName ?? undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ActivityCard;
