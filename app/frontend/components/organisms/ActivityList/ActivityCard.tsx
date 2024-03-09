import { motion } from 'framer-motion';
import { ResultOf, graphql, readFragment } from '@/graphql';
import BlurrableImage from '@/components/molecules/BlurrableImage';

const ActivityCardPresenterFragment = graphql(`
  fragment ActivityCardPresenter on Person {
    id
    name
    city {
      id
      name
      traditionalName
    }
    country {
      id
      name
      traditionalName
    }
  }
`);

const ActivityCardPictureFragment = graphql(`
  fragment ActivityCardPicture on ActivityPicture {
    id
    medium
    blurhash
  }
`);

export const ActivityCardFragment = graphql(
  `#graphql
  fragment ActivityCard on Activity {
    id
    name
    type
    slug

    picture {
      ...ActivityCardPicture
    }

    presenters {
      ...ActivityCardPresenter
    }

    sessions {
      id
      startsAt
      endsAt
    }
  }
`,
  [ActivityCardPresenterFragment, ActivityCardPictureFragment]
);

export type ActivityCardActivity = ResultOf<typeof ActivityCardFragment>;

type ActivityCardProps = {
  activity: ActivityCardActivity;
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const picture = readFragment(ActivityCardPictureFragment, activity.picture);
  const presenters = readFragment(ActivityCardPresenterFragment, activity.presenters);

  return (
    <motion.article className="card activity-card">
      <div className="card__picture">
        {picture && (
          <BlurrableImage src={picture.medium} blurhash={picture.blurhash} alt={activity.name} />
        )}
      </div>
      <div className="card__title">{activity.name}</div>
    </motion.article>
  );
};

export default ActivityCard;
