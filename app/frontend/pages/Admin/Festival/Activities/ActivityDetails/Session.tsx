import { ActivityDetailsQuery } from '@/graphql/types';

type DetailsProps = {
  activity: ActivityDetailsQuery['festival']['activity'];
};

const Details: React.FC<DetailsProps> = () => <div className="inset"></div>;

export default Details;
